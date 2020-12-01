import React, { Component } from 'react';
import { Card } from 'react-bootstrap';

export default class About extends Component {

	render() {
		const layout = window.innerWidth > '1000' ? "home-text" : "text-pages-layout";
		const normalText = window.innerWidth > '1000' ? {} : { fontSize: "smaller" };
		const normalAlignedText = window.innerWidth > '1000' ? { textAlign: "left" } : { textAlign: "left", fontSize: "smaller" };
		const headingText = window.innerWidth > '1000' ? { fontWeight: "bolder", textAlign: "center" } : { fontWeight: "bolder", fontSize: "medium", textAlign: "center" };
		return (
			<div>
				<div className="sub-header-row mt-4">
					<span className="header-bar-text">ABOUT US</span>
				</div>
				<div className={layout}>
					<Card>
						<Card.Body>
							<Card.Title className="top-text-title" style={headingText}><strong>The Covid Today Team at iCART</strong></Card.Title>
							<Card.Text className="titillium">
								<div style={normalAlignedText}>The Covid Today Dashboard was envisaged to fill the gap between reporting raw case numbers
									and what that data actually means. The purpose is to analyse and present the data in a meaningful way that enables citizens,
									leaders, researchers and journalists to have a more insightful grasp of the local situation and respond accordingly. We intend
									to provide a one-stop dashboard where outbreak indicators are calculated with reliable scientific methods, and are updated and
									visualised daily to track each state’s progress in the epidemic.<br/><br/>

									<b>Dr Mohak Gupta, MBBS, AIIMS Delhi</b><br/>
									<i>Interests: Technology and Data-driven Solutions in Healthcare</i><br /><br/>

									<b>Saptarshi Mohanta (Rishi), BS-MS, IISER Pune</b><br/>
									<i>Interests: Computational Modelling of Biological Systems, Statistics and Data Science</i><br/><br/>

									<b>Pratik Mandlecha, B.Tech CSE, IIIT Hyderabad. Data & Applied Scientist at Microsoft</b> <br/>
									<i>Interests: Machine Learning , Deep Learning, Data Applications and  Analytics</i><br/><br/>

									<b>Aditya Garg, B.Tech CSE, VIT Vellore. Software Developer at Barclays</b><br/>
									<i>Interests: Content Creation, Web and Game Development, Playing Music</i><br/><br/>

									<b>Technical Consulting and IT Support: </b> <br/>
											&nbsp;&nbsp;&nbsp;<b>Siddharth Jain, Integrated B.Tech-MBA, IIIT Gwalior</b><br/>
											&nbsp;&nbsp;&nbsp;<i>Interests: Data Analysis, Machine Learning</i><br/><br/>

											&nbsp;&nbsp;&nbsp;<b>Apurva Thakker, B.Tech CSE, BFCET Bathinda</b> <br/>
											&nbsp;&nbsp;&nbsp;<i>Interests: Solving Problems through Technology, Creating & Designing Music</i><br/><br/>

											&nbsp;&nbsp;&nbsp;<b>Abhinav Gupta, CA Inter, B.Com</b><br/>
											&nbsp;&nbsp;&nbsp;<i>Interests: Simplifying Complex Structures with Technology to Make Robust and Cost Effective Systems</i><br/><br/>

									<b>Devarsh Patel, BS-MS, IISER Pune</b><br/>
									<i>Interests : Machine Learning, Deep Learning, Data Analysis, Data Engineering</i><br/><br/>

									</div>
								</Card.Text>
							</Card.Body>


				<Card.Body>
					<Card.Title className="top-text-title" style={headingText}><div><strong>Expert Advisory Panel</strong></div></Card.Title>
					<Card.Text className="top-text-body">
						<div style={normalText}>
										
							<b>Dr Giridhara R Babu
							<br/>Professor & Head, Life Course Epidemiology at Public Health Foundation of India (PHFI).
							Wellcome Trust DBT India Alliance Fellow. Member of the Technical Advisory Committee to the Karnataka Government on COVID-19.</b>
							<br/>He graduated as a medical doctor from Kastruba Medical College Manipal, and joined the Center for Community Medicine at the All India Institute of
							Medical Sciences (AIIMS) New Delhi as a Junior Resident. He completed his Masters in public Health (MPH) and PhD from University of California
							Los Angeles (UCLA), USA. Giridhara has over 60 papers published in national and international high impact journals. He has provided consultation
							to State, National and WHO committees on various public health matters.<a href="https://www.indiaalliance.org/fellow/giridhara-r-babu"> Know more.</a>
							<br/><br/>
							
							<b>Prof. Vinod Chandra Menon
							<br/>Founder Member, National Disaster Management Authority (NDMA)</b>
							<br/>A founding member of NDMA with the Government of India, he held a Union Minister of State designation in Government of India from 2005 to 2010 and 
							has over 34 years working experience. He has worked in Government of Maharashtra, UNICEF India Country Office in charge of Emergency Preparedness and 
							Response and has been a Member of the High Power Committee (HPC) on disaster management plans set up by GoI in 1999 and is currently a member of the 
							Peer Committee on Technological Preparedness for National Disruptions set up by the Indian National Academy of Engineering. He is on the governing 
							boards of several organizations.<a href="https://in.linkedin.com/in/vinod-menon-a05b5050"> Know more.</a> 
							<br/><br/>

							<b>Dr Habib Hasan Farooqui
							<br/>Faculty at Indian Institute of Public Health Delhi, Public Health Foundation of India (PHFI)</b>
							<br/>He is currently serving as member of Vaccine Centre at London School of Hygiene and Tropical Medicine,
							BactiVac Network at University of Birmingham, Surveillance and Epidemiology of Drug Resistant
							Infections (SEDRIC) Consortium at Wellcome Trust, and is the lead faculty on Pharmaceutical
							Economics and Infectious Disease Epidemiology at Indian Institute of Public Health – Delhi.
							He has received training as Post Doctoral Fellow (Economic Evaluation) at the London School
							of Hygiene and Tropical Medicine.<a href="https://www.phfi.org/member/habib-hasan-farooqui/"> Know more.</a>
							<br/><br/>

							<b>Dr Archisman Mohapatra
							<br/>Executive Director at GRID Council (Generating Research Insights for Development)</b>
							<br/>An epidemiologist and social scientist, Dr Mohapatra, is currently coordinating a Pan-India network
							of 85 public health experts (GRID COVID-19 Study Group). Dr Mohapatra has been intensely involved in
							several research projects that have translated into national policy (e.g., RBSK, PSBI guidelines,
							National Research Priority Setting Exercise).<a href="https://www.linkedin.com/in/archisman-mohapatra-40a45529/"> Know more.</a>
							<br/><br/>

							<b>Dr Hemant Deepak Shewade
							<br/>Senior Operational Research Fellow, Center for Operational Research, International Union Against Tuberculosis and Lung Disease (The Union)</b>
							<br/>A community physician by training, his current work focuses on conducting and building capacity for
							operational research in low and middle income countries. He is involved as a senior mentor in the
							Structured Operational Research Training IniTiative (SORT IT).<a href="https://www.researchgate.net/profile/Hemant_Shewade2"> Know more.</a>
						</div>
					</Card.Text>
				</Card.Body>

						<Card.Body>
							<Card.Title className="top-text-title" style={headingText}><div><strong>About iCART</strong></div></Card.Title>
							<Card.Text className="top-text-body">
								<div style={normalText}>India COVID Apex Research Team (iCART) is a volunteer research and development group which comprises
									professionals and students from multiple fields. iCART is open to collaboration with any individual or organisation that
									shares our interests and vision. We started as a small group from AIIMS Delhi, and have since grown into a multi-disciplinary
									team of doctors, biomedical researchers, epidemiologists, tech developers and data scientists with the primary focus to act
									as a catalyst for a science driven response to the COVID-19 pandemic. Our team is engaged in clinical and epidemiological
									research at some of the best hospitals in the country. In addition, we have developed a comprehensive digital COVID-19 platform
									spanning across communities, hospitals and laboratories, which is under pilot-testing. You may follow us on <a href="https://twitter.com/icart_india">Twitter </a>
									where we try to engage in meaningful discussions regarding the COVID-19 epidemic with fellow citizens, experts and journalists.<br/><br/>

<b>Dr Giridara G Gopal</b>, PhD Scholar, MD Community Medicine, AIIMS Delhi<br/>
<b>Dr Mohak Gupta</b>, MBBS, AIIMS Delhi<br/>
<b>Aditi Rao</b>, MBBS student, AIIMS Delhi<br/>
<b>Rishika Mohanta</b>, BS-MS, IISER Pune<br/>
<b>Manraj Singh Sra</b>, MBBS student, AIIMS Delhi<br/>
<b>Archisman Mazumder</b>, MBBS student, AIIMS Delhi<br/>
<b>Mehak Arora</b>, MBBS student, AIIMS Delhi<br/>
<b>Amulya Gupta</b>, MBBS student, AIIMS Delhi<br/>
<b>Bhavik Bansal</b>, MBBS student, AIIMS Delhi<br/>
<b>Dr Ayush Lohiya</b>, Assistant Professor, Public Health, Super Specialty Cancer Institute & Hospital, Lucknow<br/>
<b>Dr Priyamadhaba Behera</b>, Assistant Professor , Department of Community Medicine and Family Medicine, AIIMS Bhubaneswar<br/>
<b>Dev Balaji</b>, M.Tech Bioengineering and Medical Nanotechnology, Former researcher at Harvard Medical School and IISc Bangalore<br/>
<b>Devarsh Patel</b>, BS-MS student, IISER Pune<br/>
<b>Tanisha Mittal</b>, Masters student, Health Services Administration, University of Michigan School of Public Health<br/>
<b>Varun Vasudevan</b>, Ph.D. Student, Institute for Computational and Mathematical Engineering, Stanford University<br/><br/><br/>

<b>COVID-19 research from iCART:</b><br/>
1. <a href="https://pubmed.ncbi.nlm.nih.gov/32528664/?from_single_result=SARS-CoV-2+epidemic+in+India%3A+epidemiological+features+and+in+silico+analysis+of+the+effect+of+interventions
">SARS-CoV-2 Epidemic in India: Epidemiological Features and in silico Analysis of the Effect of Interventions</a><br/>
2. <a href="https://doi.org/10.1101/2020.05.13.20096826">Transmission dynamics of the COVID-19 epidemic in India and modelling optimal lockdown exit strategies</a><br/>
3. <a href="https://www.cambridge.org/core/journals/epidemiology-and-infection/article/geographical-variation-in-case-fatality-rate-and-doubling-time-during-the-covid19-pandemic/749A8D9772342198D1B791625B66EA98">
Geographical variation in case fatality rate and doubling time during the COVID-19 pandemic</a><br/><br/><br/>

<i><a href="https://udaan.org/">Udaan</a> is our NGO partner. All iCART collaborators participate in the team’s activities in an individual capacity as volunteers. 
	Their views and opinions under iCART do not necessarily represent the views of their institute or employer.</i><br/><br/>



								</div>
							</Card.Text>
						</Card.Body>

							</Card>
							</div>
						  </div>

		);
	}
}
