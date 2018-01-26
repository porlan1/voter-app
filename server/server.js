var express = require('express');
var path = require('path');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_URI);

var optionSchema = new mongoose.Schema({
  name: String,
  votes: {type: Number, default: 0}
});

var pollSchema = new mongoose.Schema({
  name: String,
  options: [OptionSchema]
});

var Option = mongoose.model('Option', optionSchema);
var Poll = mongoose.model('Poll', pollSchema);


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	input PersonInput {
    	name: String
    	favoriteFood: String
    	favoriteDessert: String
  	}
	type Person {
		id: ID!
    	name: String
    	favoriteFood: String
    	favoriteDessert: String
    }
  	type Query {
  		getPerson(id: ID!): Person
  		getPeople: [Person]!
  	}
  	type Mutation {
  		createPerson(input: PersonInput!): Person
  		updatePerson(id: ID!, input: PersonInput!): Person
  	}
`);

var fakeDatabase = {};

function Person(id, {name, favoriteFood, favoriteDessert}) {
	this.id = id;
	this.name = name;
	this.favoriteFood = favoriteFood;
	this.favoriteDessert = favoriteDessert;
}
// The root provides a resolver function for each API endpoint
var root = {
  getPerson: function ({id}) {
    if (!fakeDatabase[id]) {
      throw new Error('no person exists with id ' + id);
    }
    return new Person(id, fakeDatabase[id]);
  },
  getPeople: function () {
  	var people = [];
    for (let key in fakeDatabase) {
    	people.push(new Person(key, fakeDatabase[key]));
    }
    return people
  },
  createPerson: function ({input}) {
    // Create a random id for our "database".
    var id = require('crypto').randomBytes(10).toString('hex');
    console.log(id);
    fakeDatabase[id] = input;
    console.log(input);
    console.log(fakeDatabase);
    return new Person(id, input);
  },
  updatePerson: function ({id, input}) {
    if (!fakeDatabase[id]) {
      throw new Error('no person exists with id ' + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Person(id, input);
  },
};

var app = express();
app.use(express.static(path.join(__dirname, '../client')));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/auth_callback', (req, res)=>{
  console.log('github auth');
  //redirect to homepage and logged in
});
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');