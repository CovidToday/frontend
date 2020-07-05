import React, { Component } from 'react';
import ReactGA from 'react-ga';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Line, Chart, Bar } from 'react-chartjs-2';
import { Container, Row, Col, Dropdown, Card, Button, Popover, OverlayTrigger, CardGroup, Accordion, ButtonToolbar } from 'react-bootstrap';
import Header from "./images/header.png"
import Footer from "./images/footer.jpg"
import informationIcon from "./images/information_icon.png";
import PosRateRenderer from './PosRateRenderer.jsx';
import CfrRenderer from './CfrRenderer.jsx';
import RtRenderer from './RtRenderer.jsx';
import CasesRenderer from './CasesRenderer.jsx';
import CumPosRateRenderer from './CumPosRateRenderer.jsx';
import CumCasesRenderer from './CumCasesRenderer.jsx';
import TPMRenderer from './TPMRenderer.jsx';
import Methods from "./Methods.js";
import Contribute from "./Contribute.js";
import About from "./About.js";
import graphIcon from "./images/graphIcon.png";
import tableIcon from "./images/tableIcon.png";
import gitIcon from "./images/github.png";
import twitterIcon from "./images/twitter.png";
import mailIcon from "./images/mail.png";
import feedbackIcon from "./images/feedback.png";

class App extends Component {
	constructor(props) {
		super(props);
		this.textDivRef = React.createRef();
		this.plotsRef = React.createRef();
		this.tableRef = React.createRef();

		this.state = {
			columnDefs: [
				{
					headerName: '', children: [
						{ headerName: "STATES", field: "state", sortable: true, flex: 2, suppressMovable: true, maxWidth: "170", filter: 'agTextColumnFilter' }
					]
				},
				{
					headerName: 'TRANSMISSION', headerTooltip: "These numbers indicate the rate and scale of spread of COVID19 in a state", children: [
						{
							headerName: "RT", field: "rt", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "One infectious person is further infecting this many people on average",
							cellRenderer: 'rtRenderer', comparator: this.numberSort, minWidth: 120, cellStyle: function (params) {
								let style;
								let a = true;
								params.data.rtOld.forEach(rt => {
									if (rt > 1) {
										a = false;
									}
								})
								if (params.data.rtCurrent > 1) {
									style = { backgroundColor: '#fdcbdd' };
								} else if (params.data.rtCurrent <= 1 && a === true) {
									style = { backgroundColor: '#e1fae9' };
								} else if (params.data.rtCurrent <= 1 && a === false) {
									style = { backgroundColor: '#fafae1' };
								}
								return style;
							}
						},
						{
							headerName: "CUMULATIVE CASES", field: "cumCases", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort,
							cellRenderer: 'cumCasesRenderer', filter: 'agNumberColumnFilter', headerTooltip: "Total number of COVID+ cases detected till date"
						},
						{
							headerName: "DAILY CASES", field: "dailyCases", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "Number of COVID+ cases detected per day(averaged over last 7 days)",
							cellRenderer: 'casesRenderer', filter: 'agNumberColumnFilter', comparator: this.numberSort
						}
					]
				},
				{
					headerName: 'TESTING', headerTooltip: "These numbers indicate the amount of testing being done in a state", children: [
						{
							headerName: "POSITIVITY RATE(%)", field: "posRate", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "Percent of tests done per day that came back positive (averaged over last 7 days). Indicates RECENT trend",
							cellRenderer: 'posRateRenderer', comparator: this.numberSort, filter: 'agNumberColumnFilter', cellStyle: function (params) {
								let style;
								const posRateNumber = parseFloat(params.data.posRate);
								if (posRateNumber > 10) {
									style = { backgroundColor: '#fdcbdd' };
								} else if (posRateNumber <= 5) {
									style = { backgroundColor: '#e1fae9' };
								} else if (posRateNumber <= 10 && posRateNumber > 5) {
									style = { backgroundColor: '#fafae1' };
								}
								return style;
							}
						},
						{
							headerName: "CUMULATIVE POSITIVITY RATE(%)", field: "cumPosRate", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort,
							cellRenderer: 'cumPosRateRenderer', filter: 'agNumberColumnFilter', headerTooltip: "Percent of tests done till date that came back positive"
						},
						{
							headerName: "CORRECTED CASE FATALITY RATE(%)", field: "ccfr", sortable: true, flex: 1, suppressMovable: true, filter: 'agNumberColumnFilter', comparator: this.numberSort,
							cellRenderer: 'cfrRenderer', headerTooltip: "Out of every 100 COVID+ cases whose outcome is expected to be known, this many have passed away", cellStyle: function (params) {
								let style;
								if (params.data.ccfr > 10) {
									style = { backgroundColor: '#fdcbdd' };
								} else if (params.data.ccfr <= 5) {
									style = { backgroundColor: '#e1fae9' };
								} else if (params.data.ccfr <= 10 && params.data.ccfr > 5) {
									style = { backgroundColor: '#fafae1' };
								}
								return style;
							}
						},
						{
							headerName: "TESTS PER MILLION", field: "testsPerMil", filter: 'agNumberColumnFilter', sortable: true, flex: 1, suppressMovable: true,
							cellRenderer: 'TPMRenderer', comparator: this.numberSort, headerTooltip: "Number of people tested out of every 1 million people in the state"
						}
					]
				}
			],
			rowData: [],
			pinnedTopRowData: [],
			rtDataFromApi: [],
			cfrDataFromApi: [],
			mobilityDataFromApi: [],
			positivityRateDataFromApi: [],
			nationalDataFromApi: [],
			minRtDataPoint: 0,
			maxRtDataPoint: 0,
			maxCFRPoint: 0,
			lockdownDates: ["25 March", "15 April", "04 May", "18 May", "08 June"],
			lockdownChartText: ['Lockdown 1', 'Lockdown 2', 'Lockdown 3', 'Lockdown 4', 'Unlock 1'],
			graphStartDate: '22 March',
			rtPointGraphData: { datasets: [{ data: [] }], labels: [] },
			cfrGraphData: { datasets: [{ data: [] }], labels: [] },
			mobilityGraphData: { datasets: [{ data: [] }], lables: [] },
			positivityRateGraphData: { datasets: [{ data: [] }], lables: [] },
			dailyCasesGraphData: { datasets: [{ data: [] }], lables: [] },
			dailyTestsGraphData: { datasets: [{ data: [] }], lables: [] },
			selectedState: 'India',
			selectedView: 'Home',
			mobileView: false,
			frameworkComponents: {
				posRateRenderer: PosRateRenderer,
				cfrRenderer: CfrRenderer,
				casesRenderer: CasesRenderer,
				rtRenderer: RtRenderer,
				cumPosRateRenderer: CumPosRateRenderer,
				cumCasesRenderer: CumCasesRenderer,
				TPMRenderer: TPMRenderer
			},
			lastUpdatedTime: ""
		}
	}

	columnDefMobile = [
		{
			headerName: '', children: [
				{ headerName: "STATES", field: "state", sortable: true, suppressMovable: true }
			]
		},
		{
			headerName: 'TRANSMISSION', headerTooltip: "These numbers indicate the rate and scale of spread of COVID19 in a state", children: [
				{
					headerName: "RT", field: "rt", width: 120, sortable: true, suppressMovable: true, headerTooltip: "One infectious person is further infecting this many people on average",
					cellRenderer: 'rtRenderer', comparator: this.numberSort,
					cellStyle: function (params) {
						let style;
						let a = true;
						params.data.rtOld.forEach(rt => {
							if (rt > 1) {
								a = false;
							}
						})
						if (params.data.rtCurrent > 1) {
							style = { backgroundColor: '#fdcbdd', fontSize: "x-small" };
						} else if (params.data.rtCurrent <= 1 && a === true) {
							style = { backgroundColor: '#e1fae9', fontSize: "x-small" };
						} else if (params.data.rtCurrent <= 1 && a === false) {
							style = { backgroundColor: '#fafae1', fontSize: "x-small" };
						}
						return style;
					}
				},
				{
					headerName: "CUMULATIVE CASES", field: "cumCases", width: 100, sortable: true, suppressMovable: true, headerTooltip: "Total number of COVID+ cases detected till date",
					cellRenderer: 'cumCasesRenderer', comparator: this.numberSort, cellStyle: { fontSize: "x-small" }
				},
				{
					headerName: "DAILY CASES", field: "dailyCases", width: 80, sortable: true, suppressMovable: true, headerTooltip: "Number of COVID+ cases detected per day(averaged over last 7 days)",
					cellRenderer: 'casesRenderer', comparator: this.numberSort, cellStyle: { fontSize: "x-small" }
				}
			]
		},
		{
			headerName: 'TESTING', headerTooltip: "These numbers indicate the amount of testing being done in a state", children: [
				{
					headerName: "POSITIVITY RATE(%)", field: "posRate", width: 90, sortable: true, suppressMovable: true, headerTooltip: "Percent of tests done per day that came back positive (averaged over last 7 days). Indicates RECENT trend",
					cellRenderer: 'posRateRenderer', comparator: this.numberSort, cellStyle: function (params) {
						let style;
						const posRateNumber = parseFloat(params.data.posRate);
						if (posRateNumber > 10) {
							style = { backgroundColor: '#fdcbdd', fontSize: "x-small" };
						} else if (posRateNumber <= 5) {
							style = { backgroundColor: '#e1fae9', fontSize: "x-small" };
						} else if (posRateNumber <= 10 && posRateNumber > 5) {
							style = { backgroundColor: '#fafae1', fontSize: "x-small" };
						}
						return style;
					}
				},
				{
					headerName: "CUMULATIVE POSITIVITY RATE(%)", field: "cumPosRate", width: 100, sortable: true, headerTooltip: "Percent of tests done till date that came back positive",
					cellRenderer: 'cumPosRateRenderer', suppressMovable: true, comparator: this.numberSort, cellStyle: { fontSize: "x-small" }
				},
				{
					headerName: "CORRECTED CASE FATALITY RATE(%)", field: "ccfr", width: 100, sortable: true, suppressMovable: true, comparator: this.numberSort,
					cellRenderer: 'cfrRenderer', headerTooltip: "Out of every 100 COVID+ cases whose outcome is expected to be known, this many have passed away", cellStyle: function (params) {
						let style;
						if (params.data.ccfr > 10) {
							style = { backgroundColor: '#fdcbdd', fontSize: "x-small" };
						} else if (params.data.ccfr <= 5) {
							style = { backgroundColor: '#e1fae9', fontSize: "x-small" };
						} else if (params.data.ccfr <= 10 && params.data.ccfr > 5) {
							style = { backgroundColor: '#fafae1', fontSize: "x-small" };
						}
						return style;
					}
				},
				{
					headerName: "TESTS PER MILLION", field: "testsPerMil", width: 90, sortable: true, suppressMovable: true, headerTooltip: "Number of people tested out of every 1 million people in the state",
					cellRenderer: 'TPMRenderer', comparator: this.numberSort, cellStyle: { fontSize: "x-small" }
				}
			]
		}
	];

	componentDidMount() {
		this.setData();
		ReactGA.initialize('UA-168412971-1');
		ReactGA.pageview('covidToday');
		if (window.innerWidth <= '1000') {
			this.setState({ columnDefs: this.columnDefMobile });
			this.setState({ mobileView: true });

		}

	}

	componentWillMount() {
		this.configureVerticalLinesPlugin();
	}



	async setData() {
		await axios.get('https://raw.githubusercontent.com/CovidToday/backend/master/reproduction-number-rt/rt.json')
			.then(response => {
				this.setState({ rtDataFromApi: response.data });
				this.getRtPointGraphData(this.state.rtDataFromApi.IN);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/backend/master/testing-and-cfr/cfr.json')
			.then(response => {
				this.setState({ cfrDataFromApi: response.data });
				this.getCfrGraphData(this.state.cfrDataFromApi.India);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/backend/master/mobility-index/india_mobility_indented.json')
			.then(response => {
				this.setState({ mobilityDataFromApi: response.data });
				this.getMobilityGraphData(this.state.mobilityDataFromApi.India);
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/backend/master/testing-and-cfr/positivity_Rate.json')
			.then(response => {
				this.setState({ positivityRateDataFromApi: response.data });
				this.getPositivityRateGraphData(this.state.positivityRateDataFromApi.India);
				this.getDailyCasesGraphData(this.state.positivityRateDataFromApi.India);
				this.getDailyTestsGraphData(this.state.positivityRateDataFromApi.India);
			});

		const lastUpdated = this.state.positivityRateDataFromApi.datetime;
		const timestamp = lastUpdated ? lastUpdated.split(":", 2).join(":") : "NA";
		this.setState({ lastUpdatedTime: timestamp });

		await axios.get('https://raw.githubusercontent.com/CovidToday/backend/master/testing-and-cfr/national.json')
			.then(response => {
				this.setState({ nationalDataFromApi: response.data });
			});

		this.setRowData();
	}

	numberSort(a, b) {
		const numA = parseFloat(a);
		const numB = parseFloat(b);

		if (numA === null && numB === null) {
			return 0;
		}
		if (numA === NaN && numB === NaN) {
			return 0;
		}
		if (numA === null || numA === NaN) {
			return -1;
		}
		if (numB === null || numB === NaN) {
			return 1;
		}

		return numA - numB;
	}

	configureVerticalLinesPlugin() {
		const verticalLinePlugin = {
			getLinePosition: function (chart, pointIndex) {
				const meta = chart.getDatasetMeta(0); // first dataset is used to discover X coordinate of a point
				const data = meta.data;
				if (data[pointIndex])
					return data[pointIndex]._model.x;
			},
			renderVerticalLine: function (chartInstance, pointIndex, text) {
				const lineLeftOffset = this.getLinePosition(chartInstance, pointIndex);
				const scale = chartInstance.scales['y-axis-0'];
				const context = chartInstance.chart.ctx;

				// render vertical line
				context.beginPath();
				context.strokeStyle = 'rgb(0,64,101,0.3)';
				context.moveTo(lineLeftOffset, scale.top);
				context.lineTo(lineLeftOffset, scale.bottom);
				context.stroke();

				// write label
				context.fillStyle = "#004065";
				context.textAlign = 'left';
				context.font = '11px "Titillium Web"';
				context.fillText(text, lineLeftOffset, scale.top);
			},

			afterDatasetsDraw: function (chart, easing) {
				if (chart.config.plugins) {
					let linesIndex = [];
					chart.config.plugins.verticalLineAtIndex.forEach((pointIndex) => {
						let index = chart.config.data.labels.indexOf(pointIndex);
						linesIndex.push(index);
					});
					linesIndex.forEach((pointIndex, index) => {
						this.renderVerticalLine(chart, pointIndex, chart.config.plugins.lockdownChartText[index]);
					});
				}
			}
		};
		Chart.plugins.register(verticalLinePlugin);
	}

	getName = (key) => {
		let name;
		switch (key) {
			case "IN":
				name = "India";
				break;
			case "ap":
				name = "Andhra Pradesh";
				break;
			case "ar":
				name = "Arunachal Pradesh";
				break;
			case "as":
				name = "Assam";
				break;
			case "br":
				name = "Bihar";
				break;
			case "ct":
				name = "Chhattisgarh";
				break;
			case "ga":
				name = "Goa";
				break;
			case "gj":
				name = "Gujarat";
				break;
			case "hr":
				name = "Haryana";
				break;
			case "hp":
				name = "Himachal Pradesh";
				break;
			case "jh":
				name = "Jharkhand";
				break;
			case "ka":
				name = "Karnataka";
				break;
			case "kl":
				name = "Kerala";
				break;
			case "mp":
				name = "Madhya Pradesh";
				break;
			case "mh":
				name = "Maharashtra";
				break;
			case "mn":
				name = "Manipur";
				break;
			case "ml":
				name = "Meghalaya";
				break;
			case "mz":
				name = "Mizoram";
				break;
			case "nl":
				name = "Nagaland";
				break;
			case "or":
				name = "Odisha";
				break;
			case "pb":
				name = "Punjab";
				break;
			case "rj":
				name = "Rajasthan";
				break;
			case "sk":
				name = "Sikkim";
				break;
			case "tn":
				name = "Tamil Nadu";
				break;
			case "tg":
				name = "Telangana";
				break;
			case "tr":
				name = "Tripura";
				break;
			case "up":
				name = "Uttar Pradesh";
				break;
			case "ut":
				name = "Uttarakhand";
				break;
			case "wb":
				name = "West Bengal";
				break;
			case "an":
				name = "Andaman and Nicobar Islands";
				break;
			case "ch":
				name = "Chandigarh";
				break;
			case "dn":
				name = "Dadra and Nagar Haveli and Daman and Diu";
				break;
			case "dl":
				name = "Delhi";
				break;
			case "jk":
				name = "Jammu and Kashmir";
				break;
			case "la":
				name = "Ladakh";
				break;
			case "ld":
				name = "Lakshadweep";
				break;
			case "py":
				name = "Puducherry";
				break;
		}
		return name;
	}

	setRowData = () => {
		const allstates = [];
		this.state.nationalDataFromApi && this.state.nationalDataFromApi.statewise.forEach(i => {
			allstates.push(i.statecode.toLowerCase());
		});
		const states = allstates.filter(s => s !== "tt" && s !== "un" && s !== "ld");
		const data = [];
		const pinnedData = [];
		if (this.state.rtDataFromApi && this.state.cfrDataFromApi && this.state.nationalDataFromApi && this.state.positivityRateDataFromApi) {
			states && states.forEach(s => {
				const name = this.getName(s);

				//rt
				const rtIndex = this.state.rtDataFromApi[s] ? this.state.rtDataFromApi[s].rt_point.length - 1 : -1;
				const rtPoint = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_point[rtIndex]).toFixed(2) : "NA";
				const rtl95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_l95[rtIndex]).toFixed(2) : "NA";
				const rtu95 = rtIndex > 0 ? (this.state.rtDataFromApi[s].rt_u95[rtIndex]).toFixed(2) : "NA";
				const rtDate = rtIndex > 0 ? (this.state.rtDataFromApi[s].dates[rtIndex]) : "-";
				const rtToCompare = [];
				if (rtIndex > 13) {
					for (let i = rtIndex - 13; i <= rtIndex; i++) {
						rtToCompare.push((this.state.rtDataFromApi[s].rt_point[i]).toFixed(2));
					};
				}
				const rtData = rtPoint === "NA" ? "NA" : `${rtPoint} (${rtl95}-${rtu95})`;

				//cfr
				const cfrIndex = this.state.cfrDataFromApi[name] ? this.state.cfrDataFromApi[name].cfr3_point.length - 1 : -1;
				const cfrPoint = cfrIndex > 0 ? (this.state.cfrDataFromApi[name].cfr3_point[cfrIndex]).toFixed(2) : "NA";
				const cfrPointOld = cfrIndex > 0 ? (this.state.cfrDataFromApi[name].cfr3_point[cfrIndex - 7]).toFixed(2) : "NA";
				const cfrDate = cfrIndex > 0 ? this.state.cfrDataFromApi[name].dates[cfrIndex] : "-";

				//posRate
				const posRateArr = Object.entries(this.state.positivityRateDataFromApi);
				let cumCases;
				let cumCasesDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexCases = data[1].cum_positive_cases.slice().reverse().findIndex(i => i !== "");
						const countCases = data[1].cum_positive_cases.length - 1;
						const cumCasesIndex = indexCases >= 0 ? countCases - indexCases : indexCases;
						const cumulativeCasesFloat = data[1].cum_positive_cases[cumCasesIndex];
						cumCases = cumulativeCasesFloat && cumulativeCasesFloat !== "" ? cumulativeCasesFloat : "-";
						cumCasesDate = data[1].dates[cumCasesIndex];
					}
				});
				let cumulativePosRate;
				let cumPRateDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexCum = data[1].cum_positivity_rate.slice().reverse().findIndex(i => i !== "");
						const countCum = data[1].cum_positivity_rate.length - 1;
						const cumPosRateIndex = indexCum >= 0 ? countCum - indexCum : indexCum;
						const cumulativePosRateFloat = data[1].cum_positivity_rate[cumPosRateIndex];
						cumulativePosRate = cumulativePosRateFloat && cumulativePosRateFloat !== "" ? cumulativePosRateFloat.toFixed(2) : "NA";
						cumPRateDate = data[1].dates[cumPosRateIndex];
					}
				});
				let maCases;
				let maCasesOld;
				let maCasesDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexMACases = data[1].daily_positive_cases_ma.slice().reverse().findIndex(i => i !== "");
						const countMACases = data[1].daily_positive_cases_ma.length - 1;
						const MACasesIndex = indexMACases >= 0 ? countMACases - indexMACases : indexMACases;
						const maCasesFloat = data[1].daily_positive_cases_ma[MACasesIndex];
						const maCasesFloatOld = data[1].daily_positive_cases_ma[MACasesIndex - 7];
						maCases = maCasesFloat && maCasesFloat !== "" ? Math.floor(maCasesFloat) : "NA";
						maCasesOld = maCasesFloatOld && maCasesFloatOld !== "" ? Math.floor(maCasesFloatOld) : "NA";
						maCasesDate = data[1].dates[MACasesIndex];
					}
				});
				let maPosRate;
				let maPosRateOld;
				let posRateDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexPosRateMa = data[1].daily_positivity_rate_ma.slice().reverse().findIndex(i => i !== "");
						const countPosRateMa = data[1].daily_positivity_rate_ma.length - 1;
						const posRateMaIndex = indexPosRateMa >= 0 ? countPosRateMa - indexPosRateMa : indexPosRateMa;
						const maPosRateFloat = (data[1].daily_positivity_rate_ma[posRateMaIndex]);
						maPosRate = maPosRateFloat && maPosRateFloat !== "" ? (maPosRateFloat).toFixed(2) : "NA";
						const maPosRateFloatOld = (data[1].daily_positivity_rate_ma[posRateMaIndex - 7]);
						maPosRateOld = maPosRateFloatOld && maPosRateFloatOld !== "" ? (maPosRateFloatOld).toFixed(2) : "NA";
						posRateDate = data[1].dates[posRateMaIndex];
					}
				});
				let tpm;
				let tpmDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexTpm = data[1].test_per_million.slice().reverse().findIndex(i => i !== "");
						const countTpm = data[1].test_per_million.length - 1;
						const tpmIndex = indexTpm >= 0 ? countTpm - indexTpm : indexTpm;
						const tpmFloat = (data[1].test_per_million[tpmIndex]);
						tpm = tpmFloat && tpmFloat !== "" ? Math.floor(tpmFloat) : "-";
						tpmDate = data[1].dates[tpmIndex];
					}
				});


				data.push({
					key: s, state: name, rt: rtData, cumCases: cumCases, dailyCases: maCases, posRate: maPosRate, cumPosRate: cumulativePosRate,
					ccfr: cfrPoint, rtCurrent: rtPoint, rtOld: rtToCompare, dailyCasesOld: maCasesOld, posRateOld: maPosRateOld, cfrOld: cfrPointOld,
					rtDate: rtDate, cumCasesDate: cumCasesDate, maCasesDate: maCasesDate, posRateDate: posRateDate, cumPRateDate: cumPRateDate, cfrDate: cfrDate,
					testsPerMil: tpm, tpmDate: tpmDate
				});
			});
			data.sort(function (a, b) {
				const aNum = parseInt(a.cumCases);
				const bNum = parseInt(b.cumCases);
				return (aNum < bNum) ? 1 : -1
			});
			this.setState({ rowData: data })
		}

		const rtIndexInd = this.state.rtDataFromApi["IN"].rt_point.length - 1;
		const rtPointInd = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].rt_point[rtIndexInd]).toFixed(2) : "NA";
		const rtl95Ind = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].rt_l95[rtIndexInd]).toFixed(2) : "NA";
		const rtu95Ind = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].rt_u95[rtIndexInd]).toFixed(2) : "NA";
		const rtDate = rtIndexInd > 0 ? (this.state.rtDataFromApi["IN"].dates[rtIndexInd]) : "-";
		const rtToCompareInd = [];
		if (rtIndexInd > 13) {
			for (let i = rtIndexInd - 13; i <= rtIndexInd; i++) {
				rtToCompareInd.push((this.state.rtDataFromApi["IN"].rt_point[i]).toFixed(2));
			};
		}
		const rtDataInd = `${rtPointInd} (${rtl95Ind}-${rtu95Ind})`

		const cfrIndexInd = this.state.cfrDataFromApi["India"].cfr3_point.length - 1;
		const cfrPointInd = cfrIndexInd > 0 ? (this.state.cfrDataFromApi["India"].cfr3_point[cfrIndexInd]).toFixed(2) : "NA";
		const cfrDate = cfrIndexInd > 0 ? this.state.cfrDataFromApi["India"].dates[cfrIndexInd] : "-";
		const cfrPointOld = cfrIndexInd > 0 ? (this.state.cfrDataFromApi["India"].cfr3_point[cfrIndexInd - 7]).toFixed(2) : "NA";

		const posRateArrInd = this.state.positivityRateDataFromApi.India;

		const cumConfirmedIndIndex = posRateArrInd.cum_positive_cases.slice().reverse().findIndex(i => i !== "");
		const cumConfirmedIndCount = posRateArrInd.cum_positive_cases.length - 1;
		const resultIndex = cumConfirmedIndIndex >= 0 ? cumConfirmedIndCount - cumConfirmedIndIndex : cumConfirmedIndIndex;
		const cumCasesInd = (posRateArrInd.cum_positive_cases[resultIndex]);
		const cumCasesIndDate = posRateArrInd.dates[resultIndex];

		const indexInd = posRateArrInd.cum_positivity_rate.slice().reverse().findIndex(i => i !== "");
		const countInd = posRateArrInd.cum_positivity_rate.length - 1;
		const posRateIndexInd = indexInd >= 0 ? countInd - indexInd : indexInd;
		const cumulativePosRateInd = (posRateArrInd.cum_positivity_rate[posRateIndexInd]).toFixed(2);
		const cumPRDateInd = posRateArrInd.dates[posRateIndexInd];

		const indexIndPosRateMa = posRateArrInd.daily_positivity_rate_ma.slice().reverse().findIndex(i => i !== "");
		const countIndPosRateMa = posRateArrInd.daily_positivity_rate_ma.length - 1;
		const posRateMaIndexInd = indexIndPosRateMa >= 0 ? countIndPosRateMa - indexIndPosRateMa : indexIndPosRateMa;
		const PosRateMaInd = (posRateArrInd.daily_positivity_rate_ma[posRateMaIndexInd]).toFixed(2);
		const PosRateMaIndOld = (posRateArrInd.daily_positivity_rate_ma[posRateMaIndexInd - 7]).toFixed(2);
		const posRateDateInd = posRateArrInd.dates[posRateMaIndexInd];

		const indexIndcasesMa = posRateArrInd.daily_positive_cases_ma.slice().reverse().findIndex(i => i !== "");
		const countIndcasesMa = posRateArrInd.daily_positive_cases_ma.length - 1;
		const casesMaIndexInd = indexIndcasesMa >= 0 ? countIndcasesMa - indexIndcasesMa : indexIndcasesMa;
		const casesMaInd = Math.floor(posRateArrInd.daily_positive_cases_ma[casesMaIndexInd]);
		const casesMaIndOld = Math.floor(posRateArrInd.daily_positive_cases_ma[casesMaIndexInd - 7]);
		const maCasesIndDate = posRateArrInd.dates[casesMaIndexInd];

		const indexIndTpm = posRateArrInd.test_per_million.slice().reverse().findIndex(i => i !== "");
		const countIndTpm = posRateArrInd.test_per_million.length - 1;
		const tpmIndexInd = indexIndTpm >= 0 ? countIndTpm - indexIndTpm : indexIndTpm;
		const tpmInd = Math.floor(posRateArrInd.test_per_million[tpmIndexInd]);
		const tpmIndDate = posRateArrInd.dates[tpmIndexInd];

		pinnedData.push({
			key: "IN", state: "India", rt: rtDataInd, cumCases: cumCasesInd, dailyCases: casesMaInd, posRate: PosRateMaInd, cumPosRate: cumulativePosRateInd,
			ccfr: cfrPointInd, rtCurrent: rtPointInd, rtOld: rtToCompareInd, rtDate: rtDate, cfrDate: cfrDate, cfrOld: cfrPointOld, dailyCasesOld: casesMaIndOld,
			posRateOld: PosRateMaIndOld, cumCasesDate: cumCasesIndDate, maCasesDate: maCasesIndDate, posRateDate: posRateDateInd, cumPRateDate: cumPRDateInd,
			testsPerMil: tpmInd, tpmDate: tpmIndDate
		})
		this.setState({ pinnedTopRowData: pinnedData })
	}

	getDailyCasesGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);



			// Main data
			let mainData = [{
				label: 'Daily Cases',
				data: dataFromApi.daily_positive_cases.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#004065',
				radius: 1,
			}, {
				type: 'line',
				label: 'Daily Cases Moving Average',
				data: dataFromApi.daily_positive_cases_ma.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#004065',
				radius: 1,
				fill: false
			}];
			data.datasets.push(...mainData);
			this.setState({
				dailyCasesGraphData: data,
			});
		}
	}
	getDailyTestsGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);



			// Main data
			let mainData = [{
				label: 'Daily Tests',
				data: dataFromApi.daily_tests.slice(dateIndex, dataFromApi.dates.length),
				// borderColor: '#004065',
				backgroundColor: 'rgba(225, 105, 126,0.4)',
				radius: 1,
				fill: false,
			},];
			data.datasets.push(...mainData);
			this.setState({
				dailyTestsGraphData: data,
			});
		}
	}

	getRtPointGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);

			// let maxRtDataPoint = Math.ceil(Math.max(...dataFromApi.rt_u95.slice(dateIndex, dataFromApi.dates.length)));
			// maxRtDataPoint = Math.min(maxRtDataPoint,2.5);
			let minRtDataPoint = Math.floor(Math.min(...dataFromApi.rt_l95.slice(dateIndex, dataFromApi.dates.length)));
			minRtDataPoint = Math.min(minRtDataPoint, 0.5);

			//Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < data.labels.length; i++) {
				horizontalLineData.push(1);
			}
			data.datasets.push({
				label: 'fixed value',
				data: horizontalLineData,
				borderColor: 'rgba(0,100,0,0.5)',
				borderWidth: 2,
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});

			//The vertical lines data logic
			// let verticalLineData = [];
			// const lockdownDates = this.state.lockdownDates;
			// for (let j = 0; j < lockdownDates.length; j++) {
			// 	let obj = {
			// 		//type: 'line',
			// 		label: 'Lockdown ' + (j + 1),
			// 		backgroundColor: 'red',
			// 		borderColor: 'red',
			// 		radius: 0,
			// 		hoverRadius: 0,
			// 		data: []
			// 	};
			// 	for (let i = minRtDataPoint; i <= maxRtDataPoint; i++) {
			// 		obj.data.push({
			// 			x: lockdownDates[j],
			// 			y: i
			// 		});
			// 	}
			// 	verticalLineData.push(obj);
			// }
			// data.datasets.push(...verticalLineData);

			// Main data
			let mainData = [{
				label: 'Rt l95',
				data: dataFromApi.rt_l95.slice(dateIndex, dataFromApi.dates.length),
				fill: '2',// + (verticalLineData.length + 2),
				backgroundColor: '#d3efff',
				borderWidth: 1,
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt l50',
				data: dataFromApi.rt_l50.slice(dateIndex, dataFromApi.dates.length),
				fill: '1',// + (verticalLineData.length + 3),
				backgroundColor: '#558aaf',
				borderWidth: 1,
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt',
				data: dataFromApi.rt_point.slice(dateIndex, dataFromApi.dates.length),
				radius: 1,
				borderColor: '#004065',
				fill: false
			}, {
				label: 'Rt u50',
				data: dataFromApi.rt_u50.slice(dateIndex, dataFromApi.dates.length),
				fill: '-2',
				backgroundColor: '#558aaf',
				borderWidth: 1,
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'Rt u95',
				data: dataFromApi.rt_u95.slice(dateIndex, dataFromApi.dates.length),
				fill: '-4',
				backgroundColor: '#d3efff',
				borderWidth: 1,
				radius: 0,
				hoverRadius: 0,
			}];
			data.datasets.push(...mainData);
			this.setState({
				rtPointGraphData: data,
				// maxRtDataPoint: maxRtDataPoint,
				minRtDataPoint: minRtDataPoint,
			}, this.RtChartRender);
		}
	}

	getCfrGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);

			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);

			let maxCFRPoint = Math.ceil(Math.max(...dataFromApi.cfr3_point.slice(dateIndex, dataFromApi.dates.length)));
			maxCFRPoint = Math.max(maxCFRPoint, 10);
			maxCFRPoint = Math.min(maxCFRPoint, 20);

			// Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < data.labels.length; i++) {
				horizontalLineData.push(10);
			}
			data.datasets.push({
				label: 'upper limit',
				data: horizontalLineData,
				borderColor: 'rgba(255,0,0,0.5)',
				borderWidth: 2,
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			horizontalLineData = [];
			for (let i = 0; i < data.labels.length; i++) {
				horizontalLineData.push(5);
			}
			data.datasets.push({
				label: 'lower limit',
				data: horizontalLineData,
				borderColor: 'rgba(0,100,0,0.5)',
				borderWidth: 2,
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			const cfrDataSet = dataFromApi.cfr3_point.slice();

			// Main data
			let mainData = [{
				label: 'CFR',
				data: cfrDataSet.slice(dateIndex, cfrDataSet.length),
				borderColor: '#004065',
				radius: 1,
				fill: false
			},];
			data.datasets.push(...mainData);
			this.setState({
				cfrGraphData: data,
				maxCFRPoint: maxCFRPoint
			});
		}
	}
	getMobilityGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);

			// Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < data.labels.length; i++) {
				horizontalLineData.push(0);
			}
			data.datasets.push({
				label: 'fixed',
				data: horizontalLineData,
				borderColor: 'rgba(72,72,72,0.5)',
				borderWidth: 2,
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});

			// Main data
			let mainData = [{
				label: 'Mobility Average',
				data: dataFromApi.average_mobility.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#004065',
				radius: 1,
				fill: false
			}, {
				label: 'Grocery and Pharmacy',
				data: dataFromApi.grocery.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#454c80',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Parks',
				data: dataFromApi.parks.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#7f548f',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Residential',
				data: dataFromApi.residential.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#b65b8d',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Retail and Recreation',
				data: dataFromApi.retail.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#e1697e',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Transit Stations',
				data: dataFromApi.transit.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#fa8467',
				borderWidth: 1,
				radius: 0,
				fill: false
			}, {
				label: 'Workplace',
				data: dataFromApi.workplace.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#ffaa52',
				borderWidth: 1,
				radius: 0,
				fill: false
			}];
			data.datasets.push(...mainData);
			this.setState({
				mobilityGraphData: data,
			});
		}
	}

	getPositivityRateGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);

			// Horizontal line
			let horizontalLineData = [];
			for (let i = 0; i < data.labels.length; i++) {
				horizontalLineData.push(10);
			}
			data.datasets.push({
				label: 'upper limit',
				data: horizontalLineData,
				borderColor: 'rgba(255,0,0,0.5)',
				borderWidth: 2,
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			horizontalLineData = [];
			for (let i = 0; i < data.labels.length; i++) {
				horizontalLineData.push(5);
			}
			data.datasets.push({
				label: 'lower limit',
				data: horizontalLineData,
				borderColor: 'rgba(0,100,0,0.5)',
				borderWidth: 2,
				fill: false,
				radius: 0,
				hoverRadius: 0,
			});
			const positivityRateDataSet = dataFromApi.daily_positivity_rate_ma.slice();

			// Main data
			let mainData = [{
				label: 'Positivity Rate',
				data: positivityRateDataSet.slice(dateIndex, positivityRateDataSet.length),
				borderColor: '#004065',
				radius: 1,
				fill: false
			},];
			data.datasets.push(...mainData);
			this.setState({
				positivityRateGraphData: data,
			});
		}
	}

	onSelectionChanged = (data) => {
		const selectedRows = data.api.getSelectedRows();
		const selectedState = selectedRows[0].key;
		const state = this.getName(selectedState);
		this.getRtPointGraphData(this.state.rtDataFromApi[selectedState]);
		this.getCfrGraphData(this.state.cfrDataFromApi[state]);
		this.getMobilityGraphData(this.state.mobilityDataFromApi[state]);
		this.getPositivityRateGraphData(this.state.positivityRateDataFromApi[state]);
		this.getDailyCasesGraphData(this.state.positivityRateDataFromApi[state]);
		this.getDailyTestsGraphData(this.state.positivityRateDataFromApi[state]);
		this.setState({ selectedState: state });
	}

	onStateSelect(key) {
		const stateName = this.getName(key);
		this.setState({ selectedState: stateName });
		this.getRtPointGraphData(this.state.rtDataFromApi[key]);
		this.getMobilityGraphData(this.state.mobilityDataFromApi[stateName]);
		this.getPositivityRateGraphData(this.state.positivityRateDataFromApi[stateName]);
		this.getCfrGraphData(this.state.cfrDataFromApi[stateName]);
		this.getDailyCasesGraphData(this.state.positivityRateDataFromApi[stateName]);
		this.getDailyTestsGraphData(this.state.positivityRateDataFromApi[stateName]);
	}

	DropdownRenderer = () => {
		const fontSize = this.state.mobileView ? "x-small" : "inherit";

		return <div className="sub-header-row sticky-top">
			{!this.state.mobileView && <span className="header-bar-text"> </span>}
			<span className="header-bar-text" style={{ fontSize: fontSize }}>Last Updated -{this.state.mobileView && <br />} {this.state.lastUpdatedTime}</span>
			<span className="header-bar-dropdown">
				<Dropdown>
					<Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-state">
						{this.state.selectedState}
					</Dropdown.Toggle>

					<Dropdown.Menu className="dropdown-state-list">
						<Dropdown.Item onSelect={() => this.onStateSelect("IN")}>India</Dropdown.Item>
						{this.state.rowData && this.state.rowData.map((item) => {
							return <Dropdown.Item onSelect={() => this.onStateSelect(item.key)}>{this.getName(item.key)}</Dropdown.Item>
						})}
					</Dropdown.Menu>
				</Dropdown>
			</span>
			<span className="header-bar-text">
				<img src={graphIcon} className="quicklink-icon" onClick={() => this.scrollToPlots()} />
				<span style={{ marginRight: "15px" }}> </span>
				<img src={tableIcon} className="quicklink-icon" onClick={() => this.scrollToTable()} /></span>
			{!this.state.mobileView && <span className="header-bar-text"> </span>}
		</div>
	}

	DailyCasesChartRender = () => {
		const { dailyCasesGraphData, lockdownDates, lockdownChartText } = this.state;
		return <Bar
			data={dailyCasesGraphData}
			height={300}
			plugins={{
				verticalLineAtIndex: lockdownDates,
				lockdownChartText: lockdownChartText,
			}}
			options={{
				maintainAspectRatio: false,
				legend: {
					display: false,
					labels: {
						boxWidth: 20,
						fontFamily: 'Titillium Web',
						// filter: function (item, chart) {
						// 	if (item.text) {
						// 		return !item.text.includes('fixed');
						// 	}
						// },
					},
					position: 'bottom',
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					callbacks: {
						label: function (tooltipItem, data) {
							var label = data.datasets[tooltipItem.datasetIndex].label || '';

							if (label) {
								label += ': ';
							}
							label += Math.trunc(tooltipItem.yLabel);
							return label;
						}
					}
				},
				hover: {
					mode: 'index',
					intersect: false,
					animationDuration: 200,
					onHover: function (event, chart) {
					},
				},
				layout: {
					padding: {
						top: 21,
					}
				},
				title: {
					display: false,
				},
				scales: {
					yAxes: [{
						display: true,
					}],
					xAxes: [{
						gridLines: {
							display: false,
						},
						ticks: {
							type: 'time',
							maxTicksLimit: 6,
							autoSkip: true,
							minRotation: 0,
							maxRotation: 0.
						},
					}],
				},
			}}
		/>
	}

	DailyTestsChartRender = () => {
		const { dailyTestsGraphData, lockdownDates, lockdownChartText } = this.state;
		return <Bar
			data={dailyTestsGraphData}
			height={300}
			plugins={{
				verticalLineAtIndex: lockdownDates,
				lockdownChartText: lockdownChartText,
			}}
			options={{
				maintainAspectRatio: false,
				legend: {
					display: false,
					labels: {
						boxWidth: 20,
						fontFamily: 'Titillium Web',
						// filter: function (item, chart) {
						// 	if (item.text) {
						// 		return !item.text.includes('fixed');
						// 	}
						// },
					},
					position: 'bottom',
				},
				tooltips: {
					mode: 'index',
					intersect: false,
				},
				hover: {
					mode: 'index',
					intersect: false,
					animationDuration: 200,
					onHover: function (event, chart) {
					},
				},
				layout: {
					padding: {
						top: 21,
					}
				},
				title: {
					display: false,
				},
				scales: {
					yAxes: [{
						display: true,
					}],
					xAxes: [{
						gridLines: {
							display: false,
						},
						ticks: {
							type: 'time',
							maxTicksLimit: 6,
							autoSkip: true,
							minRotation: 0,
							maxRotation: 0.
						},
					}],
				},
			}}
		/>
	}

	RtChartRender = () => {
		const { minRtDataPoint, maxRtDataPoint, rtPointGraphData, lockdownDates, lockdownChartText } = this.state;
		return <Line
			data={rtPointGraphData}
			height={300}
			plugins={{
				verticalLineAtIndex: lockdownDates,
				lockdownChartText: lockdownChartText,
			}}
			options={{
				maintainAspectRatio: false,
				legend: {
					display: false,
					// labels: {
					// 	filter: function (item, chart) {
					// 		return item.text.includes('Lockdown');
					// 	}
					// }
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					filter: function (tooltipItem) {
						return tooltipItem.datasetIndex === 3;
					},
					callbacks: {
						label: function (tooltipItem, data) {
							var label = data.datasets[tooltipItem.datasetIndex].label || '';

							if (label) {
								label += ': ';
							}
							label += tooltipItem.yLabel.toFixed(2);
							return label;
						}
					}
				},
				hover: {
					mode: 'index',
					intersect: false,
					animationDuration: 200,
					onHover: function (event, chart) {
						//chart[0]._chart.tooltip._view.opacity = 1;
					},
				},
				layout: {
					padding: {
						top: 21,
					}
				},
				title: {
					display: false,
				},
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							suggestedMin: minRtDataPoint,
							// suggestedMax: maxRtDataPoint,
							stepSize: 0.5
						},
					}],
					xAxes: [{
						gridLines: {
							display: false,
						},
						ticks: {
							type: 'time',
							maxTicksLimit: 6,
							autoSkip: true,
							minRotation: 0,
							maxRotation: 0.
						},
					}]
				},
			}}
		/>
	}

	CfrChartRender = () => {
		const { cfrGraphData, lockdownDates, lockdownChartText, maxCFRPoint } = this.state;
		return <Line
			data={cfrGraphData}
			height={300}
			plugins={{
				verticalLineAtIndex: lockdownDates,
				lockdownChartText: lockdownChartText,
			}}
			options={{
				maintainAspectRatio: false,
				legend: {
					display: false,
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					filter: function (tooltipItem) {
						return tooltipItem.datasetIndex === 2;
					},
					callbacks: {
						label: function (tooltipItem, data) {
							var label = data.datasets[tooltipItem.datasetIndex].label || '';

							if (label) {
								label += ': ';
							}
							label += tooltipItem.yLabel.toFixed(2) + '%';
							return label;
						}
					}
				},
				hover: {
					mode: 'index',
					intersect: false,
					animationDuration: 200,
					onHover: function (event, chart) {
					},
				},
				layout: {
					padding: {
						top: 21,
					}
				},
				title: {
					display: false,
				},
				scales: {
					yAxes: [{
						display: true,
						ticks: {
							max: maxCFRPoint,
						},
					}],
					xAxes: [{
						gridLines: {
							display: false,
						},
						ticks: {
							type: 'time',
							maxTicksLimit: 6,
							autoSkip: true,
							minRotation: 0,
							maxRotation: 0.
						},
					}]
				},
			}}
		/>
	}

	MobilityChartRender = () => {
		const { mobilityGraphData, lockdownDates, lockdownChartText } = this.state;
		return <Line
			data={mobilityGraphData}
			height={300}
			plugins={{
				verticalLineAtIndex: lockdownDates,
				lockdownChartText: lockdownChartText,
			}}
			options={{
				maintainAspectRatio: false,
				legend: {
					display: true,
					labels: {
						boxWidth: 20,
						fontFamily: 'Titillium Web',
						filter: function (item, chart) {
							if (item.text) {
								return !item.text.includes('fixed');
							}
						},
					},
					position: 'bottom',
				},
				tooltips: {
					mode: 'index',
					intersect: false,
					filter: function (item) {
						return !item.datasetIndex == 0;
					},
				},
				hover: {
					mode: 'index',
					intersect: false,
					animationDuration: 200,
					onHover: function (event, chart) {
					},
				},
				layout: {
					padding: {
						top: 21,
					}
				},
				title: {
					display: false,
				},
				scales: {
					yAxes: [{
						display: true,
					}],
					xAxes: [{
						gridLines: {
							display: false,
						},
						ticks: {
							type: 'time',
							maxTicksLimit: 6,
							autoSkip: true,
							minRotation: 0,
							maxRotation: 0.
						},
					}],
				},
			}}
		/>
	}

	handleDivScroll = (event) => {
		if (this.textDivRef.current) {
			this.textDivRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			})
		}
	}

	handleDashboardScroll = () => {
		if (this.plotsRef.current) {
			setTimeout(() => { this.scrollToPlots() }, 800);
		}
	}

	scrollToPlots = (event) => {
		if (this.plotsRef.current) {
			this.plotsRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			})
		}
	}

	scrollToTable = (event) => {
		if (this.tableRef.current) {
			this.tableRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest"
			})
		}
	}


	render() {

		const popoverFont = this.state.mobileView ? "smaller" : "1 rem";
		const popoverMaxWidth = this.state.mobileView ? "216px" : "276px";

		const { positivityRateGraphData, selectedView, mobileView } = this.state;
		const dailyCasesPopover = (
			<Popover id="dailycases-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Daily Positive Cases</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					The solid line represents the 7-day moving average of daily new COVID cases.
				</Popover.Content>
			</Popover>
		);

		const dailyTestsPopover = (
			<Popover id="dailytests-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Daily Tests</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					The number of tests done daily.
				</Popover.Content>
			</Popover>
		);

		const rtPopover = (
			<Popover id="rt-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Effective Reproduction Number (Rt)</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					Rt is the average number of people infected by a single case at a particular time during the outbreak.<br />
					Green line at Rt=1 below which epidemic is controlled.<br />
					Dark band and light band show 50% and 95% confidence intervals respectively.
				</Popover.Content>
			</Popover>
		);

		const cfrPopover = (
			<Popover id="cfr-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Corrected Case Fatality Rate (CFR)</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					Out of every 100 COVID+ cases whose outcome is expected to be known, this many have passed away. Lower corrected CFR means better testing in general.
					<br />The corrected CFR is naturally high early in the epidemic and indicates low testing at that time. <br />Interpret with caution where healthcare capacity is overwhelmed.
				</Popover.Content>
			</Popover>
		);

		const mobilityPopover = (
			<Popover id="mobility-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Mobility Index</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					This indicates the % change in the movement of people at various places compared to January 2020.
				</Popover.Content>
			</Popover>
		);

		const positivityPopover = (
			<Popover id="positivity-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Positivity Rate</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					Percent of tests done per day that came back positive (7-day moving average). Lower positivity rate means better testing.
					Positivity rate below green line (less than 5%) indicates good testing, between green and red line (5-10%) indicates need for improvement, and above red line (more than 10%) indicates poor testing.
				</Popover.Content>
			</Popover>
		);
		const fontSizeDynamic = mobileView ? "smaller" : "larger";
		const fontSizeDynamicSH = mobileView ? "small" : "larger";
		const fontSizeDynamicHeading = mobileView ? "medium" : "x-large";
		const tabFontSize = window.innerWidth > '1058' ? "larger" : window.innerWidth > '1028' ? "large" : window.innerWidth > '1000' ? "medium" :
			window.innerWidth > '500' ? "large" : "small";
		const licenceWidth = mobileView ? "45px" : "90px";
		const licenceFont = mobileView ? "x-small" : "small";

		return (
			<div>
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

				<br />
				{selectedView === "Home" && <>
					<div className="App">

						<div className="home-text">
							<div className="for-the-people-heading" style={{ fontSize: fontSizeDynamicHeading }}>Tracking India's Progress Through The Coronavirus Pandemic, Today</div>
							<div className="for-the-people-heading" style={{ fontSize: fontSizeDynamicSH, fontWeight: "bolder" }}>Understanding Your State's Response Through Live Outbreak Indicators</div>
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
						</div>

						<this.DropdownRenderer />
						<div ref={this.plotsRef} style={{ textDecorationColor: "white", height: "5px" }}>.</div>
						{!mobileView && <div className="plot-headers">
							<span className="span-plot-title"><hr class="hr-text" data-content="How fast is the spread?" /></span>
							<span className="span-plot-title"><hr class="hr-text" data-content="Are we testing enough?" /></span>
						</div>}

						<Container>
							<Row>
								<Col lg="6">
									{mobileView && <div className="plot-headers">
										<span className="span-plot-title-mobile"><hr class="hr-text" data-content="How fast is the spread?" /></span>
									</div>}
									{/* Daily Cases Graph */}
									<Row>
										<Col>
											<Card className={mobileView ? "shadow" : "plots-card shadow"}>
												<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Daily Positive Cases
												<OverlayTrigger placement="left" overlay={dailyCasesPopover}>
														<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
													</OverlayTrigger>
												</h5>
												<div className="rtgraph">
													<this.DailyCasesChartRender />
												</div>
											</Card>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* RT Graph */}
									<Row>
										<Col>
											<Card className={mobileView ? "shadow" : "plots-card shadow"}>
												<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Effective Reproduction Number
												<OverlayTrigger placement="left" overlay={rtPopover}>
														<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
													</OverlayTrigger>
												</h5>
												<div className="rtgraph">
													<this.RtChartRender />
												</div>
											</Card>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* Mobility Graph */}
									<Row>
										<Col>
											<Card className={mobileView ? "shadow" : "plots-card shadow"}>
												<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Mobility Index (% change from pre-lockdown)
												<OverlayTrigger placement="left" overlay={mobilityPopover}>
														<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
													</OverlayTrigger>
												</h5>
												<div className="mobilityGraph">
													<this.MobilityChartRender />
												</div>
											</Card>
										</Col>
									</Row>
								</Col>
								<Col>
									{mobileView && <div className="mt-2"></div>}
									{mobileView && <div className="plot-headers">
										<span className="span-plot-title-mobile"><hr class="hr-text" data-content="Are we testing enough?" /></span>
									</div>}
									{/* Daily Tests */}
									<Row>
										<Col>
											<Card className={mobileView ? "shadow" : "plots-card shadow"}>
												<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Daily Tests
												<OverlayTrigger placement="left" overlay={dailyTestsPopover}>
														<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
													</OverlayTrigger>
												</h5>
												<div className="rtgraph">
													<this.DailyTestsChartRender />
												</div>
											</Card>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* Pos Rate Graph */}
									<Row>
										<Col>
											<Card className={mobileView ? "shadow" : "plots-card shadow"}>
												<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Positivity Rate (%)
												<OverlayTrigger placement="left" overlay={positivityPopover}>
														<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
													</OverlayTrigger>
												</h5>
												<div className="positivityrate-graph">
													<Line
														data={positivityRateGraphData}
														height={300}
														plugins={{
															verticalLineAtIndex: this.state.lockdownDates,
															lockdownChartText: this.state.lockdownChartText,
														}}
														options={{
															maintainAspectRatio: false,
															legend: {
																display: false,
															},
															tooltips: {
																mode: 'index',
																intersect: false,
																filter: function (tooltipItem) {
																	return tooltipItem.datasetIndex === 2;
																},
																callbacks: {
																	label: function (tooltipItem, data) {
																		var label = data.datasets[tooltipItem.datasetIndex].label || '';

																		if (label) {
																			label += ': ';
																		}
																		label += tooltipItem.yLabel.toFixed(2) + '%';
																		return label;
																	}
																}
															},
															hover: {
																mode: 'index',
																intersect: false,
																animationDuration: 200,
																onHover: function (event, chart) {
																},
															},
															layout: {
																padding: {
																	top: 21,
																}
															},
															title: {
																display: false,
															},
															scales: {
																yAxes: [{
																	display: true,
																}],
																xAxes: [{
																	gridLines: {
																		display: false,
																	},
																	ticks: {
																		type: 'time',
																		maxTicksLimit: 6,
																		autoSkip: true,
																		minRotation: 0,
																		maxRotation: 0.
																	},
																}]
															},
														}}
													/>
												</div>
											</Card>
										</Col>
									</Row>
									<div className="mt-2"></div>
									{/* CFR Graph */}
									<Row>
										<Col>
											<Card className={mobileView ? "shadow" : "plots-card shadow"}>
												<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Corrected Case Fatality Rate (%)
												<OverlayTrigger placement="left" overlay={cfrPopover}>
														<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
													</OverlayTrigger>
												</h5>
												<div className="cfr-graph">
													<this.CfrChartRender />
												</div>
											</Card>
										</Col>
									</Row>
								</Col>
							</Row>
						</Container>


						<div className="sub-header-row mt-4">
							<span className="header-bar-text">LATEST STATEWISE DATA</span>
						</div>
						<div className={mobileView ? "table-info-mobile" : "table-info"} style={{ backgroundColor: "white" }}>
							<Accordion>
								<Card>
									<Card.Header style={{ textAlign: "center" }}>
										<Accordion.Toggle as={Button} variant="link" eventKey="0">
											<img src={informationIcon} className="ml-1 information-icon" />
											{` Click here to know how to use the table`}
										</Accordion.Toggle>
									</Card.Header>
									<Accordion.Collapse eventKey="0">
										<Card.Body>
											<div>
												<b>How to interact with the table</b><br />
										Click on the parameter heading to sort states in order of that parameter. <br />
										Click on the state to load data for that state in the graphs above.<br />
										Hover on the headings for more info about the parameter.<br />
										Hover on the cells to see the date for which parameter is shown.<br /><br />

												<b>What do the colours mean</b><br />
										Up and Down arrows indicate change in respective parameters as compared to 7 days ago. <br />
												{`Rt is Red: >1, Yellow: <1 for less than 2 weeks, Green: < 1 for more than 2 weeks (based on WHO criteria).`} <br />
												{`Positivity Rate is Red: >10%, Yellow: 5-10%, Green: < 5% (based on WHO criteria).`} <br />
												{`Corrected CFR is Red: >10%, Yellow: 5-10%, Green: < 5%.`} <br /><br />

										Understand what the parameters mean
										<a className="link-text" style={{ color: "blue" }} onClick={this.handleDivScroll}> here</a>.<br />
										Raw data sources and detailed method of calculation
										<a className="link-text" style={{ color: "blue" }} onClick={() => this.setState({ selectedView: "Methods" }, window.scrollTo(0, 0))}> here</a>.
									</div>
										</Card.Body>
									</Accordion.Collapse>
								</Card>
							</Accordion>
						</div>
						<Container>
							<div ref={this.tableRef}
								id="myTable"
								className="ag-theme-balham"
								style={!this.state.mobileView ? {
									padding: '20px'
								} : { paddingTop: '20px' }}
							>
								<AgGridReact
									columnDefs={this.state.columnDefs}
									rowData={this.state.rowData}
									rowSelection={"single"}
									frameworkComponents={this.state.frameworkComponents}
									headerHeight={window.innerWidth < '1200' ? '60' : '48'}
									domLayout='autoHeight'
									pinnedTopRowData={this.state.pinnedTopRowData}
									onSelectionChanged={this.onSelectionChanged.bind(this)} />
							</div>
						</Container>
					</div>
					<div className="sub-header-row mt-4">
						<span className="header-bar-text">Know about the indicators</span>
					</div>

					<div className="home-text" ref={this.textDivRef}>
						<div className="for-the-people-heading" style={{ padding: "10px", fontSize: fontSizeDynamic }}>How fast is the spread? (Transmission indicators)</div>
						<CardGroup>
							<Card style={{ background: "#e8e8e8" }}>
								<Card.Body>
									<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: fontSizeDynamic }}>{`Effective Reproduction Number (Rt)`}</Card.Title>
									<Card.Text className="top-text-body" style={{ fontSize: fontSizeDynamic }}>
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
									<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: fontSizeDynamic }}>{`Mobility Index`}</Card.Title>
									<Card.Text className="top-text-body" style={{ fontSize: fontSizeDynamic }}>
										<div><span style={{ fontStyle: "italic" }}>This indicates the change in the amount of movement of people at various places
									compared to that before lockdown</span>  It shows us the effect of lockdown and behavioural change on the movement of people,
									and how this changes as restrictions are relaxed in a graded manner. We have introduced this parameter experimentally considering
									that mobility has a direct effect on disease spread, however there is no evidence yet that the mobility indices shown directly
									correlate with local transmission.</div>
									</Card.Text>
								</Card.Body>
							</Card>
						</CardGroup>
						<div className="for-the-people-heading" style={{ padding: "10px", fontSize: fontSizeDynamic }}>Are we testing enough? (Testing indicators)</div>
						<CardGroup>
							<Card style={{ background: "antiquewhite" }}>
								<Card.Body>
									<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: fontSizeDynamic }}>{`Test Positivity Rate`}</Card.Title>
									<Card.Text className="top-text-body" style={{ fontSize: fontSizeDynamic }}>
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
									<Card.Title className="top-text-title" style={{ fontWeight: "bolder", fontSize: fontSizeDynamic }}>{`Corrected Case Fatality Rate`}</Card.Title>
									<Card.Text className="top-text-body" style={{ fontSize: fontSizeDynamic }}>
										<div>The Crude CFR is equal to the deaths till date divided by the cases till date. This naive estimate of CFR is known to be biased in
										ongoing outbreaks, primarily due to two factors- the delay between time of case confirmation and time of death, and the under-reporting
										of cases due to limitations in testing coverage. The Corrected CFR presented here corrects for the first bias, by adjusting the
										denominator to reflect the number of cases where death would have been reported if it had occurred, based on known estimates of
									delay from confirmation to death. <span style={{ fontStyle: "italic" }}>The variation in Corrected CFR across states would then reflect
									the degree of under-reporting or testing adequacy in a particular state (with certain limitations). </span></div>
									</Card.Text>
								</Card.Body>
							</Card>
						</CardGroup>
					</div>
					<div className="disclaimer" style={{ fontSize: fontSizeDynamic }}>The raw data sources and detailed method of calculation is provided in the
						<a className="link-text" style={{ color: "blue" }} onClick={() => this.setState({ selectedView: "Methods" }, window.scrollTo(0, 0))}> Methods</a> page.
						Caution should be used in interpretation as the transmission and testing indicators are not entirely independent, and one may affect the other.
						We use best practices in all calculations, however some inadvertent errors may creep in despite our efforts.
						<a className="link-text" style={{ color: "blue" }} onClick={() => this.setState({ selectedView: "Contribute" }, window.scrollTo(0, 0))}> Report an error.</a></div>

					<div className="for-the-people" style={{ textAlign: "center", fontSize: fontSizeDynamic }}>
						<a className="titillium" href="https://github.com/CovidToday/indicator-dataset" target="_blank">Get the dataset (csv and json)</a><br />
						<a className="titillium" href="https://twitter.com/icart_india" target="_blank">Follow us on twitter</a><br />
						<a className="titillium" href="https://forms.gle/HDCDVYApfRi319k58" target="_blank">Contribute or give us feedback</a><br />
						<a className="titillium" href=" covidtodayindia@gmail.com" target="_blank">Get in touch with us</a>
					</div>

					<div class="wrapper"><div class="divider div-transparent" style={{ marginTop: "10px" }}></div></div>
					<div className="for-the-people">
						<div className="for-the-people-heading" style={{ fontSize: fontSizeDynamic }}>For The People, By The People</div>
						<div className="for-the-people-text" style={{ fontSize: fontSizeDynamic }}>COVID TODAY is an initiative by iCART, a multidisciplinary volunteer team of passionate doctors,
						researchers, coders, and public health experts from institutes across India.
						<a className="link-text" style={{ color: "blue" }} onClick={() => this.setState({ selectedView: "Team" }, window.scrollTo(0, 0))}> Learn more about the team</a>. This pandemic demands everyone to
						come together so that we can gradually move towards a new normal in the coming months while ensuring those who are vulnerable are protected.
						We envisage this platform to grow with your contribution and we welcome anyone who can contribute meaningfully to the project. Head over to
						the <a className="link-text" style={{ color: "blue" }} onClick={() => this.setState({ selectedView: "Contribute" }, window.scrollTo(0, 0))}>Contribute </a>page to see how you can pitch in.
						</div>
					</div>
				</>}
				{selectedView === "Methods" && <div className="App"><Methods /></div>}
				{selectedView === "Contribute" && <div className="App"><Contribute /></div>}
				{selectedView === "Team" && <div className="App"><About /></div>}
				<div className="footer-pic-container">
					<img src={Footer} className="footer-pic" onClick={() => this.setState({ selectedView: "Team" }, window.scrollTo(0, 0))} />
				</div>
				<div style={{ marginTop: "30px", display: "inline-block", textAlign: "end", width: "100%", fontSize: licenceFont }}>
					<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style={{ borderWidth: 0, width: licenceWidth }} src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>
				</div>
			</div>
		);
	}
}

export default App;
