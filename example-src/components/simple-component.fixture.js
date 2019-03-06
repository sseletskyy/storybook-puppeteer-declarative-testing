export default {
  fixtureOne: {
    props: {
      title: 'Component Title',
      children: 'Some children components',
    },
    spdt: {
      checkSelector: 'div.simple-component',
      customDeclarativeTest: 'Component Title',
    },
  },
}
