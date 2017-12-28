import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getStarHistory, clear } from '../../modules/repoStars';

import Searchbar from '../Searchbar';
import StarHistoryGraph from '../StarHistoryGraph';
import Loading from '../Loading';

class Home extends Component {

	render() {
		const progress = Math.round((this.props.starHistoryStarsLoaded / this.props.starHistoryStarsTotal) * 100);
		const message = `Star history is loading: ${progress}%`;
		return (
			<div>
				<Searchbar onSearch={this.props.getStarHistory} onClear={this.props.clearStarHistory} />
				<StarHistoryGraph data={this.props.starHistoryData} />
				{this.props.starHistoryIsLoading && <Loading message={message}/>}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	starHistoryData: state.repoStars.data,
	starHistoryIsLoading: state.repoStars.isLoading,
	starHistoryStarsTotal: state.repoStars.totalStarsCount,
	starHistoryStarsLoaded: state.repoStars.loadedStarsCount
});

const mapDispatchToProps = dispatch => bindActionCreators({
	getStarHistory,
	clearStarHistory: clear
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home)