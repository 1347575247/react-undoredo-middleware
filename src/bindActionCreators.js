function bindActionCreator(
  actionCreator,
  dispatch
) {
  return (...args) => dispatch(actionCreator(...args))
}

export default bindActionCreator