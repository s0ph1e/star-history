import moment from 'moment';

export const STAR_HISTORY_REQUESTED = 'repo/STAR_HISTORY_REQUESTED';
export const STAR_HISTORY_RECEIVED = 'repo/STAR_HISTORY_RECEIVED';
export const STAR_HISTORY_ERROR = 'repo/STAR_HISTORY_ERROR';
export const REPO_CHANGED = 'repo/REPO_CHANGED';
export const STAR_HISTORY_LOADING = 'repo/STAR_HISTORY_LOADING';

const initialState = {
	repo: '',
	data: [],
	isLoading: false,
	loadingProgress: 0 // percents
};

export default (state = initialState, action) => {
	switch (action.type) {
		case STAR_HISTORY_REQUESTED:
			return {
				...state,
				isLoading: true,
				loadingProgress: 0
			};
		case STAR_HISTORY_RECEIVED:
			return {
				...state,
				data: action.data,
				isLoading: false
			};
		case STAR_HISTORY_ERROR:
			return {
				...state,
				data: [],
				isLoading: false
			};
		case REPO_CHANGED:
			return {
				...state,
				repo: action.repo
			};
		case STAR_HISTORY_LOADING:
			return {
				...state,
				loadingProgress: action.loadingProgress
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
		let totalStarsCount, loadedStarsCount = 0;

		// TODO: handle as separate action, see interceptor
		function onChunkLoaded(size) {
			loadedStarsCount = loadedStarsCount + size;
			dispatch({
				type: STAR_HISTORY_LOADING,
				loadingProgress: Math.round((loadedStarsCount / totalStarsCount) * 100)
			});
		}

		function onHistoryLoaded(data) {
			dispatch({
				type: STAR_HISTORY_RECEIVED,
				data
			})
		}

		return dispatch(fetchRepoInfo({repository}))
			.then(response => {totalStarsCount = response.payload.data['stargazers_count']})
			.then(() => dispatch(fetchStarHistory({repository, onChunkLoaded})))
			.then(onHistoryLoaded)
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

const fetchRepoInfo = ({repository}) => {
	return dispatch => dispatch({
		type: 'GET_REPO_INFO',
		payload: {
			request: {
				url: `/repos/${repository}`
			}
		}
	});
};

const fetchStarHistory = ({repository}) => {
	return dispatch => dispatch({
		type: 'GET_STAR_HISTORY',
		payload: {
			request: {
				url: `/repos/${repository}/stargazers`,
				headers: { 'Accept': 'application/vnd.github.v3.star+json' },
				params: { per_page: 100 }
			}
		}
	}).then((res) => aggregateByMonth(res.payload.data));
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
