// eslint-disable-next-line import/extensions,import/no-unresolved
import React from 'react'

export default function(props) {
  const { title, children } = props
  return (
    <div className="simple-component">
      <h1>{title}</h1>
      <br />
      {children}
    </div>
  )
}
