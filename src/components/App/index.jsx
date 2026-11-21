import { Component } from 'react';
import './style.css';
import Navbar from '../Navbar';
import { Outlet } from 'react-router'
import Errors from '../Errors';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Navbar/>
				<div className="App-container">
					<div className="container">
						<Errors />
						<Outlet />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
