import React, { Component } from 'react';

export default class LinkButtons extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <div className="for-the-people" style={{ textAlign: "center", fontSize: this.props.fontSize }}>
            	<a className="titillium" href="https://github.com/CovidToday/indicator-dataset" target="_blank">
            	    Get the dataset (csv and json)</a><br />
            	<a className="titillium" href="https://twitter.com/icart_india" target="_blank">
            	    Follow us on twitter</a><br />
            	<a className="titillium" href="https://forms.gle/HDCDVYApfRi319k58" target="_blank">
            	    Contribute or give us feedback</a><br />
            	<a className="titillium" href=" covidtodayindia@gmail.com" target="_blank">Get in touch with us</a>
            </div>
        )
    }
}