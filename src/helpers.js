import {customUndoHandlers, customRedoHandlers} from "./actions"

const hasOwn = Object.prototype.hasOwnProperty

function bindActionCreators (
	actionCreator,
	dispatch
) {
	return (...args) => dispatch(actionCreator(...args))
}

function isHistory (history) {
	return typeof history.undoStack !== "undefined" &&
    typeof history.redoStack !== "undefined" &&
    Array.isArray(history.undoStack) &&
    Array.isArray(history.redoStack)
}

function cacheCustomUndoHandlers (handlers) {
	for (let type in handlers) {
		if (hasOwn.call(handlers, type)) {
			customUndoHandlers[type] = handlers[type]
		}
	}
}

function cacheCustomRedoHandlers (handlers) {
	for (let type in handlers) {
		if (hasOwn.call(handlers, type)) {
			customRedoHandlers[type] = handlers[type]
		}
	}
}

export {
	bindActionCreators,
	isHistory,
	cacheCustomUndoHandlers,
	cacheCustomRedoHandlers,
	hasOwn
}
