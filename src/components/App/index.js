import React, { Component } from 'react';
import './style.css';
import GithubApi from 'github';
import Searchbar from '../Searchbar';
import StarHistoryGraph from '../StarHistoryGraph';
import Navbar from '../Navbar';
import moment from 'moment';

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			starHistoryData: null,
			starHistoryLoading: false
		};
		this.showRepoStarHistory = this.showRepoStarHistory.bind(this);
	}

	showRepoStarHistory(repo) {
		this.setState({starHistoryLoading: true});
		getStarHistory(repo)
			.then(aggregateByMonth)
			.then((starHistoryData) => {
				this.setState({starHistoryData, starHistoryLoading: false});
			})
			.catch((e) => {
				this.setState({starHistoryLoading: false});
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
						<Searchbar onSearch={this.showRepoStarHistory} />
						<StarHistoryGraph data={this.state.starHistoryData} />
					</div>
				</div>
				{this.state.starHistoryLoading && (<div className="overlay">
					<div>Star history is loading</div>
				</div>)}
			</div>
		);
	}
}

export default App;

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

	const accessToken = getCookie('gh_access_token');
	if (accessToken) {
		github.authenticate({
			type: 'oauth',
			token: accessToken
		})
	}

	return github.activity.getStargazersForRepo({
		headers: starHeaders,
		per_page: 100,
		owner,
		repo
	}).then(handleResults);
}

function getCookie(name) {
	const parts = document.cookie.split(name + '=');
	if (parts.length === 2) {
		return parts.pop().split(';').shift();
	}
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
