// let undoRedoMiddleware = require("./undoRedo")
import undoRedoMiddleware from "./undoRedo.test"
import {undoRedoTypes,undoRedoActions,undoRedoHandlers} from '../actions'

describe("undoredo middleware", () => {
	const doDispatch = () => {}
	const doGetState = () => 42

	const nextHandler = undoRedoMiddleware({
		getState: doGetState,
		dispatch: doDispatch
	})

	it("must be a function", () => {
		expect(undoRedoMiddleware).toBeInstanceOf(Function)
	})

	it("must return a function to handle next", () => {
		expect(nextHandler).toBeInstanceOf(Function)
		expect(nextHandler.length).toBe(1)
	})

	describe("handle next", () => {
		it("must return a function to handle action", () => {
			const actionHandler = nextHandler()

			expect(actionHandler).toBeInstanceOf(Function)
			expect(actionHandler.length).toBe(1)
		})

		describe("handle action supporting undo and redo", () => {
			it("must dispatch to add into redux history when $$UNDO_REDO_TYPE is set", done => {
				const actionHandler = nextHandler(doDispatch)

				actionHandler({payload: {$$UNDO_REDO_TYPE: 'paste'}})

				done()
			})
		})
	})

})
