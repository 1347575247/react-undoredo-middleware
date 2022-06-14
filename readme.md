jsThis is a middleware  base on redux. You don't need to worry about your undo/redo code and the service code mess up. when some opearation like **add new item, paste item, drag item to resort**, .etc. you just need to add a sign named **$$UNDO_REDO_TYPE** to your redux action's payload, talk to the middleware that this operation is supporting undo/redo features.

## Installation

Using npm:

```
$ npm i --save react-undoredo-middleware
```

## Usage

### 1. Register

**register** in redux index.js:

```js
import {undoRedo} from "react-undoredo-middleware"
import { createStore, compose, applyMiddleware } from "redux"
import PanelTypes from "./Modules/PanelModule/types"
import PanelActions from "./Modules/PanelModule/actions"

const undoRedoWithExtraArgument = undoRedo.withExtraArgument({ADD_INTO_HISTORY_ACTION: PanelActions[PanelTypes.DEFAULT_ADD_HISTORY]})

const store = createStore(reducer, applyMiddleware( undoRedoWithExtraArgument, logger))

export default store
```

you need to add a third arg name **ADD_INTO_HISTORY_ACTION** to talk to the middleware your redux action, this action functionality is simple, just to **push the operation that supports undo/redo to the history stack**.

**PanelActions:**

```js
import Types from "../types"

export default {
    /**
   * Undo action
   */
	UNDO_ACTION: payload => ({
		type: Types.UNDO_ACTION,
		payload
	}),

	/**
   * Redo action
   */
	REDO_ACTION: payload => ({
		type: Types.REDO_ACTION,
		payload
	}),
	/**
   * add the operation to the history stack
   */
	DEFAULT_ADD_HISTORY: payload => ({
		type: Types.DEFAULT_ADD_HISTORY,
		payload
	})
}
```

**PanelTypes:**

```js
export default {
	...
	DEFAULT_ADD_HISTORY: "DEFAULT_ADD_HISTORY"
}
```

so the third arg **ADD_INTO_HISTORY_ACTION** just the simple action defined in your redux action list. 

In addition, undo/redo stack need to init by yourself like below.

```
let State = {
	...
	undoStack: [],
	redoStack: [] 
}
```

### 2. Use

**In service Component:**

​	When drag new item to the target panel and down. we would dispatch an action to talk to the redux we add a new item, like below:

```js
import {undoRedoTypes} from "react-undoredo-middleware"

const onAdd = (evt) => {
  console.log("--onAdd evt--", evt)

  // Comp Type
  const type = evt.clone.getAttribute("data-type")

  // Drag item's new index
  const newIndex = evt.newIndex

  // Component props
  const defaultProps = evt.clone.getAttribute("data-schema") && JSON.parse(evt.clone.getAttribute("data-schema"))

  // dispatch an action to update
  ADD_NEW_ITEM({ type, index: newIndex, key: `${type}-${nanoid()}`, defaultProps, $$UNDO_REDO_TYPE: undoRedoTypes.ADD_NEW_ITEM })

}
```

```js
const onKeyDown = evt => {
  const {code, ctrlKey, shiftKey} = evt

  // redo
  if (code === KeyType.KeyZ && ctrlKey && shiftKey) {
    props.REDO_ACTION()
  }

  // undo
  if (code === KeyType.KeyZ && ctrlKey && !shiftKey) {
    props.UNDO_ACTION()
  }

}
```

**In redux:**

​	we need to define action handlers to handle undo/redo, and default add item to stack.

```js
import {undoRedoTypes} from "react-undoredo-middleware"
import _ from "lodash"

export default {
    // *** middleware will dispatch this action
	DEFAULT_ADD_HISTORY: (state, payload) => {
		state.undoStack.push(payload)
		state.redoStack = []
		return {
			...state
		}
	},
    // *** service component trigger
	UNDO_ACTION: state => {
		const {undoStack} = state
		const undoAction = undoStack.pop()
		const undoActionType = undoAction && undoAction.type
		let undoItem = null 

		switch (undoActionType) {
			// undo ADD_NEW_ITEM
			case undoRedoTypes.ADD_NEW_ITEM:
				undoItem = state.list.splice(undoAction.index, 1)
				undoAction.cacheItem = undoItem[0]
				break
			default:
				break
		}
		undoAction && state.redoStack.push(undoAction)

		return {
			...state
		}
	},
    // *** service component trigger
	REDO_ACTION: state => {
		const {redoStack} = state
		const redoAction = redoStack.pop()
		const redoActionType = redoAction && redoAction.type
		redoAction && state.undoStack.push(redoAction)
		switch (redoActionType) {
			// redo ADD_NEW_ITEM
			case undoRedoTypes.ADD_NEW_ITEM:
				state.list.splice(redoAction.index, 0, redoAction.cacheItem)
				break

			default:
				break
		}

		return {
			...state
		}
	}
}
```

See the [package source](https://github.com/1347575247/react-undoredo-middleware) for more details.