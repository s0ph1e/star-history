import axios from 'axios';
import { addError } from '../modules/errors';

const githubClient = axios.create({
	baseURL: 'https://api.github.com',
	responseType: 'json'
});

const nextPageRegex = /<([^>]*)>;\s*rel="next"/;

/**
 * Thunk for a GitHub API request. Dispatches `type` on start, `${type}_SUCCESS` with
 * `payload.data` on success and `${type}_FAIL` on failure. Array responses are paginated
 * through the Link header, dispatching `${type}_CHUNK` per page, and concatenated.
 * Failures are also reported to the errors module; the returned promise rejects.
 */
export function githubRequest({ type, request, errorPrefix = 'Error in request' }) {
	return async (dispatch, getState) => {
		const accessToken = getState().user.accessToken;
		const headers = { ...request.headers };
		if (accessToken) {
			headers['Authorization'] = `token ${accessToken}`;
		}

		dispatch({ type });

		try {
			let response = await githubClient.request({ ...request, headers });
			let data = response.data;

			if (Array.isArray(data)) {
				dispatch({ type: `${type}_CHUNK`, length: countItems(data) });

				let nextPage = getNextPage(response);
				while (nextPage) {
					// the next-page URL already carries the query params
					response = await githubClient.get(nextPage, { headers });
					data = data.concat(response.data);
					dispatch({ type: `${type}_CHUNK`, length: countItems(response.data) });
					nextPage = getNextPage(response);
				}
			}

			dispatch({ type: `${type}_SUCCESS`, payload: { data } });
			return data;
		} catch (error) {
			dispatch({ type: `${type}_FAIL`, error });
			const message = getErrorMessage(error, { errorPrefix, url: request.url, isAuthorized: !!accessToken });
			dispatch(addError({ error: { message } }));
			throw error;
		}
	};
}

// star history pages hold weekly totals, not individual stars
function countItems(items) {
	return items.reduce((sum, item) => sum + (typeof item.total === 'number' ? item.total : 1), 0);
}

function getNextPage(response) {
	const link = response.headers && response.headers.link;
	const matches = link && link.match(nextPageRegex);
	return matches ? matches[1] : null;
}

function getErrorMessage(error, { errorPrefix, url, isAuthorized }) {
	let message = `${errorPrefix} '${url}'. `;

	const { response } = error;
	if (!response) {
		return message + error.message;
	}

	const limitExceed = response.headers['x-ratelimit-remaining'] === '0';
	if (response.status === 403) {
		if (!isAuthorized && limitExceed) {
			message += 'Limit of requests exceed. Sign in with github and try again';
		} else if (limitExceed) {
			message += 'Limit of requests exceed';
		}
	} else {
		message += `${response.status} ${response.statusText}`;
	}
	return message;
}
