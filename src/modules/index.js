import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import repoStars from './repoStars'
import user from './user'
import userRepos from './userRepos'
import errors from './errors'

export default combineReducers({
	routing: routerReducer,
	repoStars,
	user,
	userRepos,
	errors
});
