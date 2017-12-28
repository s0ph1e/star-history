import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import {
	Collapse, Navbar, NavbarBrand, NavbarToggler, Nav, NavItem, NavLink,
	Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import './style.css';

class AppNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false
		};
	}
	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}

	render() {
		return (
			<div className="App-header">
				<div className="App-header__container">
					<Navbar color="faded" light expand="sm">
						<NavbarBrand href="/" className="brand">&#x02605; Github Star History</NavbarBrand>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							{this.renderNav()}
							{this.renderProfileMenu()}
						</Collapse>
					</Navbar>
				</div>
			</div>
		);
	}

	renderNav() {
		return (
			<Nav className="mr-auto" navbar>
				{this.props.username && (
					<NavItem>
						<NavLink tag={Link} to="/">Home</NavLink>
					</NavItem>
				)}
				{this.props.username && (
					<NavItem>
						<NavLink tag={Link} to="/repos">Your repos</NavLink>
					</NavItem>
				)}
			</Nav>
		)
	}

	renderProfileMenu() {
		if (!this.props.username) {
			return <Button size="sm" href="/auth/github" className="btn-github mt-2 mb-2 mt-sm-0 mb-sm-0">Sign in with Github</Button>;
		}
		return (
			<UncontrolledDropdown className="mt-2 mb-2 mt-sm-0 mb-sm-0">
				<DropdownToggle caret color="outline-secondary" size="sm">
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
