import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import {PieChart} from 'react-easy-chart';
import TopNavBar from './topNavBar';
import AddPollApollo from './addPollApollo';
import GetPollList from './getPollList';

class User extends Component {
	render(){
		return (
			<div>
				<TopNavBar />
				<AddPollApollo/>
				<GetPollList/>
			</div>
		);
	}
}

export default User;