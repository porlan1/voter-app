import React, { Component } from 'react';
import TopNavBar from './topNavBar';
import GetPollList from './getPollList'
import './app.css';

class App extends Component {
	render(){
		return (
			<div>
				<TopNavBar />
				<GetPollList/>
			</div>
		);
	}
}

export default App;