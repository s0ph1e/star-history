import { createBrowserRouter } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import RepoList from './components/RepoList';

export default createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'repos', element: <RepoList /> },
			{ path: '*', element: null },
		],
	},
]);
