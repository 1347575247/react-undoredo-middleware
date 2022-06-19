## Introduction

![虚拟列表](https://user-images.githubusercontent.com/45328460/174484654-a68dfad7-f895-4882-b9aa-cbb4a4972693.gif)

This is a middleware base on redux. You don't need to worry about your undo/redo code and the service code mess up. when some opearation like **add new item, paste item, drag item to resort**, .etc. you just need to add a sign named **$$UNDO_REDO_TYPE** to your redux action's payload, talk to the middleware that this operation is supporting undo/redo features.

## Installation

Using npm:

```
$ npm i --save react-undoredo-middleware
```

## Usage

### 1. Register Middleware

**In your reducer:**

```js
import {undoRedoHandlers, undoRedoTypes} from 'react-undoredo-middleware'

const counterReducer = (state, action) => {
  const {payload} = action
  switch(action.type) {
	//...other code
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
```

**define your custom undo/redo handlers:**

```js
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
  }
}


const redoHandlers = {
 /**
  * 
  * @param {*} state redux state 
  * @param {*} undoAction when undo something, we need to cache it to the redoAction
  */
 add: (state, redoAction) => {
    state.value += 1
	return state
  }
}

export {
  undoHandlers,
  redoHandlers
}
```

**register the middleware**:

```js
import {createStore, applyMiddleware} from 'redux'
import {undoRedo} from 'react-undoredo-middleware'
import logger from 'redux-logger'
import reducer from "./Modules"
import {undoHandlers, redoHandlers} from './customerHandlers'

const undoRedoWithExtraArgument = undoRedo.withExtraArgument({ customUndoHandlers: undoHandlers, customRedoHandlers: redoHandlers })

const store = createStore(reducer, composeEnhancers(applyMiddleware(undoRedoWithExtraArgument, logger)))

export default store
```

### 2.Use in Component

```js
import React from 'react';
import {connect} from 'react-redux'
import {undoRedoActions} from 'react-undoredo-middleware'

const Counter = (props) => {
  const {UNDO_ACTION, REDO_ACTION} = props
  return (
    <div>
      <button onClick={() => UNDO_ACTION()}>undo</button>
      <button onClick={() => REDO_ACTION()}>redo</button>
    </div>
  );
}

export default connect(
  state => ({
    // your state
  }),
  {
   	// other actions
    ...undoRedoActions
  }
)(Counter);
```

See the [package source](https://github.com/1347575247/react-undoredo-middleware) for more details.
