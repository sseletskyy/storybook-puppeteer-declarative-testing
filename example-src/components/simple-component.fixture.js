export default {
  fixtureOne: {
    props: {
      title: 'Component Title',
      children: 'Some children components',
    },
    e2e: {
      checkSelector: 'div.simple-component',
    },
  },
}
