import React, { Component } from 'react';

import Dashboard from './Containers/Dashboard';
import About from './Containers/About';
import Contribute from './Containers/Contribute';
import Methods from './Containers/Methods';
import { Button, Nav } from 'react-bootstrap';
import Header from "./images/header.png";

export default class App extends Component {
    constructor(props) {
        super(props);
      }

	render() {
	    const mobileView = window && window.innerWidth <= '1000';
	    const tabFontSize = window && window.innerWidth > '1058' ? "larger" : window && window.innerWidth > '1028' ? "large" :
	        window && window.innerWidth > '1000' ? "medium" : window && window.innerWidth > '500' ? "large" : "small";
		return (
			<div>

			<div>
            	<span className={mobileView ? "header-pic-container-mobile" : "header-pic-container"}>
            		<img src={Header} className={mobileView ? "header-pic-mobile" : "header-pic"} />
            	</span>
            	<span className={mobileView ? "nav-button-group-mobile" : "nav-button-group"}>
            		<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
            			<Button variant="outline-primary" style={{ fontSize: tabFontSize, padding: "0px" }} className="nav-button">
            			<Nav.Link style={{ color: "#383838" }} href="/">Dashboard</Nav.Link></Button>
            		</span>
            	    <span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
            			<Button variant="outline-primary" style={{ fontSize: tabFontSize, padding: "0px" }} className="nav-button">
            				<Nav.Link style={{ color: "#383838" }} href="methods">Methods</Nav.Link></Button>
            		</span>
            		<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
            			<Button variant="outline-primary" style={{ fontSize: tabFontSize, padding: "0px" }} className="nav-button">
            				<Nav.Link style={{ color: "#383838" }} href="contribute">Contribute</Nav.Link></Button>
            		</span>
            		<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
            			<Button variant="outline-primary" style={{ fontSize: tabFontSize, padding: "0px" }} className="nav-button">
            				<Nav.Link style={{ color: "#383838" }} href="aboutUs">About Us</Nav.Link></Button>
            		</span>
            	</span>
            	<span>
            	    <Dashboard />
            	    <About />
            	    <Methods />
            	    <Contribute />
            	</span>
            </div>


			</div>

		);
	}
}
