import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getStarHistory } from '../../modules/repoStars';

import Searchbar from '../Searchbar';
import StarHistoryGraph from '../StarHistoryGraph';
import Loading from '../Loading';

class Home extends Component {
	render() {
		return (
			<div>
				<Searchbar onSearch={this.props.getStarHistory} />
				<StarHistoryGraph data={this.props.starHistoryData} />
				{this.props.starHistoryLoading && <Loading message="Star history is loading" />}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	starHistoryData: state.repoStars.data,
	starHistoryLoading: state.repoStars.isLoading
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getStarHistory
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home)