import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import GithubApi from 'github';
import {Input, Button, InputGroup} from 'reactstrap'
import Navbar from './Navbar';
import moment from 'moment';

import {ResponsiveContainer, XAxis, YAxis, Tooltip, LineChart, Line, Legend} from 'recharts';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			repo: ''
		};

		this.handleRepoChange = this.handleRepoChange.bind(this);
		this.showRepoStarHistory = this.showRepoStarHistory.bind(this);
	}

	handleRepoChange(event) {
		console.log(event);
		this.setState({repo: event.target.value});
	}

	showRepoStarHistory() {
		getStarHistory(this.state.repo)
			.then(aggregateByMonth)
			.then(drawGraph)
			.catch((e) => {
				console.log(e);
				alert('Something went wrong!')
			});
	}
	
	render() {
		return (
			<div className="App">
				<Navbar/>
				<div className="App-container">
					<div className="container">
						<div className="searchbar mt-3">
						<InputGroup>
							<Input className="mr-2" value={this.state.repo} onChange={this.handleRepoChange} />
							<Button color="primary" onClick={this.showRepoStarHistory}>Go!</Button>
						</InputGroup>
						</div>
						<div id="historyGraph"></div>
					</div>
				</div>
			</div>
		);
	}
}

export default App;

function drawGraph(data) {
	ReactDOM.render(
		<ResponsiveContainer height={500} width="100%">
			<LineChart data={data} margin={{top: 50}}>
				<XAxis dataKey="month" padding={{left: 30, right: 30}} />
				<YAxis />
				<Tooltip />
				<Legend verticalAlign="bottom" height={36}/>
				<Line type='monotone' name="amount of stars" dataKey='amount' stroke='#8884d8'
					  strokeWidth={2}
					  dot={false}
					  legendType='star'
				/>
			</LineChart>
		</ResponsiveContainer>,
		document.getElementById('historyGraph')
	);
}

const github = new GithubApi({
	rejectUnauthorized: false
});

const starHeaders = { "Accept": "application/vnd.github.v3.star+json"};

function getStarHistory(repository) {
	const parts = repository.split('/');
	const owner = parts[0];
	const repo = parts[1];

	if (!owner || !repo) {
		return Promise.reject(new Error('Wrong repo name'));
	}

	let history = [];

	function handleResults(result) {
		history = history.concat(result.data);

		if (github.hasNextPage(result)) {
			return github.getNextPage(result, starHeaders)
				.then(handleResults)
		}

		return history;
	}

	return github.activity.getStargazersForRepo({
		headers: starHeaders,
		per_page: 100,
		owner,
		repo
	}).then(handleResults);
}

function aggregateByMonth(history) {
	const dates = history.map((event) => moment(event.starred_at));
	const firstDate = moment.min(dates);
	const lastDate = moment.max(dates);
	const amountOfMonth = lastDate.diff(firstDate, 'months') + 2;

	console.log('firstDate', firstDate);
	console.log('lastDate', lastDate);
	console.log('amountOfMonth', amountOfMonth);

	const amountsMap = {};
	for (let i = 0; i < amountOfMonth; i++) {
		const currentMonth = firstDate.clone().add(i, 'months').format('YYYY-MM');
		amountsMap[currentMonth] = 0;
	}

	dates.forEach((date) => {
		const dateMonth = date.format('YYYY-MM');
		amountsMap[dateMonth]++;
	});

	let tmpAmount = 0;
	return Object.keys(amountsMap).map((month) => {
		tmpAmount += amountsMap[month];
		return {month, increment: amountsMap[month], amount: tmpAmount}
	});
}
