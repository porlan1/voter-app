import React, { Component } from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button} from 'reactstrap';


class TopNavBar extends Component {
	render() {
		return(
			<div className='navbar-border'>
				<Navbar color="faded" light expand="md">
	          		<NavbarBrand href="/">Voting App</NavbarBrand>
	          		<Nav className="ml-auto" navbar>
	              		<NavItem>
	                		<NavLink onClick={()=>{window.location = '/user.html';}}>My Polls</NavLink>
	              		</NavItem>
	              		<NavItem>
	                		<NavLink onClick={()=>{window.location = '/login';}}>Login</NavLink>
	              		</NavItem>
	              	</Nav>
	          	</Navbar>
          	</div>
		);
	}
}

export default TopNavBar;