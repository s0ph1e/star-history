import { CHANGE_REPO } from '../modules/repoStars';

const PARAM = 'repo';

const getUrlRepo = (location) => new URLSearchParams(location.search).get(PARAM) || '';

/**
 * Two-way sync between `state.repoStars.repo` and the `?repo=` query param.
 * The URL is the initial source of truth; later store changes replace the URL
 * (no new history entry), and navigations update the store.
 */
export default function syncRepoWithQuery(store, router) {
	let lastSynced = getUrlRepo(router.state.location);
	store.dispatch({ type: CHANGE_REPO, repo: lastSynced });

	router.subscribe(({ location }) => {
		const urlRepo = getUrlRepo(location);
		if (urlRepo !== lastSynced) {
			lastSynced = urlRepo;
			store.dispatch({ type: CHANGE_REPO, repo: urlRepo });
		}
	});

	store.subscribe(() => {
		const repo = store.getState().repoStars.repo;
		if (repo === lastSynced) {
			return;
		}
		lastSynced = repo;

		const { pathname, search, hash } = router.state.location;
		const params = new URLSearchParams(search);
		if (repo) {
			params.set(PARAM, repo);
		} else {
			params.delete(PARAM);
		}
		const query = params.toString();
		router.navigate({ pathname, search: query ? `?${query}` : '', hash }, { replace: true });
	});
}
