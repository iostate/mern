/**
 * Express server that connects to MongoDB on localhost.
 */

const {GraphQLServer} = require('graphql-yoga');
const mongoose = require('mongoose');

// Connect to database
mongoose.connect('mongodb://localhost/test');

const Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean,
});

// MongoDB Schema
// ! indicates that a field is required
const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
      id: ID
      text: String!
      complete: Boolean!
  }
  type Mutation {
      createTodo(text: String!): Todo
      updateTodo(id: ID!, complete: Boolean!): Boolean
      removeTodo(id: ID!): Boolean
  }
`;

// destructuring the name from the hello
// notice: has similar structure to query above
// returns a string saying hello to ${name}
const resolvers = {
  // queries allow us to search for the data in db
  Query: {
    // _ is parent (DNU)
    hello: (_, {name}) => `Hello ${name || 'World'}`,
    todos: () => Todo.find(), // finds all todos
  },

  // Mutations allow us to modify data in db
  //   async function
  // _ is the parent fucntion, don't worry about it here
  // destructure text, create new todo with text
  // complete is false by default, since it's barely being created
  // before we return todo, await the save to database.
  Mutation: {
    createTodo: async (_, {text}) => {
      const todo = new Todo({text, complete: false});
      await todo.save();
      return todo;
    },
    // update a todo
    // if the Todo successfully gets updated, then return true
    updateTodo: async (_, {id, complete}) => {
      await Todo.findByIdAndUpdate(id, {complete});
      return true;
    },
    // remove a Todo
    removeTodo: async (_, {id}) => {
      await Todo.findByIdAndRemove(id);
      return true;
    },
  },
};

// callback function. verifies whether connection to db was
// successful
const db = mongoose.connection;

// error message?
// db.on('error', console.error.bind(console, 'connection error: '));

// success message
const server = new GraphQLServer({typeDefs, resolvers});
db.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000'));
});
