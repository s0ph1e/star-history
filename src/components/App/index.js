import React, { Component } from 'react';
import './style.css';
import Navbar from '../Navbar';
import { Route } from 'react-router-dom'
import Home from '../Home';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Navbar/>
				<div className="App-container container">
					<Route exact path="/" component={Home} />
				</div>
			</div>
		);
	}
}

export default App;
