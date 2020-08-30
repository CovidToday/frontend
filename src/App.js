import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Dashboard from './Containers/Dashboard';
import About from './Containers/About';
import Contribute from './Containers/Contribute';
import Methods from './Containers/Methods';
import { Button, Nav } from 'react-bootstrap';
import Header from "./images/header.png";

export default class App extends Component {
	render() {
	    const mobileView = window.innerWidth <= '1000';
	    const tabFontSize = window.innerWidth > '1058' ? "larger" : window.innerWidth > '1028' ? "large" : window.innerWidth > '1000' ? "medium" :
        			window.innerWidth > '500' ? "large" : "small";
		return (
			<div>
			<BrowserRouter>
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
            	</span>
            </div>
				<Switch>
                    <Route exact path="/" component={Dashboard} />
                    <Route path="/methods" component={Methods} />
                    <Route path="/contribute" component={Contribute} />
                    <Route path="/aboutUs" component={About} />
                    <Route component={Dashboard} />
                </Switch>
            </BrowserRouter>
			</div>

		);
	}
}
