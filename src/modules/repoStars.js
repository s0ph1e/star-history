import moment from 'moment';
import axios from 'axios';

export const STAR_HISTORY_REQUESTED = 'repo/STAR_HISTORY_REQUESTED';
export const STAR_HISTORY_RECEIVED = 'repo/STAR_HISTORY_RECEIVED';
export const STAR_HISTORY_ERROR = 'repo/STAR_HISTORY_ERROR';
export const REPO_CHANGED = 'repo/REPO_CHANGED';

const initialState = {
	repo: '',
	data: [],
	isLoading: false
};

export default (state = initialState, action) => {
	switch (action.type) {
		case STAR_HISTORY_REQUESTED:
			return {
				...state,
				isLoading: true
			};
		case STAR_HISTORY_RECEIVED:
			return {
				...state,
				data: action.data,
				isLoading: false
			};
		case STAR_HISTORY_ERROR: {
			return {
				...state,
				data: [],
				isLoading: false
			}
		}
		case REPO_CHANGED:
			return {
				...state,
				repo: action.repo
			};

		default:
			return state
	}
}

export const getStarHistory = () => {
	return (dispatch, getState) => {
		dispatch({
			type: STAR_HISTORY_REQUESTED
		});

		const repository = getState().repoStars.repo;
		const accessToken = getState().user.accessToken;

		return fetchStarHistory({repository, accessToken})
			.then(aggregateByMonth)
			.then((starHistoryData) =>
				dispatch({
					type: STAR_HISTORY_RECEIVED,
					data: starHistoryData
				})
			)
			.catch((e) => {
				dispatch({
					type: STAR_HISTORY_ERROR
				});
				console.log(e);
				alert('Something went wrong!') // TODO: remove this
			});
	}
};

export const changeRepo = ({repo}) => {
	return dispatch => {
		dispatch({
			type: REPO_CHANGED,
			repo
		});
	}
};

function fetchStarHistory({repository, accessToken = null}) {
	const parts = repository.split('/');
	const owner = parts[0];
	const repo = parts[1];

	if (!owner || !repo) {
		return Promise.reject(new Error('Wrong repo name'));
	}

	const starHeaders = { "Accept": "application/vnd.github.v3.star+json"};
	let history = [];

	function handleResults(result) {
		history = history.concat(result.data);

		const hasLinks = result.headers && result.headers.link;
		if (hasLinks) {
			const nextRegex = /<([^>]*)>;\s*rel="next"/;
			const matches = result.headers.link.match(nextRegex);
			const nextPage = matches && matches[1];
			if (nextPage) {
				return axios({
					url: nextPage,
					headers: starHeaders
				}).then(handleResults);
			}
		}

		return history;
	}

	let url = `https://api.github.com/repos/${owner}/${repo}/stargazers?per_page=100`;
	if (accessToken) {
		url = url + '&access_token=' + accessToken
	}

	return axios({
		url,
		headers: starHeaders
	}).then(handleResults);
}

function aggregateByMonth(history) {
	const dates = history.map((event) => moment(event.starred_at));
	const firstDate = moment.min(dates).startOf('month');
	const lastDate = moment.max(dates).startOf('month');
	const amountOfMonth = lastDate.diff(firstDate, 'months');

	console.log('firstDate', firstDate.format('YYYY-MM-DD'));
	console.log('lastDate', lastDate.format('YYYY-MM-DD'));
	console.log('amountOfMonth', amountOfMonth);

	const amountsMap = {};
	for (let i = 0; i <= amountOfMonth; i++) {
		const currentMonth = firstDate.clone().add(i, 'months').format('YYYY-MM');
		amountsMap[currentMonth] = 0;
	}

	dates.forEach((date) => {
		const dateMonth = date.format('YYYY-MM');
		amountsMap[dateMonth]++;
	});

	let tmpAmount = 0;
	return Object.keys(amountsMap).map((month) => {
		tmpAmount += amountsMap[month];
		return {month, increment: amountsMap[month], amount: tmpAmount}
	});
}
