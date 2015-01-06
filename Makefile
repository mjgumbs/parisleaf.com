6TO5_CMD = node_modules/.bin/6to5
MOCHA_CMD = node_modules/.bin/mocha
BROWSERIFY_CMD = node_modules/.bin/browserify
WATCHIFY_CMD = node_modules/.bin/watchify
SASS_CMD = sassc
WATCH_CMD = node_modules/.bin/watch
AUTOPREFIXER_CMD = node_modules/.bin/autoprefixer
BROWSER_SYNC = node_modules/.bin/browser-sync

6TO5_ARGS = --blacklist generators,letScoping
BROWSERIFY_ARGS = -t 6to5ify -t envify -t es3ify

SRC_JS = $(shell find src -name "*.js")
LIB_JS = $(patsubst src/%.js,lib/%.js,$(SRC_JS))


# Test with mocha
test: js
	$(MOCHA_CMD) lib/**/__tests__/*-test.js

# Build application
build: js browserify css

# Build application quickly
# Faster on first build, but not after that
fast-build: fast-js build

# Watch for changes
watch:
	make -j3 watch-css watch-js watchify

# Clean up
clean:
	rm -rf lib
	rm -f public/js/app.js
	rm -f public/css/app.css

browserify: public/js/app.js

watchify: src/client/app.js
	mkdir -p $(dir $@) && $(WATCHIFY_CMD) $< -o public/js/app.js $(BROWSERIFY_ARGS)

public/js/app.js: src/client/app.js
	mkdir -p $(dir $@) && $(BROWSERIFY_CMD) $< -o $@ $(BROWSERIFY_ARGS)

# Transpile JavaScript using 6to5
js: $(LIB_JS)

$(LIB_JS): lib/%.js: src/%.js
	mkdir -p $(dir $@) && $(6TO5_CMD) $< -o $@ $(6TO5_ARGS)

fast-js:
	$(6TO5_CMD) src -d lib $(6TO5_ARGS)

watch-js:
	$(6TO5_CMD) src -d lib $(6TO5_ARGS) -w

# Compile Sass
css: public/css/app.css

public/css/app.css: sass/app.sass
	mkdir -p $(dir $@) && $(SASS_CMD) $< \
	| $(AUTOPREFIXER_CMD) > $@
watch-css:
	$(WATCH_CMD) "make css" sass

browser-sync:
	$(BROWSER_SYNC) start --proxy "localhost:3000" --files "public/css/app.css"

.PHONY: test build fast-build watch clean browserify watchify js fast-js watch-js css watch-css
