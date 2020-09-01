import React, { Component } from 'react';
import ReactGA from 'react-ga';
import Dashboard from './Containers/Dashboard';
import About from './Containers/About';
import Contribute from './Containers/Contribute';
import Methods from './Containers/Methods';
import { Button, Nav } from 'react-bootstrap';
import Header from "./images/header new slim inverted.png";

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedView: "home"
        }
        this.updateSelectedView = this.updateSelectedView.bind(this);
    }

    updateSelectedView(newView) {
        this.setState({selectedView: newView});
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    componentDidMount() {
        ReactGA.initialize('UA-168412971-1');
        ReactGA.pageview('covidToday');
    }

	render() {
	    const mobileView = window.innerWidth <= '1000';
	    const tabFontSize = window.innerWidth > '1058' ? "larger" : window.innerWidth > '1028' ? "large" : window.innerWidth > '1000' ? "medium" :
        			window.innerWidth > '500' ? "large" : "small";
		return (
			<div>
                <div>
                    <div className={mobileView ? "header-pic-container-mobile" : "header-pic-container"}>
                        <img src={Header} className={mobileView ? "header-pic-mobile" : "header-pic"} />
                    </div>
                    <div className={mobileView ? "nav-button-group-mobile" : "nav-button-group"}>
                        <span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
                            <Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
                                onClick={() => {this.setState({selectedView: "home"})}}>Dashboard</Button>
                        </span>
                        <span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
                            <Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
                                onClick={() => {this.setState({selectedView: "methods"})}}>Methods</Button>
                        </span>
                        <span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
                            <Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
                                onClick={() => {window.open("https://covidtoday.github.io/backend/", "_blank")}}>Get Data</Button>
                        </span>
                       {/*<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
                            <Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
                                onClick={() => {this.setState({selectedView: "contribute"})}}>Contribute</Button>
                        </span>*/}
                        <span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
                            <Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
                                onClick={() => {this.setState({selectedView: "about"})}}>About Us</Button>
                        </span>
                    </div>
                </div>
				<div>
                    {this.state.selectedView === "home" && <Dashboard updateView={this.updateSelectedView} />}
                    {this.state.selectedView === "methods" && <Methods />}
                    {this.state.selectedView === "contribute" && <Contribute />}
                    {this.state.selectedView === "about" && <About />}
                </div>
			</div>

		);
	}
}
