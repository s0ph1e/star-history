import React from 'react';
import './style.css'

class Loading extends React.Component {
	render() {
		return (
			<div className="overlay">
				<div className="overlay__spinner"></div>
				<p className="overlay__message">
					{this.props.message}
				</p>
			</div>
		);
	}
}

export default Loading;