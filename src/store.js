import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import githubAxiosMiddleware from './utils/githubAxiosMiddleware';
import querySyncEnhancer from './utils/querySyncEnhancer';
import history from './utils/history';
import rootReducer from './modules'

const initialState = {};
const enhancers = [
	querySyncEnhancer
];
const middleware = [
	thunk,
	githubAxiosMiddleware,
	routerMiddleware(history)
];

const composedEnhancers = compose(
	applyMiddleware(...middleware),
	...enhancers
);

const store = createStore(
	rootReducer,
	initialState,
	composedEnhancers
);

export default store
export { history }