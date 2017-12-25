import React, { Component } from 'react';
import './style.css';
import Navbar from '../Navbar';
import { Route } from 'react-router-dom'
import Home from '../Home';
import RepoList from '../RepoList';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Navbar/>
				<div className="App-container">
					<div className="container">
						<Route exact path="/" component={Home} />
						<Route exact path="/repos" component={RepoList} />
					</div>
				</div>
			</div>
		);
	}
}

export default App;
