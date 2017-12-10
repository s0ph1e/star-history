import React from 'react';
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	NavLink, Button} from 'reactstrap';

export default class AppNavbar extends React.Component {
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
			<div>
				<Navbar color="faded" light expand="md">
					<NavbarBrand href="/">&#x02605; Github Star History</NavbarBrand>
					<NavbarToggler onClick={this.toggle} />
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<Button size="sm" href="/auth/github" className="btn-github">
									Sign in with Github
								</Button>
							</NavItem>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}
