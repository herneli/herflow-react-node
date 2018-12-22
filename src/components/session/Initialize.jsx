import React, { Component } from 'react';
import T from 'i18n-react';

class Initialize extends Component {
  componentDidMount() {
    this.props.onInitialize();
  }

  render() {
    return <div className="centered">{T.translate('initializing')}</div>;
  }
}

export default Initialize;
