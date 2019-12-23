// @ts-ignore
import React from 'react'

// @ts-ignore
const withParent = (styles: React.CSSProperties = {}) => <P extends object>(
  Component: React.ComponentType<P>
) => (props: P) => (
  <div style={styles}>
    <Component {...props} />
  </div>
)

export default withParent
