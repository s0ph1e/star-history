import React, {Component} from 'react';
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'

class RepoList extends Component {

	render() {
		return (
			<div>
				<h1>Repo List</h1>
			</div>
		);
	}
}

export default connect(
	null,
	null
)(RepoList)