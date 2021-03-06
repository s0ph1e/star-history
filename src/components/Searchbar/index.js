import React, { Component } from 'react';
import {Input, Button, InputGroup} from 'reactstrap'

const repoPlaceholder = 'octocat/hello-worId';
const ESCAPE_KEY = 27;
const ENTER_KEY = 13;

class Searchbar extends Component {
	constructor(props) {
		super(props);
		this.handleRepoChange = this.handleRepoChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.doSearch = this.doSearch.bind(this);
	}

	handleRepoChange(event) {
		this.props.changeRepo({repo: event.target.value});
	}

	handleKeyDown(event) {
		event.stopPropagation();
		if (event.keyCode === ESCAPE_KEY) {
			this.props.changeRepo({repo: ''});
		}
		if (event.keyCode === ENTER_KEY) {
			this.doSearch();
		}
	}

	doSearch() {
		this.props.onSearch(this.props.repo);
	}

	componentDidMount() {
		if (this.props.repo) {
			this.doSearch();
		}
	}

	render() {
		return (
			<div className="searchbar">
				<InputGroup>
					<Input className="mr-2" placeholder={repoPlaceholder}
						value={this.props.repo}
						onChange={this.handleRepoChange}
						onKeyDown={this.handleKeyDown}
					/>
					<Button color="info" onClick={this.doSearch}>Go!</Button>
				</InputGroup>
			</div>
		)
	}
}

export default Searchbar;
