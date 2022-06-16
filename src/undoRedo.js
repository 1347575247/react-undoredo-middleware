
import {bindActionCreators, cacheCustomUndoHandlers, cacheCustomRedoHandlers} from "./helpers"
import {undoRedoActions} from "./actions"

function createUndoRedoMiddleware (extraAugments) {
	return () => dispatch => action => {
		/**
     * @param {Int} index: Add new Item(newIndex)/paste Item(new Index)/Drag to resort(oldIndex)
     * @param {Array} path: redux modify path
     * @param {primitive} newValue: [redux modify path]'s newValue
     * @param {primitive} oldValue: [redux modify path]'s oldValue
     * @param {string} $$UNDO_REDO_TYPE: action Type that supports undo/redo
     */
		const {index, path, newValue, oldValue, $$UNDO_REDO_TYPE} = action.payload || {}

		// undo/redo hanlder defined by user
		const {customUndoHandlers = {}, customRedoHandlers = {}} = extraAugments
		const customOptions = action.customOptions || {}

		// cache custom handlers
		cacheCustomUndoHandlers(customUndoHandlers)
		cacheCustomRedoHandlers(customRedoHandlers)

		const ADD_INTO_HISTORY = (
			$$UNDO_REDO_TYPE &&
      bindActionCreators(undoRedoActions.DEFAULT_ADD_HISTORY, dispatch)
		) || (() => {})

		const params = {
			type: $$UNDO_REDO_TYPE,
			index: index || -1,
			path: path || [],
			newValue: newValue || false,
			oldValue: oldValue || false,

			// undo actions' removed item, somtimes need to cache it
			cacheItem: null,
			...customOptions
		}

		ADD_INTO_HISTORY(params)

		return dispatch(action)
	}
}

const undoRedo = createUndoRedoMiddleware()

// bind a factory function for user to define a custom middleware
undoRedo.withExtraArgument = createUndoRedoMiddleware

export default undoRedo
