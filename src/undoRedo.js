
import bindActionCreators from "./bindActionCreators"

const __DEV__ = process.env.NODE_ENV === "development"

// 撤销重做中间件
function createUndoRedoMiddleware (extraAgument = {}) {
	return () => dispatch => action => {
		/**
     * @param {Int} index: 添加组件的新索引/粘贴组件的新索引/拖拽排序的旧索引,
     * @param {Array} path: 修改配置面板的redux修改路径，
     * @param {primitive} newValue: 修改配置面板的新值,
     * @param {primitive} oldValue: 修改配置面板的旧值
     */
		const {index, path, newValue, oldValue, $$UNDO_REDO_TYPE} = action.payload || {}

		// redux中的action名称
		const ADD_INTO_HISTORY_ACTION = extraAgument.ADD_INTO_HISTORY_ACTION

		if (!ADD_INTO_HISTORY_ACTION) {
			if (__DEV__) {
				console.error(`
          undoRedoMiddleware must with extraArgument, 
          which must contains action named ADD_INTO_HISTORY_ACTION
        `)
			}
		}

		// 添加到历史记录的action
		const ADD_INTO_HISTORY = (
			ADD_INTO_HISTORY_ACTION
      && $$UNDO_REDO_TYPE
      && bindActionCreators(ADD_INTO_HISTORY_ACTION, dispatch)
		) || (() => {})

		const params = {
			type: $$UNDO_REDO_TYPE,
			index: index || -1, //  添加组件的索引/拖拽排序时的旧索引
			path: path || [], // 修改配置面板时的路径
			newValue: newValue || false, // 修改配置面板时的新值
			oldValue: oldValue || false, // 修改配置面板时的旧值
			cacheItem: null // 被缓存起来的项目，如撤销某个新增项后需缓存这个项目，用于重做时取出来用
		}

		ADD_INTO_HISTORY(params)

		// 业务dispatch
		return dispatch(action)
	}
}

const undoRedo = createUndoRedoMiddleware()

// 绑定一个工厂方法，用户可以通过注入参数到中间件完成自定义
undoRedo.withExtraArgument = createUndoRedoMiddleware

export default undoRedo
