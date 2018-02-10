import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import {PieChart} from 'react-easy-chart';
import TopNavBar from './topNavBar';
import AddPollApollo from './addPollApollo';
import GetPollList from './getPollList';
import './app.css';

class User extends Component {
	render(){
		return (
			<div>
				<TopNavBar />
				<AddPollApollo/>
				<div style={{textAlign: 'center', borderBottom: '2px solid black', marginBottom: '20px', }}>
					<h1>My Polls</h1>
				</div>
				<GetPollList/>
			</div>
		);
	}
}

export default User;