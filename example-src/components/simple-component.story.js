import SimpleComponent from './simple-component'
import fixtures from './simple-component.fixture'

export default (storyGenerator) =>
  storyGenerator({
    title: 'SimpleComponent',
    Component: SimpleComponent,
    fixtures,
  })
