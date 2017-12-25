import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import rootReducer from './modules'

const githubClient = axios.create({
	baseURL: 'https://api.github.com',
	responseType: 'json'
});

const githubClientOptions = {
	returnRejectedPromiseOnError: true,
	interceptors: {
		request: [
			({getState, dispatch, getSourceAction}, req) => {
				const accessToken = getState().user.accessToken;
				if (accessToken) {
					req.headers['Authorization'] = `token ${accessToken}`;
				}
				return req;
			}
		],
		response: [
			({getState, dispatch, getSourceAction}, req) => {
				const action = req.config.reduxSourceAction;
				let aggregatedData;
				return handleResponse(req);

				function handleResponse(res) {
					const data = res.data;
					if (Array.isArray(data)) {
						aggregatedData = (aggregatedData || []).concat(data);

						dispatch({
							type: `${action.type}_CHUNK`,
							length: data.length
						});

						const hasLinks = res.headers && res.headers.link;
						if (hasLinks) {
							const nextRegex = /<([^>]*)>;\s*rel="next"/;
							const matches = res.headers.link.match(nextRegex);
							const nextPage = matches && matches[1];
							if (nextPage) {
								return axios.get(nextPage, {headers: res.config.headers}).then(handleResponse);
							}
						}
						res.data = aggregatedData;
					}
					console.log('RESULT', res);
					return res;
				}
			}
		]
	}
};

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
	thunk,
	axiosMiddleware(githubClient, githubClientOptions),
	routerMiddleware(history)
];

if (process.env.NODE_ENV === 'development') {
	const devToolsExtension = window.devToolsExtension;

	if (typeof devToolsExtension === 'function') {
		enhancers.push(devToolsExtension())
	}
}

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