import React, { Component } from 'react';
import { Card, Table } from 'react-bootstrap';
import Equation from "../images/equation.jpeg"

export default class Methods extends Component {

  render() {
	const tableClass = window.innerWidth > '1000' ? "methods-table" : "methods-table-mobile";
	const layout =  window.innerWidth > '1000' ? "home-text" : "text-pages-layout";
	const normalText = window.innerWidth > '1000' ? {} : {fontSize: "smaller"};
	const citationsText = window.innerWidth > '1000' ? {textAlign: "left"} : {textAlign: "left", fontSize: "smaller"};
	const headingText = window.innerWidth > '1000' ? {fontWeight: "bolder", textAlign: "center"} : {fontWeight: "bolder", fontSize: "medium", textAlign: "center"}
	const italicText = window.innerWidth > '1000' ? {fontStyle: "italic"} : {fontStyle: "italic", fontSize: "inherit"};
	const italicBoldText = window.innerWidth > '1000' ? {fontStyle: "italic", fontWeight: "bolder"} : {fontStyle: "italic", fontWeight: "bolder", fontSize: "inherit"};
    return (
      <div>
		<div className="sub-header-row mt-4">
			<span className="header-bar-text">METHODS</span>
		</div>
		<div className={layout}>
							<Card>
              <Card.Body>
                <Card.Title className="top-text-title" style={headingText}><strong>The Code That Powers Covid Today</strong></Card.Title>
                <Card.Text className="top-text-body">
                  <div style={citationsText}>
                  Our code extracts, cleans and analyses the data to calculate outbreak indicators for all states and
                  creates clean and reliable datasets for your use. The code is open sourced on Github: <a href="https://github.com/CovidToday/backend" target="_blank">Covid Today/Backend repository</a>
                  and is open to contribution.
                  </div>
                </Card.Text>
              </Card.Body>

							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Data Sources</strong></Card.Title>
								<Card.Text className="top-text-body">
									<div style={citationsText}><b>Raw data for cases and tests</b>- <a href="http://www.covid19india.org" target="_blank">www.covid19india.org</a><br/>
										 <b>Data for mobility index</b>- <a href="http://www.google.com/covid19/mobility" target="_blank">www.google.com/covid19/mobility</a><br/>
										 <b>Distribution of delay from symptom onset to confirmation</b>- <a href="http://www.medrxiv.org/content/10.1101/2020.05.13.20096826v2" target="_blank">www.medrxiv.org/content/10.1101/2020.05.13.20096826v2</a> (53 patients from Delhi NCR)<br/>
										 <b>Distribution of serial interval</b>- <a href="http://wwwnc.cdc.gov/eid/article/26/6/20-0357_article" target="_blank">wwwnc.cdc.gov/eid/article/26/6/20-0357_article</a> (468 patients from China; no local data available)<br/>
										 <b>Distribution of delay from hospitalisation to death</b>- <a href="http://www.mdpi.com/2077-0383/9/2/538/htm" target="_blank">www.mdpi.com/2077-0383/9/2/538/htm</a><br/>
										 <b>Population data</b>- <a href="http://uidai.gov.in/images/state-wise-aadhaar-saturation.pdf" target="_blank">uidai.gov.in/images/state-wise-aadhaar-saturation.pdf</a><br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Effective Reproduction Number (Rt)</strong></Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}><b>Adjusting for the delay from symptom onset to case confirmation:</b><br/>
									A variable delay occurs from symptom onset to case confirmation (reporting lag) which is attributed to multiple factors including
									time taken to seek care (patient dependent) and time taken to detect and test the case (healthcare-system dependent). The daily
									raw data gives us the 'incidence by confirmation'. We transform this incidence by confirmation into incidence by symptom onset,
									 using the delay from symptom onset to confirmation estimated in a study which included 53 symptomatic COVID+ patients in Delhi.
									(1) The delay had a mean of 3.40 days (95% CI 2.87-3.96) with SD of 2.09 days (95% CI 1.52-2.56) and a median of 2.68 days
									(95% CI 2.00-3.00) with IQR of 2.03 days (95% CI 1.00-3.00). The gamma distribution with shape parameter 3.45 (95% CI 2.42-5.19)
									and rate parameter 1.02 (95% CI 0.70-1.60) was the best fit to the distribution. 1000 samples of the delay
									distribution parameters (φ<sub>i</sub>) were drawn taking into account the uncertainty in the distribution parameters ie.
									shape and scale for the gamma distribution to serve as the posterior distribution of the delay. For each of the 1000
									samples of fitted parameters, the reporting dates (r<sub>i</sub>) were transformed to give the symptom onset date (o<sub>i</sub>) by the formula:<br/>
									o<sub>i</sub> = r<sub>i</sub> - d<sub>i</sub><br/>
									where d<sub>i</sub> (delay from onset to confirmation) ~ Gamma(φ<sub>i</sub>) resulting in 1000 lag adjusted datasets. This process was applied to the
									incidence by confirmation data for the nation and different states.<br/><br/>

									<b>Adjusting for yet unconfirmed cases in order to estimate recent onsets:</b><br/>
									The above method can only estimate symptom onsets till d<sub>max</sub> days before today, where d<sub>max</sub> is the maximum possible reporting lag.
									The onsets that would have already occurred in these recent days have not yet been confirmed. In order to account for this right
									truncation of case confirmations, we used a process of binomial upscaling. Consider 't' is the latest date for which the cases
									have been adjusted. We model the number of onsets on 'l' days before the latest date, o<sub>(t-l)</sub> with Bernoulli trials with the
									probability equal to the proportion of the cases that have been confirmed since onset in the following l days. This probability
									is given by F( l | f<sub>i</sub>) ie. the CDF (F( x | f<sub>i</sub> )) of the reporting lag distribution at x = l days. Thus, the number of missed
									onset dates would be given by:<br/>
									o*<sub>(t-l)</sub> ~ Negbin( n = o<sub>(t-l)</sub> + 1, p = F( l | f<sub>i</sub> ) )<br/>
									Thus, the total number of onsets on date 'x' is given by o(x)+o*(x). One important point to consider is that this
									method is prone to high bias when the probability 'p' approaches low values at dates very close to the latest date.
									Since we were not able to adjust for this bias, the last few dates were dropped when the variability across trials for
									estimates started increasing due to the high bias.<br/><br/>

									<b>Estimating the Effective Reproduction Number at time t</b><br/>
									From the daily number of symptom onsets, the time-varying R<sub>t</sub> was calculated using EpiEstim package in R 3.6.3 which uses the Time
									Dependent Maximum Likelihood approach.(2,3) Serial interval is the time interval between symptom onsets in a primary and a secondary
									case, and is thus appropriate to calculate Rt from symptom onset based incidence data. Due to lack of serial interval estimates from
									India, we used the best available estimate from a study including 468 patients in China (4)  as a gamma distributed serial interval
									with a mean of 3.96 days (95% CI 3.53-4.39) and a SD of 4.75 days (95% CI 4.46-5.07). which was in agreement with several other
									studies.(5-7) We use 7-day sliding windows. The estimates of Rt for each day were combined for the 1000 lag adjusted datasets by
									calculating pooled mean and pooled standard deviation and a net estimate for 50% and 95% confidence intervals were calculated.<br/><br/>

									<span style={italicBoldText}>Acknowledgement</span><br/>
									Statistical approaches used by Abbott et al at Epiforecasts have been used to adjust for the reporting delay in Rt estimation. (8).<br/><br/>

									<span style={italicBoldText}>Limitations/Scope for improvement:</span><br/>
									<ol>
									<li>Since we do not know the true number of infections (irrespective of detection), Rt calculation is based on reported cases. The
									estimated Rt is unaffected if the ascertainment rate (percent of true infections that are detected) remains fairly constant across
									time. Any fluctuations in ascertainment due to testing coverage variation will affect the Rt estimates until such time that the
									ascertainment stabilises at the new level.</li>
									<li>Any government in India does not report the symptom onset dates currently, so a true epicurve can not be made. We have used the
									best available data from India to project the probability distribution of the delay from symptom onset to confirmation, however this
									delay can be vastly different for various areas, especially where there is a backlog of tests prolonging it. Putting this data in
									public domain even in a limited manner will greatly increase the accuracy of Rt estimation over time and better guide public health
									policy.</li>
									<li>Changes in the assumed serial interval affects the estimated Rt. Lack of a local serial interval estimate will impact the accuracy.
									Also, serial interval changes over the course of the epidemic (shortens near the peak and due to impact of control measures) which
									we do not take into account. Again, data from contact tracing programs can address all these challenges in real-time.</li>
									</ol> <br/>

									<span style={italicBoldText}>Update frequency and last available date:</span><br/>
									Case data is pulled daily from covid19india.org and Rt estimated daily. However as stated above, Rt can only be estimated upto 3-5
									days before the estimation date.<br/><br/>
									</div>
								</Card.Text>
							</Card.Body>

							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Mobility</strong></Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>The data for mobility is sourced from Google Community mobility Reports. Detailed documentation is available
									<a href="https://support.google.com/covid19-mobility?hl=en#topic=9822927" target="_blank"> here. </a>
									Google mobility data shows how visits and length of stay at different places change compared to a baseline (changes for each day are
									compared to a baseline value for the corresponding day of the week, during the 5-week period Jan 3 to Feb 6, 2020). Google calculates
									these changes using aggregated and anonymized location data. </div><br/>
									<div className={tableClass}>
									<Table striped bordered hover>
									  <thead>
									    <tr>
									      <th>Mobility Index</th>
									      <th>Places covered under the index</th>
									    </tr>
									  </thead>
									  <tbody>
									    <tr>
									      <td>Grocery & pharmacy</td>
									      <td>Grocery markets, food warehouses, farmers markets, specialty food shops, drug stores, and pharmacies.</td>
									    </tr>
									    <tr>
									      <td>Parks</td>
									      <td>Local parks, national parks, public beaches, marinas, dog parks, plazas, and public gardens.</td>
									    </tr>
									    <tr>
									      <td>Transit stations</td>
									      <td>Public transport hubs such as subway, bus, and train stations</td>
									    </tr>
										<tr>
									      <td>Retail & recreation</td>
									      <td>Restaurants, cafes, shopping centers, theme parks, museums, libraries, and movie theaters.</td>
									    </tr>
										<tr>
									      <td>Residential</td>
									      <td>Places of residence.</td>
									    </tr>
										<tr>
									      <td>Workplaces</td>
									      <td>Places of work.</td>
									    </tr>
										<tr>
									      <td>Average Mobility</td>
									      <td>Includes all above domains except parks and residential.</td>
									    </tr>
									  </tbody>
									</Table>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Text className="top-text-body">
									<div style={normalText}><b>Calculating Average Mobility from the data</b><br/>
									We calculate the Average Mobility by aggregating data for <span style={italicText}>Grocery and pharmacy, Transit stations,
									Workplaces, and Retail and recreation</span>. We do not include <span style={italicText}>Parks</span> because mobility in
									parks is highly influenced in short-term by day-to-day weather changes and in long-term by seasonal changes compared to the baseline
									in January. We do not include <span style={italicText}>Residential</span> because the residential category shows a change
									in duration-the other categories measure a change in total visitors , and Google recommends not  comparing the change in residential
									with other categories because they have different units of measurement. We intend to improve the Average Mobility by creating a
									composite metric that best correlates with transmission changes.<br/><br/>

									<b>Smoothening baseline bias for better interpretation</b><br/>
									Since the data shows relative and not absolute mobility change, it is affected by mobility levels at the  baseline. This causes a
									nearer-to-baseline value to appear at weekends as the current weekend mobility does not change much
									<span style={italicText}>relative</span> to pre-lockdown weekends. We smoothen these changes to aid interpretation by
									continuing the last working day value over the weekends. Note that the raw data reflects the statistical truth, but
									the smoothening is done so that only changes due to social distancing are visible. <br/><br/>


									<span style={italicBoldText}>Limitations:</span><br/>
									<ol>
									<li>The data represents a sample of Google's users, and may or may not represent the exact behavior of a wider population.</li>
									<li>Location accuracy and the understanding of categorized places varies from region to region, so Google cautions against using this
									data to compare changes between regions with different characteristics (e.g. rural versus urban areas).</li>
									<li>What data is included in the calculation depends on user settings, connectivity, and whether it meets Google's privacy threshold.
									If the privacy threshold isn't met (when somewhere isn't busy enough to ensure anonymity) Google doesn't show a change for the day.
									As a result, you may encounter empty fields for certain places and dates.</li>
									</ol><br/>

									<span style={italicBoldText}>Update frequency and last available date:</span><br/>
									Google releases mobility data for a particular date after 5-7 days. As soon as data is released, it is updated on our dashboard
									within a day.
									</div><br/>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Positivity Rate (7-day moving average of daily positivity rate)</strong></Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>It is calculated as the number of new COVID+ cases detected in the last 7 days divided by the number of tests done during those 7 days,
									multiplied by 100. This metric shows us the recent trend (last 1 week) of testing adequacy with respect to the local size of epidemic. Further, comparing this metric with
									the Cumulative Positivity Rate tells us how the state is doing at testing recently as compared to its baseline performance
									since the epidemic started. It is generally accepted that a region with good testing levels will have a daily positivity rate of less than 5% for atleast 14 days (according to WHO).
									</div><br/>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Cumulative Positivity Rate</strong></Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>It is calculated as the total number of COVID+ till date divided by the total number of tests done till date, multiplied
									by 100. This metric shows us the 'overall' picture of testing adequacy since the epidemic started. Since it takes time for
									recent trends to reflect in Cumulative Positivity Rate, this metric is not a good indicator of recent performance of a state
									in testing.
									</div><br/>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>Corrected CFR</strong></Card.Title>
								<Card.Text className="top-text-body">
									<div style={normalText}>This naive estimate of CFR (Crude CFR) is known to be biased in ongoing outbreaks, primarily due to two factors-
									the delay between time of case confirmation and time of death, and the under-reporting of cases due to limitations in
									testing coverage. The Corrected CFR presented here corrects for the first bias, by adjusting the denominator to reflect
									the number of cases where death would have been reported if it had occurred, based on known estimates of delay from
									confirmation to death. The variation in Corrected CFR across states would then reflect the degree of under-reporting
									or testing adequacy in a particular state (with certain limitations). This approach has been used by Russel et al. (9)
									<br/><br/>

									<b>Adjusting for delay from confirmation to death </b><br/>
									To adjust for the lag from case confirmation to death in the calculation of CFR, we sampled lags from a log-normal
									distribution and shifted each newly confirmed case forward by the sampled lag to estimate the number of cases that have
									reached an outcome on any given date CasesClosed(t). By sampling from the distribution of parameters of lag
									[Mean 13.0 days (95% CI 8.7-20.9) and SD 12.7 days (95% CI 6.4-26.0)], 100 bootstrapped datasets were produced for
									CasesClosed(t). (10) For each dataset,<br/>

									<img src={Equation} className={window.innerWidth > '1000' ? "" : "equation"}/>

									<br/><br/>

									<span style={italicBoldText}>Limitations:</span><br/>
									<ol>
									<li>In addition to testing variation, the variation of Corrected CFR across states would also depend on other factors
									like age structure, comorbidity prevalence, and healthcare efficacy and overload status of various states. In states facing
									severe healthcare capacity overload, the corrected CFR should be interpreted as a testing indicator with extreme caution. </li>
									<li>The Corrected CFR may be overestimated in early stages of the epidemic in an area since the lack of cases in the denominator
									is exacerbated by the lag correction.</li>
									</ol><br/>
									</div>
								</Card.Text>
							</Card.Body>
							<Card.Body>
								<Card.Title className="top-text-title" style={headingText}><strong>References</strong></Card.Title>
								<Card.Text>
									<div style={citationsText}>
									<ol>
									<li>Gupta M, Mohanta SS, Rao A, Parameswaran GG, Agarwal M, Arora M, et al. Transmission dynamics of the COVID-19 epidemic in India and modelling optimal lockdown exit strategies. medRxiv. 2020 May 22;2020.05.13.20096826.</li>
									<li>Cori A, Ferguson NM, Fraser C, Cauchemez S. A New Framework and Software to Estimate Time-Varying Reproduction Numbers During Epidemics. Am J Epidemiol. 2013 Nov 1;178(9):1505-12.</li>
									<li>Wallinga J, Teunis P. Different Epidemic Curves for Severe Acute Respiratory Syndrome Reveal Similar Impacts of Control Measures. Am J Epidemiol. 2004 Sep 15;160(6):509-16.</li>
									<li>Du Z, Xu X, Wu Y, Wang L, Cowling BJ, Meyers LA. Early Release - Serial Interval of COVID-19 among Publicly Reported Confirmed Cases - Volume 26, Number 6-June 2020 - Emerging Infectious Diseases journal - CDC. [cited 2020 Apr 21]; Available from: https://wwwnc.cdc.gov/eid/article/26/6/20-0357_article</li>
									<li>Tindale L, Coombe M, Stockdale JE, Garlock E, Lau WYV, Saraswat M, et al. Transmission interval estimates suggest pre-symptomatic spread of COVID-19. medRxiv. 2020 Mar 6;2020.03.03.20029983</li>
									<li>Zhao S, Gao D, Zhuang Z, Chong M, Cai Y, Ran J, et al. Estimating the serial interval of the novel coronavirus disease (COVID-19): A statistical analysis using the public data in Hong Kong from January 16 to February 15, 2020. medRxiv. 2020 Feb 25;2020.02.21.20026559.</li>
									<li>Nishiura H, Linton NM, Akhmetzhanov AR. Serial interval of novel coronavirus (COVID-19) infections. Int J Infect Dis. 2020 Apr 1;93:284-6.</li>
									<li>Abbott S, Hellewell J, Thompson RN, Sherratt K, Gibbs HP, Bosse NI, et al. Estimating the time-varying reproduction number of SARS-CoV-2 using national and subnational case counts. Wellcome Open Res. 2020 Jun 1;5:112.</li>
									<li>Russell TW, Hellewell J, Abbott S, Golding N, Gibbs H, Jarvis CI. Using a delay-adjusted case fatality ratio to estimate under-reporting [Internet]. CMMID Repository. 2020 [cited 2020 Apr 28]. Available from: https://cmmid.github.io/topics/covid19/global_cfr_estimates.html</li>
									<li>Linton NM, Kobayashi T, Yang Y, Hayashi K, Akhmetzhanov AR, Jung S, et al. Incubation Period and Other Epidemiological Characteristics of 2019 Novel Coronavirus Infections with Right Truncation: A Statistical Analysis of Publicly Available Case Data. J Clin Med. 2020 Feb;9(2):538.</li>
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