var express = require('express');
var path = require('path');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var mongoose = require('mongoose');
var request = require('request');
var qs = require('querystring');
require('dotenv').config();

mongoose.connect(process.env.MONGO_DB_URI);

var optionSchema = new mongoose.Schema({
  name: String,
  votes: {type: Number, default: 0}
});

var pollSchema = new mongoose.Schema({
  name: String,
  options: [optionSchema]
});

var pollSchema = new mongoose.Schema({
  name: String,
  _user: mongoose.Schema.Types.ObjectId,
  options: [optionSchema]
});

var Option = mongoose.model('Option', optionSchema);
var Poll = mongoose.model('Poll', pollSchema);
var User = mongoose.model('User', pollSchema);


// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
	input PollInput {
    name: String
    options: [OptionInput]
  }
  input OptionInput {
    name: String
    votes: Int
  }
  type User {
    _id: String
  }
  type Poll {
    _id: String
    _user: User
    name: String
    options: [Option]
  }
  type Option {
    name: String
    votes: Int
  }
	type Query {
		getPoll(_id: String): Poll
		getPolls: [Poll]!
	}
	type Mutation {
		createPoll(input: PollInput!): Poll
		updatePoll(_id: String, input: PollInput!): Poll
	}
`);

function idConverter(obj) {
  if (obj._id) {
    obj._id = obj._id.toString();
  }
  return obj;
}
// The root provides a resolver function for each API endpoint
var root = {
  getPoll: ({_id})=>{
    var query = Poll.findOne({_id: mongoose.Types.ObjectId(_id)});
    return queryPromiseCreator(query);
  },
  getPolls: () => {
    var query = Poll.find({});
    return queryPromiseCreator(query);
  },
  createPoll: ({input}) => {
    var poll = new Poll(input);
    return savePromiseCreator(poll);
  },
  updatePoll: ({_id, input}) => {
    console.log('_id');
    console.log(_id);
    console.log('input');
    console.log(input);
    var query = Poll.findByIdAndUpdate(mongoose.Types.ObjectId(_id), {$set: {options: input.options}});
    return queryPromiseCreator(query);
  },
};

function queryPromiseCreator(query) {
  return new Promise((resolve, reject) => {
    query.exec((err, result)=>{
      if (err) {
        console.log(err);
        reject();
      }
      console.log('result')
      console.log(result)
      result = Array.isArray(result)? result.map((el)=>{return idConverter(el)}): idConverter(result);
      resolve(result);
    })
  })
}

function savePromiseCreator(obj) {
  return new Promise((resolve, reject) => {
    obj.save((err, result)=>{
      if (err) {
        console.log(err);
        reject();
      }
      resolve(idConverter(result));
    })
  })
}

var app = express();
app.use(express.static(path.join(__dirname, '../client')));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/login', (req, res, next)=>{
  var clientID = '?client_id=' + process.env.CLIENT_ID;
  var redirectURL = 'https://github.com/login/oauth/authorize' + clientID;
  res.redirect(redirectURL);
});

app.use('/logout', (req, res, next)=>{
  //
});

app.use('/auth_callback', (req, res)=>{
  console.log('github auth');
  //redirect to homepage and logged in
  res.send('authorized!!!');
  var url = 'https://github.com/login/oauth/access_token';
  request.post({url: url, 
    form: {client_secret: process.env.CLIENT_SECRET,
      client_id: process.env.CLIENT_ID,
      code: req.params['code']}}, (error, response, body)=>{
        var perm_data = qs.parse(body);
        console.log(perm_data);
        //here we could make a user in the db to track what they do.
    res.redirect('/index.html')
  });
});
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');