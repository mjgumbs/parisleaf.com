'use strict';

import React from 'react';
import tweenState from 'react-tween-state';
import MediaMixin from 'react-media-mixin';

import Flux from 'flummox';
let ProjectActions = Flux.getActions('ProjectActions');
let ProjectStore = Flux.getStore('ProjectStore');

import Button from './Button';
import Header from './Header';
import AppLink from './AppLink';

import { isCaseStudy } from '../utils/ProjectUtils';
import { rhythm } from '../theme';

let style = {
  _: {
    position: 'relative',
  },
};

let ProjectIndexHandler = React.createClass({

  mixins: [MediaMixin],

  statics: {
    prepareForRun() {
      return ProjectActions.getProjects();
    },
  },

  getInitialState() {
    return {
      projects: ProjectStore.getProjects(),
    };
  },

  contextTypes: {
    media: React.PropTypes.object,
  },

  componentDidMount() {
    ProjectStore.addListener('change', this.projectStoreDidChange);
  },

  componentWillUnmount() {
    ProjectStore.removeListener('change', this.projectStoreDidChange);
  },

  projectStoreDidChange() {
    this.setState({
      projects: ProjectStore.getProjects(),
    });
  },

  render() {
    let projectHeight = this.getProjectRhythmHeight();

    let { projects, totalRows } = this.packProjects();

    projects = projects
      .map(item =>
        <ProjectIndexItem
          project={item.project}
          media={this.state.media}
          width={item.width}
          height={projectHeight}
          x={item.x}
          y={item.y}
          key={item.project.get('ID')}
        />
      );

    let _style = Object.assign({
      height: rhythm(projectHeight * totalRows),
    }, style._);

    return (
      <div className="ProjectIndex-itemContainer" style={style._}>
        {projects}
      </div>
    );
  },

  /**
   * Use a stupid/naive bin-packing algorithm to sort projects
   * @params {array} [projects] - Defaults to this.state.projects
   * @returns {object} Object describing result, with fields totalHeight and
   *   projects. projects is an array of objects, where each object has fields:
   *   project, width, x, and y.
   */
  packProjects(projects = this.state.projects) {
    let completeRows = new Set();
    let rows = new Set();

    projects.forEach(project => {

      project = {
        project,
        width: this.getProjectRelativeWidth(project),
      };

      // If project width is 1, create row, add project, and mark as complete,
      // then return
      if (project.width === 1) {
        addProjectToRow(project, createRow());
        return;
      }

      // Check if existing rows have room
      for (let row of rows) {

        // Check if there's room on this row
        if (row.width + project.width <= 1) {
          addProjectToRow(project, row);

          // Finish
          return;
        }

        // Else keep going
        continue;
      }

      // If no rows have room, create a new one
      addProjectToRow(project, createRow());
    });

    function createRow() {
      let row = {
        projects: [],
        width: 0,
      };

      rows.add(row);

      return row;
    }

    function addProjectToRow(project, row) {
      project.x = row.width;
      row.width += project.width;
      row.projects.push(project);

      if (row.width === 1) {
        // Mark row as completed
        completeRows.add(row);
        rows.delete(row);
      }
    }


    completeRows = Array.from(completeRows)
      // Now that there are no more projects to pack, mark leftover rows
      // as complete
      .concat(Array.from(rows).sort((row1, row2) => row1.width - row2.width))

    let completeProjects = completeRows// Reduce to array of projects
      .reduce((result, row, y) => {
        row.projects.forEach(project => project.y = y);
        result = result.concat(row.projects);
        return result;
      }, []);

    return {
      projects: completeProjects,
      totalRows: completeRows.length,
    };
  },

  /**
   * Get the relative width of a project, where a row is width = 1
   */
  getProjectRelativeWidth(project) {
    let _isCaseStudy = isCaseStudy(project);

    if (this.context.media.l) {
      return _isCaseStudy ? 0.5 : 0.25;
    } else if (this.context.media.s) {
      return _isCaseStudy ? 1 : 0.5;
    } else {
      return 1;
    }
  },

  /**
   * Get rhythm height of a project. Same for all projects, depends on
   * window size.
   */
  getProjectRhythmHeight() {
    return 10;
  }

});

let itemStyle = {
  _: {
    position: 'absolute',
    backgroundColor: 'gray',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    padding: rhythm(1),
    transitionProperty: 'left, top',
    transitionDuration: '500ms',
  },

  overlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    color: '#fff',
    padding: rhythm(1),
    textAlign: 'center',
  },
};

let ProjectIndexItem = React.createClass({

  mixins: [tweenState.Mixin],

  getInitialState() {
    return {
      hover: null,
      overlayVisibility: null,
    };
  },

  componentDidMount() {
    this.updateOverlayVisibility();
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.overlayShouldBeVisible() !== this.overlayShouldBeVisible(prevProps, prevState)) {
      this.updateOverlayVisibility();
    }
  },

  overlayShouldBeVisible(props = this.props, state = this.state) {
    return !!(
      state.hover
    );
  },

  onMouseEnter() {
    this.setState({hover: true});
  },

  onMouseLeave() {
    this.setState({hover: false});
  },

  updateOverlayVisibility() {
    this.tweenState('overlayVisibility', {
      endValue: this.overlayShouldBeVisible() ? 1 : 0,
    });
  },

  render() {
    let { project, width, height, x, y } = this.props;
    let overlayVisibility = this.getTweeningValue('overlayVisibility');

    let _style = Object.assign({
      height: rhythm(height),
      width: `${width * 100}%`,
      left: `${x * 100}%`,
      top: rhythm(y * height),
    }, itemStyle._);

    if (project.get('featured_image')) {
      let imageUrl = project.get('featured_image').get('source');
      _style.backgroundImage = `url(${imageUrl})`;
    }

    let overlayStyle = Object.assign({
      opacity: overlayVisibility,
    }, itemStyle.overlay);

    return (
      <Button
        component={AppLink}
        className="ProjectIndex-itemContainer-item"
        style={_style}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <article style={overlayStyle}>
          <Header level={2}>{project.get('title')}</Header>
        </article>
      </Button>
    );
  },

});

export default ProjectIndexHandler;
