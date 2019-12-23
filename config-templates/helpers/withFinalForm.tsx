/*
import React from 'react'
import { Form } from 'react-final-form'

interface Props {
  finalForm: {
    initialValues: {
      [field: string]: any
    }
    onSubmit: (values: any) => void
  }
}

const withFinalForm = <P extends Props>(Component: React.ComponentType<P>) => ({
  ...props
}: P) => {
  const { initialValues, onSubmit } = props.finalForm
  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {({ form: { change } }) => <Component {...props} change={change} />}
    </Form>
  )
}

export default withFinalForm
*/
