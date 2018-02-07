import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import update from 'immutability-helper';
import { Collapse, Button, CardBody, Card } from 'reactstrap';

class AddPoll extends Component {
	constructor(props) {
		super(props);
		this.state = {collapse: false, name:'',
			options: [{name: '', votes: 0}]};
		this.input = this.input.bind(this);
		this.inputOption = this.inputOption.bind(this);
		this.onClick = this.onClick.bind(this);
		this.addOption = this.addOption.bind(this);
		this.deleteOption = this.deleteOption.bind(this);
		this.toggleCollapse = this.toggleCollapse.bind(this);
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
	deleteOption(index) {
		var newOptions = update(this.state.options, {$splice: [[index, 1]]})
		this.setState({options: newOptions});
	}
	toggleCollapse() {
		this.setState({collapse: !this.state.collapse});
	}
	render() {
		return(
			<div style = {{padding: '10px'}}>
				<Button onClick={this.toggleCollapse}>Create New Poll</Button>
				<Collapse isOpen = {this.state.collapse}>
					<Card>
						<CardBody>
							<label>
							{'Poll Name: '} 
							<input type = "text"
								onInput={this.input.bind(this, 'name')}
								value = {this.state.name}/>
							</label>
							{this.state.options.map((el, index)=>{
								return <div key = {'option' + index}>
									<label
										style = {{display: 'inline-block'}}>
									{'Option ' + (index+1) + ': '}
									<input type = "text"
										onInput={this.inputOption.bind(this, index)}
										value = {el.name}/>
									</label>
									{index > 0?
										<span style = {{fontSize: '30px', color: 'red', cursor: 'pointer'}}
											onClick = {this.deleteOption.bind(null, index)}>
											-
										</span>:
										null
									}
									<br/>
								</div>
							})}
							<span style = {{fontSize: '30px', color: 'green', cursor: 'pointer'}}
								onClick = {this.addOption}>
								+
							</span>
							<br/>
							<Button onClick = {this.onClick}>
								Submit New Poll
							</Button>
						</CardBody>
					</Card>
				</Collapse>
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

export default AddPollApollo;