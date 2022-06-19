import { createSlice } from '@reduxjs/toolkit'
import {undoRedoHandlers} from 'react-undoredo-middleware'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state, payload) => {
      console.log(payload)
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
    ...undoRedoHandlers
  }
})

export const {increment, decrement} = counterSlice.actions

export default counterSlice.reducer