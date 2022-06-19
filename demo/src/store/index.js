import {createStore, compose, applyMiddleware} from 'redux'
import {undoRedo} from 'react-undoredo-middleware'
import reducer from "./Modules"
import {undoHandlers, redoHandlers} from './customerHandlers'

// 浏览器的redux调试插件挂载
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const undoRedoWithExtraArgument = undoRedo.withExtraArgument({ customUndoHandlers: undoHandlers, customRedoHandlers: redoHandlers })

const store = createStore(reducer, composeEnhancers(applyMiddleware(undoRedoWithExtraArgument)))

export default store