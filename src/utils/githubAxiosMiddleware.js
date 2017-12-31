import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';
import { addError } from '../modules/errors';
import { GET_REPO_INFO, GET_STAR_HISTORY } from '../modules/repoStars';

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
		response: [{
			success: ({getState, dispatch, getSourceAction}, req) => {
				const action = req.config.reduxSourceAction;
				let aggregatedData;
				return handleResponse(req)
					.catch((error) => handleError({getState, dispatch, getSourceAction}, error, action));

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
					return Promise.resolve(res);
				}
			},
			error: ({getState, dispatch, getSourceAction}, error) =>
				handleError({getState, dispatch, getSourceAction}, error, error.config.reduxSourceAction)
		}]
	}
};

function handleError({getState, dispatch, getSourceAction}, error, action) {
	const actionType = (action && action.type) || null;
	const actionUrl = (action && action.payload.request.url) || null;

	let message = '';

	const errorPrefix = {
		[GET_REPO_INFO]: 'Can not get repo',
		[GET_STAR_HISTORY]: 'Can not get star history'
	}[actionType] || 'Error in request';

	message += `${errorPrefix} ${actionUrl ? `'${actionUrl}'` : ''}. `;

	const isAuthorized = getState().user.accessToken;
	const limitExceed = error.response.headers['x-ratelimit-remaining'] === '0';

	if (error.response.status === 403) {
		if (!isAuthorized && limitExceed) {
			message += 'Limit of requests exceed. Sign in with github and try again';
		} else if (limitExceed) {
			message += 'Limit of requests exceed';
		}
	} else {
		message += `${error.response.status} ${error.response.statusText}`;
	}

	const appError = {message};
	dispatch(addError({error: appError}));

	return Promise.reject(error);
}

export default axiosMiddleware(githubClient, githubClientOptions);
