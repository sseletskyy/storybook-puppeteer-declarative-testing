# SPDT
Declarative testing of isolated React components using storybook as a renderer and puppeteer+jest as a test runner

The idea behind this module is to make testing of React components based on fixtures.

## Here is a a short description of the workflow:

* create a React component, e.g `Comment.js`
* create a fixture file with a set of properties for your component: `Comment.fixture.js`
* create a story file which is used by Storybook to generate versions of your component based on fixture file: `Comment.story.js`
* run `node_modules/.bin/spdt:generate-story-index` to generate `index.js` file for Storybook
* add asserts/expectations for the component in fixture file (see examples below)
* run `node_modules/.bin/spdt:generate-test-index` to generate `test-index.generated.js` file. 
* run `node_modules/.bin/spdt:generate-tests` to generate test files for each React component (which has story and fixture files), e.g. `Comment.generated.spdt.js`
* run Storybook server `npm run spdt:storybook`
* run generated tests using jest + puppeteer `npm run spdt:test`

## How to install **spdt** 

* Install it from npm `npm i -D spdt`
* Run initialization `node_modules/.bin/spdt:init` It will copy config files (jest, puppeteer, storybook) to predefined folder (by default `./spdt` )
* Copy generated config from terminal to your __package.json__ file


