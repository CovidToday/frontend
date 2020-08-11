/* Old Header with menu */
<div>
	<span className={mobileView ? "header-pic-container-mobile" : "header-pic-container"}>
		<img src={Header} className={mobileView ? "header-pic-mobile" : "header-pic"} />
	</span>
	<span className={mobileView ? "nav-button-group-mobile" : "nav-button-group"}>
		<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
			<Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
				onClick={() => this.setState({ selectedView: "Home" }, this.handleDashboardScroll)}>Dashboard</Button>
		</span>
	    <span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
			<Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
				onClick={() => this.setState({ selectedView: "Methods" })}>Methods</Button>
		</span>
		<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
			<Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
				onClick={() => this.setState({ selectedView: "Contribute" })}>Contribute</Button>
		</span>
		<span className={mobileView ? "nav-bar-mobile" : "nav-bar"}>
			<Button variant="outline-primary" style={{ fontSize: tabFontSize }} className="nav-button"
				onClick={() => this.setState({ selectedView: "Team" })}>About Us</Button>
		</span>
	</span>
	<span>
	</span>
</div>
/* End */

/*
.
.
.
.
*/

/* Text on top of website with accordion */
<div className="disclaimer-top" style={{ fontSize: fontSizeDynamic }}>How fast is the virus spreading in my state? How is the movement of people changing with lifting of restrictions?
			Is my state testing enough people to reopen safely? How good is the healthcare response of my state? Knowledge is power, and these are some questions we want to help answer
			for you. This dashboard streamlines and analyses raw data (number of daily cases, number of tests done etc) to calculate and visualise outbreak indicators
			for each state in realtime. Lockdown lifting should ideally be based on monitoring these indicators and adapting accordingly.</div><br />
			<Accordion>
				<Card>
					<Card.Header>
						<div className="top-text-title" style={{ fontSize: fontSizeDynamicHeading, textAlign: "center", fontWeight: "bolder" }}>
							Reliable Scientific Data for Policymakers, Researchers, Journalists and Citizens</div>
						<span className="disclaimer-top" style={{ fontSize: fontSizeDynamicSH, fontWeight: "bolder" }}>We do the hard work for you, so you can focus on what the data means.</span>
						<Accordion.Toggle className="accordion-button" variant="link" eventKey="1">
							<span style={{ fontSize: fontSizeDynamic }}>How?</span>
						</Accordion.Toggle>
					</Card.Header>
					<Accordion.Collapse eventKey="1">
						<Card.Body>
							<Card.Text className="top-text-body">
								<div style={{ fontSize: fontSizeDynamic }}>
									<ul>
										<li>All data made available for running your own analyses </li>
										<li>Cleaning and integrating data from multiple sources </li>
										<li>Analysing the data using robust statistical methods </li>
										<li>Correcting for known biases in estimation to give a truer picture the outbreak </li>
										<li>Using latest scientific evidence and advisories to guide interpretation </li>
										<li>Updated daily for all states of India (where data is available) </li>
										<li>Enabling understanding of outbreak indicators through easy explanation and data visualisation</li>
									</ul></div>
							</Card.Text>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
				<div style={{ paddingTop: "5px" }}>
					<Button variant="outline-primary" className={mobileView ? "scroll-button-mobile" : "scroll-button"} onClick={this.handleDivScroll}>
						<span style={{ fontSize: fontSizeDynamic }}>Know about the indicators</span></Button></div>
			</Accordion>
/* End */