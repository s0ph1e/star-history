import { combineReducers } from 'redux'
import repoStars from './repoStars'
import user from './user'
import userRepos from './userRepos'
import errors from './errors'

export default combineReducers({
	repoStars,
	user,
	userRepos,
	errors
});
