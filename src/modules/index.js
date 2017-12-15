import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import repoStars from './repoStars'
import user from './user'

export default combineReducers({
	routing: routerReducer,
	repoStars,
	user
});