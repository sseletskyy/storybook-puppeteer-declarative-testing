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
  fixtureTwo: {
    props: {
      title: 'Component Title',
      children: 'Some children components',
    },
    spdt: {
      checkSelector: 'div.simple-component',
      customDeclarativeTest: null,
    },
  },
}
