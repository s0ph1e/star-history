import moment from 'moment';

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
			.then(() => dispatch(fetchStarHistory({repo})));
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

const fetchRepoInfo = ({repo}) => {
	return dispatch => dispatch({
		type: GET_REPO_INFO,
		payload: {
			request: {
				url: `/repos/${repo}`
			}
		}
	});
};

const fetchStarHistory = ({repo}) => {
	return dispatch => dispatch({
		type: GET_STAR_HISTORY,
		payload: {
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
		}
	});
};

// history: [{week: <unix seconds>, total: <stars that week>, days: [Sun..Sat counts]}]
function aggregateByMonth(history) {
	const amountsMap = {};
	history.forEach(({week, total, days}) => {
		const weekStart = moment.unix(week);
		const dailyCounts = Array.isArray(days) && days.length ? days : [total];
		dailyCounts.forEach((count, i) => {
			const month = weekStart.clone().add(i, 'days').format('YYYY-MM');
			amountsMap[month] = (amountsMap[month] || 0) + count;
		});
	});

	// Skip the leading empty period before the first star
	const months = Object.keys(amountsMap).sort();
	const firstIndex = months.findIndex((month) => amountsMap[month] > 0);
	if (firstIndex === -1) {
		return [];
	}

	const firstDate = moment(months[firstIndex], 'YYYY-MM');
	const lastDate = moment(months[months.length - 1], 'YYYY-MM');
	const amountOfMonth = lastDate.diff(firstDate, 'months');

	let tmpAmount = 0;
	const result = [];
	for (let i = -1; i <= amountOfMonth; i++) {
		const month = firstDate.clone().add(i, 'months').format('YYYY-MM');
		const increment = amountsMap[month] || 0;
		tmpAmount += increment;
		result.push({month, increment, amount: tmpAmount});
	}
	return result;
}
