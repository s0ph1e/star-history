import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Alert } from 'react-bootstrap';
import { removeError } from '../../modules/errors';

class Errors extends React.Component {

	removeError(index) {
		this.props.removeError({index})
	}

	render() {
		if (!this.props.errors || !this.props.errors.length) {
			return null;
		}
		return (
			<div className="errors">
				{this.props.errors.map((e, i) =>
					<Alert variant="danger" key={i} dismissible onClose={() => this.removeError(i)}>
						{e.message}
					</Alert>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	errors: state.errors.items
});

const mapDispatchToProps = dispatch => bindActionCreators({
	removeError
}, dispatch);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Errors)
