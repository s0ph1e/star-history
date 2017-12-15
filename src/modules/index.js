import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import repoStars from './repoStars'

export default combineReducers({
	routing: routerReducer,
	repoStars
});