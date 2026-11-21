import { githubRequest } from '../utils/githubRequest';

export const GET_STAR_HISTORY = 'stars/GET_STAR_HISTORY';
export const GET_STAR_HISTORY_SUCCESS = 'stars/GET_STAR_HISTORY_SUCCESS';
export const GET_STAR_HISTORY_FAIL = 'stars/GET_STAR_HISTORY_FAIL';
export const GET_STAR_HISTORY_CHUNK = 'stars/GET_STAR_HISTORY_CHUNK';

export const CHANGE_REPO = 'stars/CHANGE_REPO';
export const GET_REPO_INFO = 'stars/GET_REPO_INFO';
export const GET_REPO_INFO_SUCCESS = 'stars/GET_REPO_INFO_SUCCESS';

export const CLEAR_DATA = 'stars/CLEAR_DATA';

const initialState = {
	repo: '',
	data: [],
	totalStarsCount: 0,
	loadedStarsCount: 0,
	isLoading: false
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_STAR_HISTORY:
			return {
				...state,
				isLoading: true,
				loadedStarsCount: 0
			};

		case GET_STAR_HISTORY_CHUNK:
			return {
				...state,
				loadedStarsCount: state.loadedStarsCount + action.length
			};

		case GET_STAR_HISTORY_SUCCESS:
			return {
				...state,
				data: aggregateByMonth(action.payload.data),
				isLoading: false
			};

		case GET_STAR_HISTORY_FAIL:
			return {
				...state,
				data: [],
				loadedStarsCount: 0,
				isLoading: false
			};

		case CHANGE_REPO:
			return {
				...state,
				repo: action.repo
			};

		case GET_REPO_INFO_SUCCESS:
			return {
				...state,
				totalStarsCount: action.payload.data['stargazers_count']
			};

		case CLEAR_DATA:
			return {
				...initialState
			};

		default:
			return state
	}
}

export const getStarHistory = () => {
	return (dispatch, getState) => {
		const repo = getState().repoStars.repo;

		return dispatch(fetchRepoInfo({repo}))
			.then(() => dispatch(fetchStarHistory({repo})))
			// failures are already shown through the errors module
			.catch(() => {});
	}
};

export const changeRepo = ({repo}) => {
	return dispatch => {
		dispatch({
			type: CHANGE_REPO,
			repo
		});
	}
};

export const clear = () => {
	return dispatch => {
		dispatch({
			type: CLEAR_DATA
		});
	}
};

const fetchRepoInfo = ({repo}) => githubRequest({
	type: GET_REPO_INFO,
	errorPrefix: 'Can not get repo',
	request: {
		url: `/repos/${repo}`
	}
});

const fetchStarHistory = ({repo}) => githubRequest({
	type: GET_STAR_HISTORY,
	errorPrefix: 'Can not get star history',
	request: {
		// GitHub restricted /stargazers to repo admins/collaborators (July 2026).
		// The privacy-safe replacement returns weekly star counts, newest first.
		url: `/repos/${repo}/stargazers/history`,
		headers: {
			'Accept': 'application/vnd.github+json',
			'X-GitHub-Api-Version': '2026-03-10'
		},
		params: { per_page: 30 }
	}
});

const DAY_SECONDS = 60 * 60 * 24;

// history: [{week: <unix seconds>, total: <stars that week>, days: [Sun..Sat counts]}]
// Months are computed in UTC, matching GitHub's week boundaries.
function aggregateByMonth(history) {
	const amountsMap = {};
	history.forEach(({week, total, days}) => {
		const dailyCounts = Array.isArray(days) && days.length ? days : [total];
		dailyCounts.forEach((count, i) => {
			const month = toMonth(new Date((week + i * DAY_SECONDS) * 1000));
			amountsMap[month] = (amountsMap[month] || 0) + count;
		});
	});

	// Skip the leading empty period before the first star
	const months = Object.keys(amountsMap).sort();
	const firstIndex = months.findIndex((month) => amountsMap[month] > 0);
	if (firstIndex === -1) {
		return [];
	}

	const firstMonth = months[firstIndex];
	const amountOfMonth = monthsBetween(firstMonth, months[months.length - 1]);

	let tmpAmount = 0;
	const result = [];
	for (let i = -1; i <= amountOfMonth; i++) {
		const month = addMonths(firstMonth, i);
		const increment = amountsMap[month] || 0;
		tmpAmount += increment;
		result.push({month, increment, amount: tmpAmount});
	}
	return result;
}

// 'YYYY-MM'
function toMonth(date) {
	return date.toISOString().slice(0, 7);
}

function parseMonth(month) {
	const [year, monthNumber] = month.split('-').map(Number);
	return {year, monthIndex: monthNumber - 1};
}

function addMonths(month, amount) {
	const {year, monthIndex} = parseMonth(month);
	return toMonth(new Date(Date.UTC(year, monthIndex + amount, 1)));
}

function monthsBetween(from, to) {
	const a = parseMonth(from);
	const b = parseMonth(to);
	return (b.year - a.year) * 12 + (b.monthIndex - a.monthIndex);
}
