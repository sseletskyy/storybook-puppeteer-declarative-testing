const { createElement } = require('react') //eslint-disable-line import/no-unresolved

function storyGenerator({ storiesOf, title, Component, fixtures }) {
  const stories = storiesOf(title, module)
  Object.keys(fixtures).forEach((key) => stories.add(key, () => createElement(Component, fixtures[key].props)))
}

module.exports = { storyGenerator }