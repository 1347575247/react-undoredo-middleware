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
