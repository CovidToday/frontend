import React, { Component } from 'react';
import upIcon from "../../images/greenUp.svg"
import downIcon from "../../images/redDown.png"
import yellowDash from "../../images/yellowDash.png"

export default class DBTRenderer extends Component {
  constructor(props) {
    super(props);
  }

	getValue() {
		const data = this.props.data;
			if(this.props.value && this.props.value !== "NA"){
				if(parseFloat(data.dbt) < (parseFloat(data.dbtOld) - parseFloat(data.dbtOld/20))) {
				    return <span title={`Value shown for ${this.props.data.dbtDate}`}><span style={{paddingRight: "3px"}}>
				        {this.props.value}</span><img src={downIcon} className="cell-icon"/></span>
			    } else if(parseFloat(data.dbt) > (parseFloat(data.dbtOld) + parseFloat(data.dbtOld/20))) {
                    return <span title={`Value shown for ${this.props.data.dbtDate}`}><span style={{paddingRight: "3px"}}>
                       	{this.props.value}</span><img src={upIcon} className="cell-icon"/></span>
                } else {
				    return <span title={`Value shown for ${this.props.data.dbtDate}`}><span style={{paddingRight: "3px"}}>
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