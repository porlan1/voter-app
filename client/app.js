import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import update from 'immutability-helper';
import PieChart from "react-svg-piechart"

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
	render() {
		return(
			<div>
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
	}
	componentWillMount() {
		console.log('CWL');
		console.log('Data:');
		console.log(this.props.data);
		this.props.data.refetch().then(function(res)
			{console.log(res);
				console.log(res.data.getPolls);
				this.setState({polls: res.data.getPolls})}.bind(this));
	}
	render() {
		console.log(this.state);
		return(
			<div>
				{this.state.polls.map((el)=>{
					return(<div key = {el._id}>
						<h1>{el.name}</h1>
						<VoteInPoll options={el.options} callback = {()=>{}}/>
						<PieChart data = {el.options.map((option)=>{
							return {title: option.name,
								value: option.votes,
								color: 'rgb(' + (Math.random()*255) + ',' + (Math.random()*255) + ',' + (Math.random()*255) + ')'}
							})}
						/>
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
		console.log(e.target.value);
		var newVotes = this.state.options[index].votes++;
		var newOptions = update(this.state.options, {[index]:{votes: {$set: newVotes}}});
		if (this.state.selectedOptionIndex !== -1) {
			newVotes = this.state.options[this.state.selectedOptionIndex].votes--;
			newOptions = update(this.state.options, {[this.state.selectedOptionIndex]:{votes: {$set: newVotes}}});
		}

		this.setState({
			options: newOptions,
			selectedOptionIndex: index
		});
	}
	render() {
	return <div>
		{this.state.options.map((el, index)=>{
			return <label key = {Math.random()} htmlFor={el.name + index}>{el.name}
						<input type="radio" id={el.name + index}
     						name={index} value={index}
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

const GetPollList = graphql(gql`query { 
			getPolls{
				_id
				name
				options {
					name
					votes
				}
			}
		}`)(PollList);

export default App;