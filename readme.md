## Introduction

<div align=center><img width="350" src="https://user-images.githubusercontent.com/45328460/174484654-a68dfad7-f895-4882-b9aa-cbb4a4972693.gif"/></div>

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

#### 2.1 Base usage

```js
import React from 'react';
import {connect} from 'react-redux'
import CounterActions from '../store/Modules/counter/actions'
import {undoRedoActions} from 'react-undoredo-middleware'

const Counter = (props) => {
  const {counter, Increment, Decrement, UNDO_ACTION, REDO_ACTION} = props
  return (
    <div>
      {counter}
      <button onClick={() => Increment({$$UNDO_REDO_TYPE: 'add'})}>+</button>
      <button onClick={() => Decrement({$$UNDO_REDO_TYPE: 'minus'})}>-</button><br/>
      <button onClick={() => UNDO_ACTION()}>undo</button>
      <button onClick={() => REDO_ACTION()}>redo</button>
    </div>
  );
}

export default connect(
  state => ({
    counter: state.Counter.value
  }),
  {
    ...CounterActions,
    ...undoRedoActions
  }
)(Counter);

```

#### 2.2 more options

In order to handle with other complicated service. except $$UNDO_REDO_TYPE, we can add more options to the payload. 

```json
{
	$$UNDO_REDO_TYPE,
	index, 
	path, 
	newValue, 
	oldValue
}
```

such as:

```html
<button onClick={() => Decrement({$$UNDO_REDO_TYPE: 'minus', index: 0, path: [], newValue: 0, oldValue: -1})}>-</button><br/>
```

those options will cache into undoStack:

<div align=center><img width="350" src="[https://user-images.githubusercontent.com/45328460/174484654-a68dfad7-f895-4882-b9aa-cbb4a4972693.gif](https://user-images.githubusercontent.com/45328460/174487756-444b14ef-5e53-4983-a006-7298383cbc1f.png)"/></div>

get those args in custom undo/redo handler:

```js
const redoHandlers = {
 /**
  * 
  * @param {*} state redux state 
  * @param {*} undoAction when undo something, we need to cache it to the redoAction
  */
 add: (state, redoAction) => {
 	const {index, path, newValue, oldValue, cacheItem} = redoAction
	// handle complicated situation
	return state
  }
}
```

See the [package source](https://github.com/1347575247/react-undoredo-middleware) for more details.
