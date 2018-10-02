import React, {Component} from 'react';
// https://material-ui.com/demos/paper/
import Paper from '@material-ui/core/Paper';
import gql from 'graphql-tag';
import {graphql, compose} from 'react-apollo';
// Dependencies for List component from Material-UI
// https://material-ui.com/demos/lists/#lists
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import Form from './Form';

// 55:13 Looking for how RemoveMutation and RemoveTodo is declared
// 52:40 looking to see how the updateTodo and removeTodo functions are called

/**
 * String of the query that returns all todos w/
 * id, text, and complete Boolean
 */
const TodosQuery = gql`
  {
    todos {
      id
      text
      complete
    }
  }
`;

/**
 * Mutation that removes a todo with a given ID.
 * Calls the removeTodo function that is passed in through the graphql
 * compose function. The original removeTodo function lives in index.js
 */
const RemoveMutation = gql`
  mutation($id: ID!) {
    removeTodo(id: $id)
  }
`;

/**
 * Mutation that is used to update the complete status
 * of a todo item
 */
const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete)
  }
`;

const CreateTodoMutation = gql`
  mutation($text: String!) {
    createTodo(text: $text) {
      text
      id
      complete
    }
  }
`;

class App extends Component {
  /**
   * Update a todo item once the empty checkbox is clicked.
   *
   * async function, so we must await
   * updateTodo is in this.props, which is declared at the bottom
   * where the export is
   */
  updateTodo = async todo => {
    // update todo
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete,
      },
      update: store => {
        // Read the data from our cachce for this query.
        const data = store.readQuery({query: TodosQuery});
        // Add our comment from the mutation to the end.
        data.todos = data.todos.map(
          x =>
            x.id === todo.id
              ? {
                  // keep same data of all todos
                  ...todo,
                  // change the complete status of this particular todo
                  complete: !todo.complete,
                }
              : x
        );
        // Write our data back to the cache.
        store.writeQuery({query: TodosQuery, data});
      },
    });
  };

  /**
   * Asynchronous function that removes a todo list item given an ID.
   */
  removeTodo = async todo => {
    // remove todo
    await this.props.removeTodo({
      variables: {
        id: todo.id,
      },
      update: store => {
        // Read the data from our cachce for this query.
        const data = store.readQuery({query: TodosQuery});
        // Look for ID, and keep the posts whose ID do not match.
        // Filter function works by removing any posts that don't match the ID,
        // and so, the ID that does not match is removed.
        data.todos = data.todos.filter(x => x.id !== todo.id);
        // Write our data back to the cache.
        store.writeQuery({query: TodosQuery, data});
        console.log(' Removed todo successfully ');
      },
    });
  };

  createTodo = async text => {
    // create todo
    await this.props.createTodo({
      variables: {
        text,
      },
      // destructured {data: {createTpdo}} contains the
      // id, text, and complete fields
      update: (store, {data: {createTodo}}) => {
        // Read the data from our cachce for this query.
        const data = store.readQuery({query: TodosQuery});
        // Look for ID, and keep the posts whose ID do not match.
        // Filter function works by removing any posts that don't match the ID,
        // and so, the ID that does not match is removed.
        data.todos.push(createTodo);
        // Write our data back to the cache.
        store.writeQuery({query: TodosQuery, data});
      },
    });
  };

  render() {
    const {
      data: {loading, todos},
    } = this.props;
    if (loading) {
      return null;
    }
    return (
      <div style={{display: 'flex'}}>
        <div style={{margin: 'auto', width: 400}}>
          <Paper elevation={1}>
            <Form submit={this.createTodo} />
            <List>
              {todos.map(todo => (
                <ListItem
                  key={todo.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => this.updateTodo(todo)}
                  // className={classes.listItem}
                >
                  <Checkbox
                    checked={todo.complete}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={todo.text} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => this.removeTodo(todo)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}

/**
 * Compose multiple graphql functionality.
 */
export default compose(
  graphql(CreateTodoMutation, {name: 'createTodo'}),
  graphql(RemoveMutation, {name: 'removeTodo'}),
  graphql(UpdateMutation, {name: 'updateTodo'}),
  graphql(TodosQuery)
)(App);
// export default App;
