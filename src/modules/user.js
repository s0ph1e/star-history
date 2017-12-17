const cookieName = 'gh_data';
const defaultGithubData = {username: null, accessToken: null};
const githubData = getCookie(cookieName) || defaultGithubData;

const initialState = {
	username: githubData.username,
	accessToken: githubData.accessToken
};

export default (state = initialState, action) => {
	switch (action.type) {
		default:
			return state
	}
}

function getCookie(name) {
	const parts = document.cookie.split(name + '=');
	if (parts.length === 2) {
		const value = parts.pop().split(';').shift();
		try {
			return JSON.parse(decodeURIComponent(value));
		} catch(e) {
			return null;
		}
	}
	return null;
}
