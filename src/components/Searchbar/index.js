import React, { Component } from 'react';
import {Input, Button, InputGroup} from 'reactstrap'

const repoPlaceholder = 'octocat/hello-worId';
const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class Searchbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			repo: ''
		};

		this.handleRepoChange = this.handleRepoChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.doSearch = this.doSearch.bind(this);
	}

	handleRepoChange(event) {
		this.setState({repo: event.target.value});
	}

	handleKeyDown(event) {
		event.stopPropagation();
		if (event.keyCode === ESCAPE_KEY) {
			this.setState({repo: ''});
		}
		if (event.keyCode === ENTER_KEY) {
			this.doSearch();
		}
	}

	doSearch() {
		this.props.onSearch(this.state.repo);
	}

	render() {
		return (
			<div className="searchbar">
				<InputGroup>
					<Input className="mr-2" placeholder={repoPlaceholder}
							value={this.state.repo}
							onChange={this.handleRepoChange}
							onKeyDown={this.handleKeyDown}
					/>
					<Button color="primary" onClick={this.doSearch}>Go!</Button>
				</InputGroup>
			</div>
		)
	}
}

export default Searchbar;