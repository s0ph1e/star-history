import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router/dom';
import store from './store';
import router from './router';
import syncRepoWithQuery from './utils/syncRepoWithQuery';

import 'bootstrap/dist/css/bootstrap.css';

syncRepoWithQuery(store, router);

createRoot(document.getElementById('root')).render(
	<Provider store={store}>
		<RouterProvider router={router} />
	</Provider>
);
