import React, { Component } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class App extends Component {
	render(){
		return (
			<div>
				<AddPersonApollo/>
				<GetPersonList/>
			</div>
		);
	}
}

class AddPerson extends Component {
	constructor(props) {
		super(props);
		this.state = {name:'',
		favoriteFood:'',
		favoriteDessert: ''};
		this.input = this.input.bind(this);
		this.onClick = this.onClick.bind(this);
	}
	input(name, event) {
		console.log(event.target.value);
		this.setState({[name]: event.target.value});
	}
	onClick() {
		this.props.mutate({
			variables: 
				{input: 
					{name: this.state.name,
					favoriteFood: this.state.favoriteFood,
					favoriteDessert: this.state.favoriteDessert
					}
				}
			}).then(({ data }) => {
        		console.log('got data', data);
      	});
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
				<label>
					Favorite Food
					<input type = "text"
						onInput={this.input.bind(this, 'favoriteFood')}
						value = {this.state.favoriteFood}/>
				</label>
				<label>
					Favorite Dessert
					<input type = "text"
						onInput={this.input.bind(this, 'favoriteDessert')}
						value = {this.state.favoriteDessert}/>
				</label>
				<button onClick = {this.onClick}>
					Submit New Person
				</button>
			</div>
		)
	}
}

const AddPersonApollo = graphql(gql`mutation
  createPerson($input: PersonInput!)  {
  	createPerson(input: $input) {
  	id
  	name
  }
}`)(AddPerson);

class PersonList extends Component {
	constructor(props) {
		super(props);
		this.state = {people: []};
	}
	componentWillMount() {
		console.log('Data:');
		console.log(this.props.data);
		this.props.data.refetch().then(function(res)
			{console.log(res);
				console.log(res.data.getPeople);
				this.setState({people: res.data.getPeople})}.bind(this));
	}
	render() {
		console.log(this.state);
		return(
			<div>
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Favorite Food</th>
							<th>Favorite Dessert</th>
						</tr>
					</thead>
					<tbody>
						{this.state.people.map((el)=>{
							return(<tr key = {el.id}>
								<td>{el.name}</td>
								<td>{el.favoriteFood}</td>
								<td>{el.favoriteDessert}</td>
							</tr>)
						})}
					</tbody>
				</table>
			</div>
		)
	}
}

const GetPersonList = graphql(gql`{ 
			getPeople{
				id
				name
				favoriteFood
				favoriteDessert
			}
		}`)(PersonList);

export default App;