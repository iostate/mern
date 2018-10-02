import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';

// Practice using destructuring
// Create a text field, whose value is this.state.age
// destructure const {age} = this.state

// Create a text field, whose value is this.state.name
// destructure using const {name} = this.state

class Form2 extends Component {
  state = {
    name: '',
    age: 0,
  };

  handleNameChange = e => {
    const newText = e.target.value;
    this.setState({name: newText});
    console.log(this.state.name);
  }

  handleNameKeyDown = e => {
    console.log(e);
    if (e.key === 'Enter') {
      this.props.submit(this.state.name);
    }
  }

  handleAgeChange = e => {
    const newAge = e.target.value;
    this.setState({
      age: newAge
    });
    console.log(this.state.age);
  }

  handleAgeKeyDown = e => {
    console.log(e);
    if (e.key === 'Enter') {
      this.props.submit(this.state.age);
    }
  }

  render() {
    const {name, age} = this.state;

    <TextField
      onChange = {this.handleNameChange} 
      onKeyDown = {this.handleNameKeyDown} 
      label = "Name: "
      margin="normal"
      value={name}
      fullWidth
    />

    <TextField
      onChange = {this.handleAgeChange} 
      onKeyDown = {this.handleAgeKeyDown}
      label = "Age: "
      margin="normal"
      value={age}
      fullWidth 
    />
  }
}

export default Form2;