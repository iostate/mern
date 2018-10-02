import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';

class Form extends Component {
  state = {
    text: '',
  };

  handleChange = e => {
    const newText = e.target.value;
    this.setState({text: newText});
    console.log(this.state.text);
  };

  handleKeyDown = e => {
    console.log(e);
    if (e.key === 'Enter') {
      this.props.submit(this.state.text);
    }
  };

  render() {
    const {text} = this.state;
    return (
      <TextField
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        label="todo..."
        margin="normal"
        value={text}
        fullWidth
      />
    );
  }
}

export default Form;
