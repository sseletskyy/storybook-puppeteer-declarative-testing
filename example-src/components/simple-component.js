import React from 'react' //eslint-disable-line

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
