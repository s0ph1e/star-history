import ReduxQuerySync from "redux-query-sync";
import { CHANGE_REPO } from "../modules/repoStars";

export default ReduxQuerySync.enhancer({
	params: {
		repo: {
			selector: state => state.repoStars.repo,
			action: value => ({type: CHANGE_REPO, repo: value}),
		},
	},
	initialTruth: 'location',
	replaceState: true,
});
