import React, { Component } from 'react';

export default class DailyDosesPerMillionRenderer extends Component {
  constructor(props) {
    super(props);
  }

	getValue() {
		const data = this.props.data;
			if(this.props.value && this.props.value !== "NA"){
				return <span title={`Value shown for ${this.props.data.dailyDosesPerMillionDate}`}><span>{this.props.value}</span></span>
		    } else {
		        return <span>-</span>
		    }
	}

  render() {
    return (
      <span>
        {this.getValue()}
      </span>
    );
  }
}