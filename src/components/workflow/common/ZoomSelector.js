import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Menu  from '@material-ui/core/Menu';
import  MenuItem from '@material-ui/core/MenuItem';
import T from 'i18n-react';

class ZoomSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleSelected.bind(this);
  }
  
  handleClick(event) {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  handleSelected(selected) {
    this.props.onSelected && this.props.onSelected(selected);
    this.setState({ open: false });
  };

  handleClose(){
    this.props.setState({open: false});
  }

  render() {
    return (
      <div>
        <Button
          aria-owns={this.state.open ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <T.span text="zoom" />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={this.state.anchorEl}
          open={this.state.open}
          onClose={this.handleClose}
        >
          <MenuItem onClick={() => this.handleSelected(0.5)}>50%</MenuItem>
          <MenuItem onClick={() => this.handleSelected(0.75)}>75%</MenuItem>
          <MenuItem onClick={() => this.handleSelected(1)}>100%</MenuItem>
          <MenuItem onClick={() => this.handleSelected(1.25)}>125%</MenuItem>
          <MenuItem onClick={() => this.handleSelected(1.5)}>150%</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default ZoomSelector;