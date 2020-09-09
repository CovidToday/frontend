import React, { Component } from 'react';

export default class CrudeCfrRenderer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span title={`Value shown for ${this.props.data.crudeCfrDate}`}>
        {this.props.value}
      </span>
    );
  }
}