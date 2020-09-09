import React, { Component } from 'react';
import upIcon from "../../images/up red.png"
import downIcon from "../../images/down green.png"
import yellowDash from "../../images/yellowDash.png"


export default class DailyTPMRenderer extends Component {
  constructor(props) {
    super(props);
  }

	getValue() {
		const data = this.props.data;
			if(this.props.value && this.props.value !== "NA"){
				if(parseFloat(data.dailyTPM) < (parseFloat(data.dailyTPMOld) - parseFloat(data.dailyTPMOld/20))) {
				    return <span title={`Value shown for ${this.props.data.dailyTPMDate}`}><span style={{paddingRight: "3px"}}>
				        {this.props.value}</span><img src={downIcon} className="cell-icon"/></span>
			    } else if(parseFloat(data.dailyTPM) > (parseFloat(data.dailyTPMOld) + parseFloat(data.dailyTPMOld/20))) {
                    return <span title={`Value shown for ${this.props.data.dailyTPMDate}`}><span style={{paddingRight: "3px"}}>
                       	{this.props.value}</span><img src={upIcon} className="cell-icon"/></span>
                } else {
				    return <span title={`Value shown for ${this.props.data.dailyTPMDate}`}><span style={{paddingRight: "3px"}}>
				        {this.props.value}</span><img src={yellowDash} className="cell-icon"/></span>
			    }
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