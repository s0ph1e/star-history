import React from 'react';
import './style.css';
import {Collapse, Navbar, NavbarBrand, Nav, NavItem, Button} from 'reactstrap';
import { connect } from 'react-redux'

class AppNavbar extends React.Component {
	render() {
		return (
			<div className="App-header">
				<div className="App-header__container">
					<Navbar color="faded" light expand={true} className="flex-column flex-sm-row">
						<NavbarBrand href="/" className="m-0 brand">Github Star History</NavbarBrand>
						<Collapse navbar>
							<Nav className="ml-auto" navbar>
								<NavItem>
									{!this.props.username && <Button size="sm" href="/auth/github" className="btn-github">
										Sign in with Github
									</Button>}
									{this.props.username && <span>Hi {this.props.username}</span>}
								</NavItem>
							</Nav>
						</Collapse>
					</Navbar>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	username: state.user.username
});

export default connect(
	mapStateToProps,
	null
)(AppNavbar)
