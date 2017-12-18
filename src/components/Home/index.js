import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getStarHistory } from '../../modules/repoStars';

import Searchbar from '../Searchbar';
import StarHistoryGraph from '../StarHistoryGraph';
import Loading from '../Loading';

class Home extends Component {
	render() {
		const message = `Star history is loading: ${this.props.starHistoryLoadingProgress}%`;
		return (
			<div>
				<Searchbar onSearch={this.props.getStarHistory} />
				<StarHistoryGraph data={this.props.starHistoryData} />
				{this.props.starHistoryIsLoading && <Loading message={message}/>}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	starHistoryData: state.repoStars.data,
	starHistoryIsLoading: state.repoStars.isLoading,
	starHistoryLoadingProgress: state.repoStars.loadingProgress
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getStarHistory
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home)