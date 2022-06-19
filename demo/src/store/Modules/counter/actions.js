export default {
  Increment: (payload, customerOptions) => ({
    type: 'increment',
    payload,
    customerOptions
  }),
  Decrement: (payload, customerOptions) => ({
    type: 'decrement',
    payload,
    customerOptions
  })
}