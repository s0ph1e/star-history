import moment from 'moment';

export const GET_STAR_HISTORY = 'stars/GET_STAR_HISTORY';
export const GET_STAR_HISTORY_SUCCESS = 'stars/GET_STAR_HISTORY_SUCCESS';
export const GET_STAR_HISTORY_ERROR = 'stars/GET_STAR_HISTORY_ERROR';
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

		case GET_STAR_HISTORY_ERROR:
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
			.catch((e) => console.log(e));
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
				url: `/repos/${repo}/stargazers`,
				headers: { 'Accept': 'application/vnd.github.v3.star+json' },
				params: { per_page: 100 }
			}
		}
	});
};

function aggregateByMonth(history) {
	const dates = history.map((event) => moment(event.starred_at));
	const firstDate = moment.min(dates).startOf('month');
	const lastDate = moment.max(dates).startOf('month');
	const amountOfMonth = lastDate.diff(firstDate, 'months');

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
