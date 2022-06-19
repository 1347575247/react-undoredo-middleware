import initialState from './state'
import {undoRedoHandlers, undoRedoTypes} from 'react-undoredo-middleware'

const counterReducer = (state=initialState, action) => {
  const {payload} = action
  switch(action.type) {
    case 'increment':
      state.value += 1
      return {...state}
    case 'decrement':
      state.value -= 1
      return {...state}
    // register
		case undoRedoTypes.DEFAULT_ADD_HISTORY:
			state = undoRedoHandlers.DEFAULT_ADD_HISTORY(state, payload)
      return {...state}
    case undoRedoTypes.UNDO_ACTION:
      state = undoRedoHandlers.UNDO_ACTION(state, payload)
      return {...state}
    case undoRedoTypes.REDO_ACTION:
      state = undoRedoHandlers.REDO_ACTION(state, payload)
      return {...state}
    default:
      return state
  }
}

export default counterReducer