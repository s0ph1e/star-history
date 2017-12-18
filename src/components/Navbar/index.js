import React from 'react';
import './style.css';
import {Collapse, Navbar, NavbarBrand, Nav, NavItem, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
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
									{!this.props.username && this.renderLoginButton()}
									{this.props.username && this.renderProfileMenu()}
								</NavItem>
							</Nav>
						</Collapse>
					</Navbar>
				</div>
			</div>
		);
	}

	renderLoginButton() {
		return <Button size="sm" href="/auth/github" className="btn-github">Sign in with Github</Button>;
	}

	renderProfileMenu() {
		return (
			<UncontrolledDropdown>
				<DropdownToggle nav caret>
					Hi {this.props.username}
				</DropdownToggle>
				<DropdownMenu>
					<DropdownItem href="/logout">
						logout
					</DropdownItem>
				</DropdownMenu>
			</UncontrolledDropdown>
		)
	}
}

const mapStateToProps = state => ({
	username: state.user.username
});

export default connect(
	mapStateToProps,
	null
)(AppNavbar)
