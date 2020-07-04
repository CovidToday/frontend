import React, { Component } from 'react';

export default class TPMRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span title={`Value shown for ${this.props.data.tpmDate}`}>
        {this.props.value}
      </span>
    );
  }
}