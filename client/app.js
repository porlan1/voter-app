import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import {PieChart} from 'react-easy-chart';

class App extends Component {
	render(){
		return (
			<div>
				<AddPollApollo/>
				<GetPollList/>
			</div>
		);
	}
}

class AddPoll extends Component {
	constructor(props) {
		super(props);
		this.state = {name:'',
			options: [{name: '', votes: 0}]};
		this.input = this.input.bind(this);
		this.inputOption = this.inputOption.bind(this);
		this.onClick = this.onClick.bind(this);
		this.addOption = this.addOption.bind(this);
		this.deleteOption = this.deleteOption.bind(this);
		this.login = this.login.bind(this);
	}
	input(name, event) {
		console.log(event.target.value);
		this.setState({[name]: event.target.value});
	}
	inputOption(index, event) {
		console.log(event.target.value);
		var newOptions = update(this.state.options, {[index]: {name: {$set: event.target.value}}});
		this.setState({options: newOptions});
	}
	onClick() {
		this.props.mutate({
			variables: 
				{input: 
					{name: this.state.name,
					options: this.state.options
					}
				}
			}).then(({ data }) => {
        		console.log('got data', data);
      	});
	}
	addOption() {
		var newOptions = update(this.state.options, {$push: [{name: '', votes: 0}]});
		this.setState({options: newOptions});
	}
	deleteOption() {
		var newOptions = update(this.state.options, {$splice: [[this.state.options.length-1, 1]]})
		this.setState({options: newOptions});
	}
	login() {
		fetch('/login');
	}
	render() {
		return(
			<div>
				<button onClick={this.login}>Login</button>
				<label>
					Name
					<input type = "text"
						onInput={this.input.bind(this, 'name')}
						value = {this.state.name}/>
				</label>
				{this.state.options.map((el, index)=>{
					return <label key = {'option' + index}
							style = {{display: 'block'}}>
						Option Name
						<input type = "text"
							onInput={this.inputOption.bind(this, index)}
							value = {el.name}/>
						</label>
				})}
				<button onClick = {this.addOption}>Add Option</button>
				{this.state.options.length > 1?
					<button onClick = {this.deleteOption}>Delete Option</button>:
					null
				}
				<button onClick = {this.onClick}>
					Submit New Poll
				</button>
			</div>
		)
	}
}

const AddPollApollo = graphql(gql`mutation createPoll($input: PollInput!){
  	createPoll(input: $input) {
  	_id
  	name
  	options {
  		name
  		votes
  	}
  }
}`)(AddPoll);

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
			<div>
				{this.state.polls.map((el, index)=>{
					return(<div key = {el._id} style={{backgroundColor: 'gray', borderRadius: '10px', height: '250px'}}>
						<h1 style = {{marginLeft: '10px'}}><u>{el.name}</u></h1>
						<VoteInPoll options={el.options} callback = {this.voteCallback.bind(this, index)}/>
						<div style={{position: "absolute", marginLeft: '50%', marginTop: '-25px'}}>
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
	return <div style={{position: 'absolute', marginLeft: '10px'}}>
		{this.state.options.map((el, index)=>{
			return <label style={{display: "block"}} key = {Math.random()} htmlFor={el.name + index}>{el.name}
						<input type="radio" id={el.name + index}
     						name={index} value={index} checked = {index === this.state.selectedOptionIndex}
     						onChange = {this.radioChange.bind(null, index)} />
    				</label>
			})
			}
			<button onClick={this.props.callback.bind(null, this.state.options)}>
			Submit Vote
			</button>
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

export default App;