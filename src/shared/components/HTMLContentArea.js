'use strict';

import React from 'react';
import chroma from 'chroma-js';
import { color } from '../theme';
import PLSlider from './PLSlider';
import Video from './Video';
import MoreFromBlog from './MoreFromBlog';

let HTMLContentArea = React.createClass({

  contextTypes: {
    flux: React.PropTypes.any.isRequired,
  },

  renderSliders() {
    // query selector
    let slidersObject = document.querySelectorAll('.Slider'); // Scoped correctly?

    // scope it within this dom node only // TODO
    let sliders = Array.from(slidersObject);
    // loop thru sliders
    sliders.map(function(slider) {
      let images = Array.from(slider.querySelectorAll(':scope > img'));
      
      images = images.map(function(image) {
        return (<div><img style={{maxWidth: '100%'}} src={image.src} /></div>);
      });
      
      React.render(
        <PLSlider>
          { images }
        </PLSlider>
      , slider);
     
    });
  },

  renderVideos() {
    let videos = Array.from(document.querySelectorAll('div.video-shortcode'));
    // for each
    videos.map(function(video) {
      React.render(
        <Video src={video.dataset.src} content={video.dataset.content} />,
        video      
      );
    });
    
  },

  renderMoreFromBlog() {
    let moreFromBlogs = Array.from(document.querySelectorAll('.more_from_blog'));
    
    let self = this;

    moreFromBlogs.forEach(async function(moreFromBlog) { 
      let slug1 = moreFromBlog.dataset.blog_1;
      let slug2 = moreFromBlog.dataset.blog_2;

      let PostActions = self.context.flux.getActions('posts');
      await PostActions.getPostBySlug(slug1);
      await PostActions.getPostBySlug(slug2);
      
      let PostStore = self.context.flux.getStore('posts');
      let post1 = PostStore.getPostBySlug(slug1);
      let post2 = PostStore.getPostBySlug(slug2);
      
      let posts = [post1, post2];
      //console.log(posts); 
      //React.render(<MoreFromBlog posts={posts} />, moreFromBlog);
    });
  },

  componentDidMount() {
    this.renderSliders();
    this.renderVideos();
    this.renderMoreFromBlog();
  },

  render() {
    let { html, primaryColor } = this.props;

    let primaryTextColor = chroma(primaryColor).luminance() < 0.5
      ? color('lightGray')
      : color('text');

    return (
      <div>
        <style>{`
          .HTMLContentArea--primary {
            background-color: ${primaryColor || 'none'};
            color: ${primaryTextColor}
          }
        `}</style>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }

});

export default HTMLContentArea;
