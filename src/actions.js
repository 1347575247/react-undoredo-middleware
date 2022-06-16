import _ from "lodash"
import {isHistory} from "./helpers"

// built-in types
const undoRedoTypes = {
	// service type(built-in action type)
	ADD_NEW_ITEM: "ADD_NEW_ITEM",

	PASTE_ITEM: "PASTE_ITEM",

	UPDATE_POSITION: "UPDATE_POSITION",

	UPDATE_SETTINGS: "UPDATE_SETTINGS",

	// main type(Important)
	UNDO_ACTION: "UNDO_ACTION",

	REDO_ACTION: "REDO_ACTION",

	DEFAULT_ADD_HISTORY: "DEFAULT_ADD_HISTORY"
}

function createHistory (state) {
	state.undoStack = []
	state.redoStack = []
	state.undoItem = null
}

const undoRedoHandlers = {
	DEFAULT_ADD_HISTORY: (state, payload) => {
		console.log("ADD_ITEM_HISTORY", payload)

		// no initiate
		if (!isHistory(state)) {
			createHistory(state)
		}
		state.undoStack.push(payload)
		state.redoStack = []
		return {
			...state
		}
	},
	UNDO_ACTION: state => {
		// 撤销栈
		const {undoStack} = state
		const undoAction = undoStack.pop()
		const undoActionType = undoAction && undoAction.type

		// undo actions' removed item, somtimes need to cache it
		let undoItem = null

		// if it's user's custom undo type, exec custom hanlder
		if (undoActionType in customUndoHandlers) {
			const undoHandler = customUndoHandlers[undoActionType]
			const _state = undoHandler(state, undoAction, undoItem)
			return _state
		}

		// built-in undo handlers
		switch (undoActionType) {

			// undo [Add_NEW_ITEM]
			case undoRedoTypes.ADD_NEW_ITEM:
				undoItem = state.list.splice(undoAction.index, 1)
				undoAction.cacheItem = undoItem[0]
				break

			// undo [UPDATE_POSITION]
			case undoRedoTypes.UPDATE_POSITION:
				const {index: oldIndex} = undoAction
				const newIndex = state.list.findIndex(item => item.key === state.selectedKey)
				let updateItem = state.list.splice(newIndex, 1)
				state.list.splice(oldIndex, 0, updateItem[0])
				break

			// undo [PASTE_ITEM]
			case undoRedoTypes.PASTE_ITEM:
				const {index} = undoAction
				if (index === -1) break
				undoItem = state.list.splice(index, 1)
				undoAction.cacheItem = undoItem[0]
				break

			// undo [UPDATE_SETTINGS]
			case undoRedoTypes.UPDATE_SETTINGS:
				const {oldValue, path} = undoAction
				_.set(state, path, oldValue)
				break
			default:
				break
		}
		undoAction && state.redoStack.push(undoAction)

		state.selectedKey = ""
		return {
			...state
		}
	},
	REDO_ACTION: state => {
		const {redoStack} = state
		const redoAction = redoStack.pop()
		const redoActionType = redoAction && redoAction.type
		redoAction && state.undoStack.push(redoAction)

		// if it's user's custom undo type, exec custom hanlder
		if (redoActionType in customRedoHandlers) {
			const redoHandler = customRedoHandlers[redoActionType]
			const _state = redoHandler(state, redoAction)
			return _state
		}

		// built-in redo handlers
		switch (redoActionType) {

			// redo [Add_NEW_ITEM]
			case undoRedoTypes.ADD_NEW_ITEM:
				state.list.splice(redoAction.index, 0, redoAction.cacheItem)
				break

			// redo [PASTE_ITEM]
			case undoRedoTypes.PASTE_ITEM:
				state.list.splice(redoAction.index, 0, redoAction.cacheItem)
				break

			// redo [DRAG_TO_RESORT]
			case undoRedoTypes.UPDATE_POSITION:
				const {index: oldIndex} = redoAction
				const newIndex = state.list.findIndex(item => item.key === state.selectedKey)
				let updateItem = state.list.splice(oldIndex, 1)
				state.list.splice(newIndex, 0, updateItem[0])
				break

			// redo [UPDATE_SETTINGS]
			case undoRedoTypes.UPDATE_SETTINGS:
				const {newValue, path} = redoAction
				_.set(state, path, newValue)
				break

			default:
				break
		}

		state.selectedKey = ""
		return {
			...state
		}
	}
}

// built-in actions
const undoRedoActions = {
	/**
   * 撤销行为
   */
	UNDO_ACTION: payload => ({
		type: undoRedoTypes.UNDO_ACTION,
		payload
	}),

	/**
   * 重做行为
   */
	REDO_ACTION: payload => ({
		type: undoRedoTypes.REDO_ACTION,
		payload
	}),

	/**
   * 默认添加到历史记录行为
   */
	DEFAULT_ADD_HISTORY: payload => ({
		type: undoRedoTypes.DEFAULT_ADD_HISTORY,
		payload
	})
}

let customUndoHandlers = {}
let customRedoHandlers = {}

export {
	undoRedoTypes,
	undoRedoActions,
	undoRedoHandlers,

	// user defined undo/redo hand;ers
	customUndoHandlers,
	customRedoHandlers
}
