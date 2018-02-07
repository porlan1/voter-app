import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import {PieChart} from 'react-easy-chart';

class PollList extends Component {
	constructor(props) {
		super(props);
		this.state = {polls: []};
		this.voteCallback = this.voteCallback.bind(this);
	}
	componentWillMount() {
		this.props.getPolls.refetch().then(function(res)
			{console.log(res);
				console.log(res.data.getPolls);
				this.setState({polls: res.data.getPolls})}.bind(this));
	}
	voteCallback(index, data) {
		this.props.updatePoll({
			variables: 
				{id: this.state.polls[index]._id, 
				input: {name: this.state.polls[index].name, options: data}
				}
			}).then((res)=>{
				var newPolls = update(this.state.polls, {[index]: {options: {$set: data}}});
			this.setState({polls: newPolls});
		});
	}
	render() {
		return(
			<div style = {{padding: '10px'}}>
				{this.state.polls.map((el, index)=>{
					return(<div key = {el._id} style={{backgroundColor: 'gray', borderRadius: '10px', textAlign: 'center', padding: '5px', marginBottom: '10px'}}>
						<h1><u>{el.name}</u></h1>
						<div>
							{el.options.reduce((accumulator, option)=>{return accumulator + option.votes}, 0) > 0?
								<PieChart size = {200} labels data = {el.options.map((option)=>{
									let color = 'rgb(' + Math.floor((Math.random()*255)) + ',' + Math.floor((Math.random()*255)) + ',' + Math.floor((Math.random()*255)) + ')';
									return {key: option.name,
										value: option.votes,
										color: color}
									})}
								/>
							: null}
						</div>
						<VoteInPoll options={el.options} callback = {this.voteCallback.bind(this, index)}/>
					</div>);
					})}
			</div>
		)
	}
}

class Vote extends Component{
	constructor(props) {
		super(props);
		this.state = {options:
			this.props.options.map((el, index)=>{
				return {name: el.name, votes: el.votes}
			}),
			selectedOptionIndex: -1
		}	
		this.radioChange = this.radioChange.bind(this);
	}
	radioChange(index, e) {
		var newVotes = this.state.options[index].votes+1;
		var newOptions = this.props.options.map((el, i)=>{
			return {name: el.name, votes: i===index? el.votes+1:el.votes}
		});

		this.setState({
			options: newOptions,
			selectedOptionIndex: index
		});
	}
	render() {
	return <div>
		{this.state.options.map((el, index)=>{
			return <label style={{display: "inline-block"}} key = {Math.random()} htmlFor={el.name + index}>{el.name}
						<input type="radio" id={el.name + index}
     						name={index} value={index} checked = {index === this.state.selectedOptionIndex}
     						onChange = {this.radioChange.bind(null, index)} />
    				</label>
			})
			}
			<div style={{textAlign: 'center'}}>
				<button style={{fontSize: '25px', margin: '5px'}}
					onClick={this.props.callback.bind(null, this.state.options)}>
					Submit Vote
				</button>
			</div>
		</div>
	}
}

const VoteInPoll = graphql(gql`mutation updatePoll($id: String, $input: PollInput) {
	updatePoll(_id: $id, input: $input) {
		name
		options {
			name
			votes
		}
	}
}`)(Vote);

const GetPollList = compose(
	graphql(gql`query { 
			getPolls{
				_id
				name
				options {
					name
					votes
				}
			}
		}`, {name: 'getPolls'}),
	graphql(gql`mutation updatePoll($id: String, $input: PollInput!) { 
			updatePoll(_id: $id, input: $input){
				_id
				name
				options {
					name
					votes
				}
			}
		}`, {name: 'updatePoll'}))(PollList);

export default GetPollList;