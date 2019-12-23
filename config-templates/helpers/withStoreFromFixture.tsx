/*
import React from 'react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

interface P extends Object {
  store?: object
}

const mockStore = configureMockStore()
const withStoreFromFixture = (Component: React.ComponentType<P>) => (props: P) => {
  const { store, ...propsWithoutStore } = props
  const mockedStore = mockStore(store)
  return (
    <Provider store={mockedStore}>
      <Component {...propsWithoutStore} />
    </Provider>
  )
}
export default withStoreFromFixture
*/
