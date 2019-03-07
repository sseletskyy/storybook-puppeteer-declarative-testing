# SPDT - Storybook Puppeteer Declarative Testing
<p align="center">
  [![Codeship Status for sseletskyy/storybook-puppeteer-declarative-testing](https://app.codeship.com/projects/68070880-222e-0137-f223-6a5a7fbcefce/status?branch=master)](https://app.codeship.com/projects/329679)

  <a href="https://www.npmjs.com/package/spdt">
    <img src="https://img.shields.io/npm/v/spdt.svg"
         alt="npm version">
  </a>
  <a href="https://packagephobia.now.sh/result?p=spdt">
    <img src="https://packagephobia.now.sh/badge?p=spdt"
         alt="install size">
  </a>
  <a href="https://github.com/sseletskyy/storybook-puppeteer-declarative-testing/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/spdt.svg"
         alt="license">
  </a>
  <a href="https://david-dm.org/sseletskyy/storybook-puppeteer-declarative-testing">
    <img src="https://david-dm.org/sseletskyy/storybook-puppeteer-declarative-testing/status.svg"
         alt="dependency status">
  </a>
</p>


# Overview
Declarative testing of isolated React components using storybook as a renderer and puppeteer+jest as a test runner

The idea behind this module is to make testing of React+D3 components based on fixtures.

## Here is a short description of the workflow:

* create a React component, e.g `Comment.js`
* create a fixture file with a set of properties for your component: `Comment.fixture.js`
* create a story file `Comment.story.js` which is used by Storybook to generate versions of your component based on fixture file:
* run `node_modules/.bin/spdt:generate-story-index` to generate `.spdt/index.js` file for Storybook
* add asserts/expectations for the component in fixture file (see examples below)
* run `node_modules/.bin/spdt:generate-test-index` to generate `.spdt/test-index.generated.js` file.
* run `node_modules/.bin/spdt:generate-tests` to generate test files for each React component (which has story and fixture files), e.g. `Comment.generated.spdt.js`
* run Storybook server `npm run spdt:storybook`
* run generated tests using jest + puppeteer `npm run spdt:test` (in another terminal tab)

## How to install **spdt**

* Install it from npm `npm i -D spdt`
* Run initialization `node_modules/.bin/spdt:init` It will copy config files (jest, puppeteer, storybook) to predefined folder (by default `./spdt` )
* Copy generated scripts from terminal to your __package.json__ file

```
    "spdt:generate-story-index": "./node_modules/.bin/spdt:generate-story-index",
    "spdt:generate-test-index": "./node_modules/.bin/spdt:generate-test-index",
    "spdt:generate-tests": "./node_modules/.bin/spdt:generate-tests",
    "spdt:test": "jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:test:chrome": "HEADLESS=false jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:test:chrome:slow": "SLOWMO=1000 HEADLESS=false jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:storybook": "start-storybook -p 9009 -c ./.spdt",
    "spdt": "npm run spdt:generate-story-index && npm run spdt:generate-test-index && npm run spdt:generate-tests && npm run spdt:storybook"
```

## Which npm modules need to be installed 
* @storybook/react@5.x
* @babel/node (is used for generating test files)
* @babel/core
* puppeteer@^1.13.0
* jest-puppeteer@^4.0.0
* react@16.x 

## How to use

For example you have a react component like this

```
// src/components/SimpleComponent+.js

import React from 'react'

export default function(props) {
  const { title, children } = props
  return (
    <div className="simple-component">
      {title}
      <br />
      {children}
    </div>
  )
}
```

Create a fixture file `SimpleComponent.fixture.js` inside of `__tests__` folder near the component

```
// file src/components/__tests__/SimpleComponent.fixture.js

export default {
  fixtureOne: {
    props: {
      title: 'Component Title',
      children: 'Some children components',
    },
    spdt: {
      checkSelector: 'div.simple-component',
    },
  },
  fixtureTwo: {
    props: {
      title: 'Another Title',
      children: 'Some children components',
    },
    spdt: {
      checkSelector: 'div.simple-component',
    },
  },
}
```

Here is a schema of the fixture file
```
{
    [unique name of fixture]: {
        props: { ... }, // list of all props for your component
        spdt: { ... }, // list of assertions such as checkSelector, checkAxes, checkBars, checkArcs, etc.
    },
    [another fixture]: ...

}
```

Create a file `SimpleComponent.story.js` inside of `__tests__` folder

```
// file src/components/__tests__/SimpleComponent.story.js

const { storiesOf } = require('@storybook/react')
import SimpleComponent from '../SimpleComponent'
import fixtures from './SimpleComponent.fixture'

export default (storyGenerator) =>
  storyGenerator({
    storiesOf,
    title: 'SimpleComponent',
    Component: SimpleComponent,
    fixtures,
  })
```

Now run `npm run spdt` to call four commands sequencially
* `spdt:generate-story-index` - it will generate `./.spdt/index.js` for Storybook
* `spdt:generate-test-index` - it will generate a `./.spdt/test-index.generated.js` for TestGenerator
* `spdt:generate-tests` - it will generate `<your component name>.generated.spdt.js` files based on pairs (story.js + fixture.js)
* `spdt:storybook` - it will run Storybook server, available at http://localhost:9009

If everything went well and Storybook started to work you can run generated tests
```
npm run spdt:test
```

## example of a complicated component with dependencies such as Redux, Router

```
// file src/components/Article/Comment.js

import DeleteButton from './DeleteButton'
import { Link } from 'react-router-dom'
import React from 'react'

const Comment = (props) => {
  const comment = props.comment
  const show = props.currentUser && props.currentUser.username === comment.author.username
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to={`/@${comment.author.username}`} className="comment-author">
          <img src={comment.author.image} className="comment-author-img" alt={comment.author.username} />
        </Link>
        &nbsp;
        <Link to={`/@${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{new Date(comment.createdAt).toDateString()}</span>
        <DeleteButton show={show} slug={props.slug} commentId={comment.id} />
      </div>
    </div>
  )
}

export default Comment
```

A file `Comment.fixture.js` inside of `__tests__` folder

```
// file src/components/Article/__tests__Comment.fixture.js

export default {
  fixture1: {
    props: {
      comment: {
        id: 'id123',
        body: 'some text',
        author: {
          username: 'Author name',
          image: 'https://i.pinimg.com/originals/b6/89/81/b6898148bfa9df9e67330fca31571f9b.png',
        },
        createdAt: 'Sat Aug 25 2018',
      },
      slug: 'slug123',
      currentUser: {
        username: 'user name',
      },
    },
    spdt: {
      checkSelector: ['div.card', 'div.card-footer', 'img.comment-author-img']
    },
  },
}
```


A file `Comment.story.js` inside of `__tests__` folder

```
import React from 'react'
import { Route, BrowserRouter, browserHistory } from 'react-router-dom'
import { Provider } from 'react-redux'
import reducer from '../../../reducer'
import { createStore } from 'redux'
import Comment from '../Comment'
import fixtures from './Comment.fixture'
const { storiesOf } = require('@storybook/react')

const Component = (props) => (
  <div>
    <Provider store={createStore(reducer)}>
      <BrowserRouter history={browserHistory}>
        <Route path="/" component={() => <Comment {...props} />} />
      </BrowserRouter>
    </Provider>
  </div>
)

export default (storyGenerator) =>
  storyGenerator({
    storiesOf,
    title: 'Comment',
    Component: Component,
    fixtures,
  })
```

Run `npm run spdt` and then `npm run spdt:test` in another terminal tab
and you should see results of jest test runner

```
> npm run spdt:test

> react-redux-realworld-example-app@0.1.0 spdt:test .../react-redux-realworld-example-app
> jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js

Setup Test Environment.
 PASS  src/components/Article/__tests__/Comment.generated.spdt.js
  Comment - fixture fixture1
    ✓ should find component matching selector [div.card] 1 time(s) (16ms)
    ✓ should find component matching selector [div.card-footer] 1 time(s) (8ms)
    ✓ should find component matching selector [img.comment-author-img] 1 time(s) (4ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.372s, estimated 2s
Ran all test suites.
Teardown Puppeteer
Teardown Test Environment.
```


## SPDT Declarations

Use these declarations as keys in fixtures 
```
export default {
  [fixture name]: {
    props: { ... },
    spdt: {
      [declaration name]: [declaration value]
    }
  }
}
```
### checkSelector

Value can be
* `string` , e.g. 'div.className'
* `object` , e.g. {selector: 'div.className', length: 0}
* `array` of strings of objects, e.g. ['div.className', {selector: 'li', length: 5}]

This assertion will generate a separate `it` test to check provided selector

```
    it('should find component matching selector [div.card] 1 time(s)', async () => {
      const components = await iFrame.$$('div.card')
      const expected = 1
      expect(components).toHaveLength(expected)
    }),
```

### checkSvg

Value can be of `Boolean` type

* value `true` means that `it` test will be generated to check `svg` tag is present on the page
* value `false` means that `it` test won't be generated

```
    it('should load component as <svg>', async () => {
      const component = await iFrame.$('svg')
      expect(component._remoteObject.description).toMatch('svg') // eslint-disable-line no-underscore-dangle
    })`
```

### checkAxes

Value can be of `Number` type

* value means the number of expected axes of D3 chart based on selector `g.axis`

```
    it('should have ${checkAxes} axes', async () => {
      const axes = await iFrame.$$('g.axis')
      const expected = ${checkAxes}
      expect(axes).toHaveLength(expected)
    })`
```

### checkBars

Value can be of `Boolean` type

* value `true` means that `it` test will be generated to check selector `rect.bar` has found elements as many as in array `fixture.props.data`
* value `false` means that `it` test won't be generated

```
    it('should have ${checkBarsValue} bars according to fixture data', async () => {
      const bars = await iFrame.$$('rect.bar')
      const expected = ${checkBarsValue} // fixture.props.data.length
      expect(bars).toHaveLength(expected)
    })`
```

### checkArcs

Value can be of `Boolean` type

* value `true` means that `it` test will be generated to check selector `path.arc` has found elements as many as in array `fixture.props.data`
* value `false` means that `it` test won't be generated

```
    it('should have ${checkArcsValue} arcs according to fixture data', async () => {
      const arcs = await iFrame.$$('path.arc')
      const expected = ${checkArcsValue} // fixture.props.data.length
      expect(arcs).toHaveLength(expected)
    })`
```

### Custom Declarations
When you run initialization `node_modules/.bin/spdt:init`
it creates the file *test-declarations.js*  and a directory *custom-declarations* in the folder *.spdt*
Use the example *testH1* declaration as a guideline to add more custom declarations 

General requirements
* The file *test-declarations.js* should export an object. 
* The key of the object is the name of a custom declaration
* The value is a function which takes a fixture and returns a string - generated it test for puppeteer+jest environment 
