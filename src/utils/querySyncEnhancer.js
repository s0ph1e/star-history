import ReduxQuerySync from 'redux-query-sync';
import { CHANGE_REPO } from '../modules/repoStars';
import history from './history';

export default ReduxQuerySync.enhancer({
	params: {
		repo: {
			selector: state => state.repoStars.repo,
			action: value => ({type: CHANGE_REPO, repo: value}),
			defaultValue: ''
		},
	},
	initialTruth: 'location',
	replaceState: true,
	history
});
