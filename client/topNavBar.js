import React, { Component } from 'react';

class TopNavBar extends Component {
	render() {
		return(
			<div style = {{height: '50px', backgroundColor: 'gray', borderBottom: '1px solid black', marginBottom: '20px'}}>
				<h1 style={{position: 'absolute', padding: '0px', marginTop: '10px', marginLeft: '10px', cursor: 'pointer'}}
					onClick={()=>{window.location = '/';}}>Voting App</h1>
				<button style={{position: 'absolute', marginLeft: 'calc(100% - 200px)', marginTop: '12px', fontSize: '20px', cursor: 'pointer'}}
					onClick={()=>{window.location = '/user.html';}}>My Polls</button>
				<button style={{position: 'absolute', marginLeft: 'calc(100% - 80px)', marginTop: '12px', fontSize: '20px', cursor: 'pointer'}}
					onClick={()=>{window.location = '/login';}}>Login</button>
			</div>
		);
	}
}

export default TopNavBar;