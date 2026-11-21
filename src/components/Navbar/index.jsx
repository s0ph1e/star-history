import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';

import './style.css';

function AppNavbar({ username }) {
	return (
		<div className="App-header">
			<div className="App-header__container">
				<Navbar expand="sm">
					<Container fluid>
						<Navbar.Brand as={Link} to="/" className="brand">&#x02605; Github Star History</Navbar.Brand>
						<Navbar.Toggle aria-controls="app-navbar-nav" />
						<Navbar.Collapse id="app-navbar-nav">
							<Nav className="me-auto">
								{username && <Nav.Link as={Link} to="/">Home</Nav.Link>}
								{username && <Nav.Link as={Link} to="/repos">Your repos</Nav.Link>}
								<Nav.Link href="https://github.com/s0ph1e/star-history">Github</Nav.Link>
							</Nav>
							<ProfileMenu username={username} />
						</Navbar.Collapse>
					</Container>
				</Navbar>
			</div>
		</div>
	);
}

function ProfileMenu({ username }) {
	if (!username) {
		return (
			<Button size="sm" variant="secondary" href="/auth/github" className="btn-github mt-2 mb-2 mt-sm-0 mb-sm-0">
				Sign in with Github
			</Button>
		);
	}
	return (
		<Dropdown align="end" className="mt-2 mb-2 mt-sm-0 mb-sm-0">
			<Dropdown.Toggle variant="outline-secondary" size="sm">
				Hi {username}
			</Dropdown.Toggle>
			<Dropdown.Menu>
				<Dropdown.Item href="/logout">logout</Dropdown.Item>
			</Dropdown.Menu>
		</Dropdown>
	);
}

const mapStateToProps = state => ({
	username: state.user.username
});

export default connect(mapStateToProps)(AppNavbar);
