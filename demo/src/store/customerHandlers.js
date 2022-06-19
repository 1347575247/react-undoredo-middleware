

const undoHandlers = {
  /**
   * 
   * @param {*} state redux state 
   * @param {*} undoAction when redo something, we need to cache it to the undoAction
   * @param {*} undoItem cache Item(like sometimes you remove a item but may recover it in the future)
   */
  add: (state, undoAction, undoItem) => {
    state.value -= 1
		return state
  },
  minus: (state, undoAction, undoItem) => {
    state.value += 1
		return state
  }
}


const redoHandlers = {
  /**
  * 
  * @param {*} state redux state 
  * @param {*} undoAction when undo something, we need to cache it to the redoAction
  */
 add: (state, redoAction) => {
    console.log(state)
    state.value += 1
		return state
  },
  minus: (state, undoAction, undoItem) => {
    state.value -= 1
		return state
  }
}

export {
  undoHandlers,
  redoHandlers
}