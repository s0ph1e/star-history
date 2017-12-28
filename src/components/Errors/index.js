import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Alert } from 'reactstrap';
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
					<Alert color="danger" key={i} toggle={() => this.removeError(i)}>
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
