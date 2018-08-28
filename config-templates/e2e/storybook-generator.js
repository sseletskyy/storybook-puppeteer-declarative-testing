import React from 'react'
import { storiesOf } from '@storybook/react' // eslint-disable-line import/no-extraneous-dependencies
// import 'd3-selection-multi' TODO add custom import

// example:
//   storiesOf('MallStatsBarChartD3', module)
//     .add('Example_1', () => <Coponent {...fixtures.[key].props} />)

const storyGenerator = ({ title, Component, fixtures }) => {
  const stories = storiesOf(title, module)
  // eslint-disable-next-line react/jsx-filename-extension
  Object.keys(fixtures).forEach((key) => stories.add(key, () => <Component {...fixtures[key].props} />))
}

export default storyGenerator
