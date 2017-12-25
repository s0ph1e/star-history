import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {getUserRepos} from '../../modules/userRepos';

import {Table} from 'reactstrap'

class RepoList extends Component {

	componentDidMount() {
		this.props.getUserRepos();
	}

	render() {
		return (
			<div>
				<Table hover>
					<tbody>
						{this.props.items.map((item) => (
							<tr key={item.id}>
								<td>{item.name}</td>
								<td>{item.starsCount}</td>
								<td>{item.language}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	items: state.userRepos.items
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getUserRepos
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RepoList)