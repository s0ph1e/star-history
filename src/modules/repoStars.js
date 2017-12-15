import GithubApi from 'github';
import moment from 'moment';

const github = new GithubApi({
	rejectUnauthorized: false
});
const starHeaders = { "Accept": "application/vnd.github.v3.star+json"};

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

		const repo = getState().repoStars.repo;

		return fetchStarHistory(repo)
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

function fetchStarHistory(repository) {
	const parts = repository.split('/');
	const owner = parts[0];
	const repo = parts[1];

	if (!owner || !repo) {
		return Promise.reject(new Error('Wrong repo name'));
	}

	let history = [];

	function handleResults(result) {
		history = history.concat(result.data);

		if (github.hasNextPage(result)) {
			return github.getNextPage(result, starHeaders)
				.then(handleResults)
		}

		return history;
	}

	const accessToken = getCookie('gh_access_token');
	if (accessToken) {
		github.authenticate({
			type: 'oauth',
			token: accessToken
		})
	}

	return github.activity.getStargazersForRepo({
		headers: starHeaders,
		per_page: 100,
		owner,
		repo
	}).then(handleResults);
}

function getCookie(name) {
	const parts = document.cookie.split(name + '=');
	if (parts.length === 2) {
		return parts.pop().split(';').shift();
	}
}

function aggregateByMonth(history) {
	const dates = history.map((event) => moment(event.starred_at));
	const firstDate = moment.min(dates);
	const lastDate = moment.max(dates);
	const amountOfMonth = lastDate.diff(firstDate, 'months') + 2;

	console.log('firstDate', firstDate);
	console.log('lastDate', lastDate);
	console.log('amountOfMonth', amountOfMonth);

	const amountsMap = {};
	for (let i = 0; i < amountOfMonth; i++) {
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
