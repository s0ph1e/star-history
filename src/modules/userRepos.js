import { githubRequest } from '../utils/githubRequest';

export const GET_USER_REPOS = 'userRepos/GET_USER_REPOS';
export const GET_USER_REPOS_SUCCESS = 'userRepos/GET_USER_REPOS_SUCCESS';

const initialState = {
	items: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case GET_USER_REPOS_SUCCESS:
			return {
				...state,
				items: getRepoItems(action.payload.data)
			};

		default:
			return state
	}
}

export const getUserRepos = () => {
	return dispatch => dispatch(githubRequest({
		type: GET_USER_REPOS,
		request: {
			url: '/user/repos'
		}
	// failures are already shown through the errors module
	})).catch(() => {});
};

function getRepoItems (data) {
	return data.map(repo => ({
		id: repo.id,
		name: repo.full_name,
		starsCount: repo.stargazers_count,
		language: repo.language,
		description: repo.description,
		url: repo.html_url
	})).sort((a,b) => (b.starsCount - a.starsCount));
}