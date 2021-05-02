import React, { Component } from 'react';
import { Card, CardGroup } from 'react-bootstrap';

export default class IndicatorDescriptionCards extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        return (
        <>
            {/*<div className="for-the-people-heading" style={{ padding: "10px", fontSize: this.props.fontSize }}>How fast is the spread? (Transmission indicators)</div>*/}
				<CardGroup>
					<Card style={{ background: "#e8e8e8" }}>
						<Card.Body>
							<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: this.props.fontSize }}>{`Effective Reproduction Number (Rt)`}</Card.Title>
							<Card.Text className="top-text-body" style={{ fontSize: this.props.fontSize }}>
								<div><span style={{ fontStyle: "italic" }}>Rt is the average number of people infected by a single case, at a particular time
   								t during the outbreak.</span>  WHO recommends this metric as the key measure to know the rate of spread of the virus. When Rt
   								reaches below 1, we can say that the outbreak has been brought under control. Tracking the regional Rt tells us the severity of
  								the outbreak in each state, and guides administrators to fine-tune the level of control measures required to bring the Rt under
   								1. As changes in transmission correlate with control measures, we can assess the efficacy of different measures by comparing the
   								change in Rt after their implementation. </div>
							</Card.Text>
						</Card.Body>
					</Card>
          			<span style={{ width: "2%" }}> </span>
            		<Card style={{ background: "#e8e8e8" }}>
            			<Card.Body>
            				<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: this.props.fontSize }}>{`Mobility Index`}</Card.Title>
            				<Card.Text className="top-text-body" style={{ fontSize: this.props.fontSize }}>
            					<div><span style={{ fontStyle: "italic" }}>This indicates the change in the amount of movement of people at various places
            					compared to that before lockdown</span>  It shows us the effect of lockdown and behavioural change on the movement of people,
            					and how this changes as restrictions are relaxed in a graded manner. We have introduced this parameter experimentally considering
            					that mobility has a direct effect on disease spread, however there is no evidence yet that the mobility indices shown directly
            					correlate with local transmission. This aggregated data is sourced from Google Mobility Reports.</div>
            				</Card.Text>
            			</Card.Body>
            		</Card>
            	</CardGroup>
            	<div className="mt-2"></div>
            	{/*<div className="for-the-people-heading" style={{ padding: "10px", fontSize: this.props.fontSize }}>Are we testing enough? (Testing indicators)</div>*/}
            	<CardGroup>
            		<Card style={{ background: "antiquewhite" }}>
            			<Card.Body>
            				<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: this.props.fontSize }}>{`Test Positivity Rate`}</Card.Title>
            				<Card.Text className="top-text-body" style={{ fontSize: this.props.fontSize }}>
            					<div><span style={{ fontStyle: "italic" }}>It is the percent of COVID-19 tests done that come back positive.</span> A low positivity
            					rate means that testing levels are sufficient for the scale of the epidemic and surveillance is penetrating the community enough to
            					detect any resurgence. In contrast, a high positivity rate indicates that testing is relatively limited to people with high suspicion
            					of COVID-19 and may miss new chains of transmission in the community. The WHO recommends that the daily positivity rate be below 5%
            					for atleast two weeks before relaxing public health measures. Test Positivity Rate is a better indicator of testing adequacy than
            					Tests Per Million, as testing coverage should be seen relative to the size of the epidemic rather than the size of the population.
            					We report daily positivity rate (as 7-day moving averages) and cumulative positivity rate (which includes all tests done till date). </div>
            				</Card.Text>
            			</Card.Body>
            		</Card>
            		<span style={{ width: "2%" }}> </span>
            		<Card style={{ background: "antiquewhite" }}>
            			<Card.Body>
            				<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: this.props.fontSize }}>{`Stringency Index`}</Card.Title>
            				<Card.Text className="top-text-body" style={{ fontSize: this.props.fontSize }}>
            					<div>The Stringency Index indicates the stringency of the policies and
                                     measures implemented by the government to prevent the spread of
                                     COVID-19. This index provides a systematic way to track government
                                     responses to COVID-19 over time. This value of this index is based on a
                                     composite of government responses including school closures,
                                     workplace closures, and travel bans, rescaled to a value from 0 to 100
                                     (100 = strictest). It can also be used to explore whether the government
                                     response affects the rate of infection. The stringency index is sourced
                                     from Oxford COVID-19 Government Response Tracker (OxCGRT). </div>
            				</Card.Text>
            			</Card.Body>
            		</Card>
            	</CardGroup>
            </>
        )
    }
}