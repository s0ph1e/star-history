import axios from 'axios';
import axiosMiddleware from 'redux-axios-middleware';

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
					return res;
				}
			}
		]
	}
};

export default axiosMiddleware(githubClient, githubClientOptions);