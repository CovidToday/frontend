import React, { Component } from 'react';

export default class CumPosRateRenderer extends Component {
  constructor(props) {
    super(props);
  }

	getValue() {
		const raw = this.props.value;
		const last = raw[raw.length - 1];
		let value;
		if(last === "%") {
			value = raw.substring(0, raw.length - 1);
		} else {
			value = raw;
		}
		return value;
			
	}

  render() {
    return (
      <span title={`Value shown for ${this.props.data.cumPRateDate}`}>
        {this.getValue()}
      </span>
    );
  }
}