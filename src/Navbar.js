import React from 'react';
import {Collapse, Navbar, NavbarBrand, Nav, NavItem, Button} from 'reactstrap';

export default class AppNavbar extends React.Component {
	render() {
		return (
			<div>
				<Navbar color="faded" light expand={true} className="flex-column flex-sm-row">
					<NavbarBrand href="/" className="m-0">&#x02605; Github Star History</NavbarBrand>
					<Collapse navbar>
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
