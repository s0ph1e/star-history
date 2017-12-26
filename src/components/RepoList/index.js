import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {getUserRepos} from '../../modules/userRepos';
import 'devicon';
import './style.css';

class RepoList extends Component {

	componentDidMount() {
		this.props.getUserRepos();
	}

	render() {
		return (
			<div className="d-flex justify-content-center">
				<div className="repo-list">
					{this.props.items.map((item) => (
						<div key={item.id} className="d-flex flex-row repo-list__item pt-1 pb-1 pr-sm-3 pl-sm-3">
							<div className="p-1 mr-auto repo_list__item-name">
								{this.renderRepoDescription(item)}
							</div>
							<div className="p-1 align-self-center repo-list__item-stars">{item.starsCount}&#x02605;</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	renderRepoDescription({name, description, url, language}) {
		const languageIcon = this.renderLanguageIcon(language);

		return (
			<div className="d-flex flex-column">
				<div>
					<a className="repo-list__item-name-link" href={url}>{name}</a>
					<span className="repo-list__item-language">{languageIcon}</span>
				</div>
				<p className="text-muted small mb-0">{description}</p>
			</div>
		)
	}

	renderLanguageIcon(language) {
		if (!language) {
			return null;
		}
		const classname = `devicon-${language.toLowerCase()}-plain`;
		return <i className={classname}></i>;
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