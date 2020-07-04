import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export default class Contribute extends Component {

  render() {
	const layout =  window.innerWidth > '1000' ? "home-text" : "text-pages-layout";
	const normalText = window.innerWidth > '1000' ? {} : {fontSize: "smaller"};
	const citationsText = window.innerWidth > '1000' ? {textAlign: "left"} : {textAlign: "left", fontSize: "smaller"};
	const headingText = window.innerWidth > '1000' ? {fontWeight: "bolder", textAlign: "center"} : {fontWeight: "bolder", fontSize: "medium", textAlign: "center"}
    return (
      <div>
		<div className="sub-header-row mt-4">
			<span className="header-bar-text">CONTRIBUTE</span>
		</div>
		<div className={layout}>
		<Card>
			<Card.Body>
								<Card.Title className="top-text-title" style={headingText}>{<div><strong>Your Feedback is Valuable. Suggest an Improvement or Addition.</strong><br/>
									Or Pitch In and Become an Active Contributor. </div>}</Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>To report a bug, suggest an improvement, ask a question, or join as an active contributor- <a href="https://forms.gle/HDCDVYApfRi319k58" target="_blank">fill this form.</a>.
                  <br/>If you are looking to contribute on GitHub- visit the open source Covid Today project <a href="https://github.com/CovidToday/backend">here.</a>
                  <br/>All contributors will be recognised as part of the Active Contributor Team on the About Us page.
                  <br/><br/>
										You can also contact us at<br/>
										Email: covidtodayindia@gmail.com<br/>
										Twitter: <a href="https://twitter.com/icart_india" target="_blank">@icart_india</a><br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Collaboration opportunities</strong></Card.Title>
								<Card.Text className="top-text-body titillium">
									<div style={normalText}><b>Anyone! Help us gather essential data from the ground-up. Contribute if you can collect any of the
									following data from your state:</b><br/>
									All states: Number of COVID Care Centres, Dedicated COVID Health Centres and Dedicated COVID Hospitals
									(hospital beds, ICU beds, ventilators- total and occupied), Number of quarantined
									<br/><br/>

									<b>Public health experts, Epidemiologists, Journalists, Medicos! Help us write short periodical analyses of the numbers we present</b>
									, exploring and breaking down the trends that lie within and what they mean for the COVID-19 response. Curate insightful analyses on
									our twitter handle or write on your own platform. <br/><br/>

									<b>Software engineers, Data scientists! Build and fine-tune the technological backbone. </b>
									The backend is open sourced on github. Find new issues or have your pick of the existing ones, and help build the code that
									crunches the numbers and oils the pipeline. We are planning on open sourcing the UI too, get in touch if you want to pitch in.
									<br/><br/>

									<b>Public health experts, Data analysts, Epidemiologists, ML experts, all others! Build on the concept. </b>
                  Innovate with us on what indicators to show next, how to better present the data for more insightful conclusions,
                  and how to expand the platform to make it more resourceful. We are also exploring the data we see through ML.
									<br/><br/>

									<b>Not on this list? Tell us how you can contribute. </b><br/><br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Planned updates. Suggestions and contributions welcome.</strong></Card.Title>
								<Card.Text className="titillium">
									<div style={citationsText}>All issues listed in the Github repo <a href="https://github.com/CovidToday/backend/issues" target="_blank">here.</a><br/>
									<ol>
									<li>Adding more indicators for Transmission and Testing domains. </li>
									<li>Adding a third domain (Healthcare system): We are looking for statewise data sources for the number of total and
									occupied hospital beds, ICU beds and ventilators. If your state is releasing this data, contact us and join the data
									curation essential for monitoring the health care capacity and response of each state.</li>
									<li>Making it easier for everyone to understand the indicators we present. </li>
									<li>Expanding the dashboard for hot-spot districts (eg: Mumbai, Thane, Pune, Chennai, Ahmedabad, Indore, etc) and
									metropolitan districts providing reliable data.</li>
									<li>Improving upon current calculation methodology.</li>
									<li>Comprehensive data visualisation on website: Adding more plots. Statewise detailed visualisation. Inter-state comparison. Inter-variable scatter plots. </li>
									</ol>
									</div>
								</Card.Text>
							</Card.Body>
		</Card>
		</div>
	  </div>

    );
  }
}
