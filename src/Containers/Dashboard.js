import React, { Component } from 'react';
import '.././App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Line, Chart, Bar } from 'react-chartjs-2';
import {
	Container, Row, Col, Dropdown, Card, Tabs, Tab, Button, Popover, OverlayTrigger,
	CardGroup, Accordion, ButtonToolbar, Spinner
} from 'react-bootstrap';
import Header from ".././images/header.png"
import Footer from ".././images/footer.jpg"
import informationIcon from ".././images/information_icon.png";
import PosRateRenderer from '.././StatesDataGrid/CellRenderers/PosRateRenderer.jsx';
import IncidenceRenderer from '.././StatesDataGrid/CellRenderers/IncidenceRenderer.jsx';
import DBTRenderer from '.././StatesDataGrid/CellRenderers/DBTRenderer.jsx';
import DailyTPMRenderer from '.././StatesDataGrid/CellRenderers/DailyTPMRenderer.jsx';
import CrudeCfrRenderer from '.././StatesDataGrid/CellRenderers/CrudeCfrRenderer.jsx';
import RecRateRenderer from '.././StatesDataGrid/CellRenderers/RecRateRenderer.jsx';
import CfrRenderer from '.././StatesDataGrid/CellRenderers/CfrRenderer.jsx';
import RtRenderer from '.././StatesDataGrid/CellRenderers/RtRenderer.jsx';
import CasesRenderer from '.././StatesDataGrid/CellRenderers/CasesRenderer.jsx';
import CumPosRateRenderer from '.././StatesDataGrid/CellRenderers/CumPosRateRenderer.jsx';
import CumCasesRenderer from '.././StatesDataGrid/CellRenderers/CumCasesRenderer.jsx';
import TPMRenderer from '.././StatesDataGrid/CellRenderers/TPMRenderer.jsx';
import graphIcon from ".././images/dashgraph.png";
import tableIcon from ".././images/dashtable.png";
import compareIcon from ".././images/dashcompare.png";
import mapIcon from ".././images/dashamap.png";
import analysisIcon from ".././images/dashanalysis.png";
import summaryIcon from ".././images/dashsummary.png";
import menuIcon from ".././images/menu.png";
import gitIcon from ".././images/github.png";
import twitterIcon from ".././images/twitter.png";
import mailIcon from ".././images/mail.png";
import feedbackIcon from ".././images/feedback.png";
import Licence from ".././Licence/Licence.js";
import LinkButtons from ".././LinkButtons.js"
import IndicatorDescriptionCards from ".././IndicatorDescriptionCards.js"
import CfrChart from ".././Plots/CfrChart.js"
import PosRateChart from ".././Plots/PosRateChart.js"
import DailyTestsChart from ".././Plots/DailyTestsChart.js"
import MobilityChart from ".././Plots/MobilityChart.js"
import RtChart from ".././Plots/RtChart.js"
import DailyCasesChart from ".././Plots/DailyCasesChart.js"
import DbtChart from ".././Plots/DbtChart.js"
import * as StateEnums from ".././Commons/StateEnums.js"
import ComparisionChart from '.././Plots/ComparisionChart';
import featured from ".././images/featured.png";
import numbro from 'numbro';
import upIcon from ".././images/up red.png";
import downIcon from ".././images/down green.png";
import yellowDash from ".././images/yellowDash.png";
import greenUp from ".././images/greenUp.svg";
import redDown from ".././images/redDown.png";

export default class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.textDivRef = React.createRef();
		this.plotsRef = React.createRef();
		this.tableRef = React.createRef();
		this.statesHeaderName = "STATES";

		this.state = {
			blogtitle: "",
			blogdescription: "",
			columnDefs: [
				{
					headerName: '', children: [
						{ headerValueGetter: params => `${this.statesHeaderName}`, field: "state", sortable: true, flex: 2, suppressMovable: true, maxWidth: "170", filter: 'agTextColumnFilter' }
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
							headerName: "CASES", field: "dailyCases", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "Number of COVID+ cases detected per day(averaged over last 7 days)",
							cellRenderer: 'casesRenderer', filter: 'agNumberColumnFilter', minWidth: 100, comparator: this.numberSort
						},
                        {
                         	headerName: "DAILY CASES PER MILLION", field: "incidence", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "Daily Cases Per Million",
                         	cellRenderer: 'IncidenceRenderer', filter: 'agNumberColumnFilter', comparator: this.numberSort, cellStyle: function (params) {
                                let style;
                                const number = (params.data.incidence);
                                if (number > 100) {
                                   style = { backgroundColor: '#fdcbdd' };
                                } else if (number <= 50) {
                                   style = { backgroundColor: '#e1fae9' };
                                } else if (number <= 100 && number > 50) {
                                   style = { backgroundColor: '#fafae1' };
                                }
                                return style;
                                }
                        },
                        {
                            headerName: "DOUBLING TIME(days)", field: "dbt", sortable: true, flex: 1, suppressMovable: true, headerTooltip: "Days taken for total cases to double",
                            cellRenderer: 'DBTRenderer', filter: 'agNumberColumnFilter', comparator: this.numberSort
                        }
					]
				},
				{
					headerName: 'TESTING', headerTooltip: "These numbers indicate the amount of testing being done in a state", children: [
					    {
                        	headerName: "DAILY TESTS PER MILLION", field: "dailyTPM", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort,
                        	cellRenderer: 'DailyTPMRenderer', filter: 'agNumberColumnFilter', headerTooltip: "Daily Tests Per Million"
                        },
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
						}
					]
				},
                {
                 	headerName: 'HEALTHCARE', headerTooltip: "", children: [
                 		{
                            headerName: "RECOVERY RATE(%)", field: "recRate", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort,
                            cellRenderer: 'RecRateRenderer', filter: 'agNumberColumnFilter', headerTooltip: "Percent of closed cases that have recovered"
                        },
                 		{
                 			headerName: "FATALITY RATE(%)", field: "ccfr", sortable: true, flex: 1, suppressMovable: true, comparator: this.numberSort,
                 			cellRenderer: 'cfrRenderer', filter: 'agNumberColumnFilter', headerTooltip: "Percent of closed cases that have died", cellStyle: function (params) {
                                let style;
                                const number = (params.data.ccfr);
                                if (number > 3) {
                                    style = { backgroundColor: '#fdcbdd' };
                                } else if (number <= 2) {
                                    style = { backgroundColor: '#e1fae9' };
                               } else if (number <= 3 && number > 2) {
                                    style = { backgroundColor: '#fafae1' };
                               }
                               return style;
                            }
                 		}
                 	]
                }
			],
			rowData: [],
			pinnedTopRowData: [],
			mobilityDataFromApi: [],
			rtDataFromApi: [],
			allDataFromApi: [],
			rtStateDataApi: [],
			rtDistrictDataApi: [],
			allStateData: [],
			allDistrictData: [],
			minRtDataPoint: 0,
			maxRtDataPoint: 0,
			maxDbtDatapoint: 0,
			minDbtDatapoint: 0,
			maxCFRPoint: 0,
			maxPosRatePoint: 0,
			lockdownDates: ["25 March", "15 April", "04 May", "18 May", "08 June", "01 July", "01 August"],
			lockdownChartText: ['LD 1', 'LD 2', 'LD 3', 'LD 4', 'Unlock 1', 'Unlock 2', 'Unlock 3'],
			graphStartDate: '22 March',
			rtPointGraphData: { datasets: [{ data: [] }], labels: [] },
			cfrGraphData: { datasets: [{ data: [] }], labels: [] },
			mobilityGraphData: { datasets: [{ data: [] }], lables: [] },
			positivityRateGraphData: { datasets: [{ data: [] }], lables: [] },
			dailyCasesGraphData: { datasets: [{ data: [] }], lables: [] },
			dailyTestsGraphData: { datasets: [{ data: [] }], lables: [] },
			dbtGraphData: { datasets: [{ data: [] }], labels: [] },
			comparisionGraphData: { datasets: [{ data: [] }], lables: [] },
			statesForComparision: ["Delhi", "Gujarat", "Punjab"],
			objectsForComparision: '',
			selectedState: 'India',
			selectedView: 'Home',
			showblog: 0,
			mobileView: false,
			frameworkComponents: {
				posRateRenderer: PosRateRenderer,
				cfrRenderer: CfrRenderer,
				casesRenderer: CasesRenderer,
				rtRenderer: RtRenderer,
				cumPosRateRenderer: CumPosRateRenderer,
				cumCasesRenderer: CumCasesRenderer,
				TPMRenderer: TPMRenderer,
				IncidenceRenderer: IncidenceRenderer,
				DBTRenderer: DBTRenderer,
				DailyTPMRenderer: DailyTPMRenderer,
				CrudeCfrRenderer: CrudeCfrRenderer,
				RecRateRenderer: RecRateRenderer
			},
			lastUpdatedTime: "",
			cardsData: [],
			showDistricts: false,
			loading: true
		}
	}

	columnDefMobile = [
		{
			headerName: '', children: [
				{ headerValueGetter: params => `${this.statesHeaderName}`, field: "state", sortable: true, suppressMovable: true, pinned: 'left', width: 120 }
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
					headerName: "CASES", field: "dailyCases", width: 100, sortable: true, suppressMovable: true, headerTooltip: "Number of COVID+ cases detected per day(averaged over last 7 days)",
					cellRenderer: 'casesRenderer', comparator: this.numberSort, cellStyle: { fontSize: "x-small" }
				},
                {
                    headerName: "DAILY CASES PER MILLION", field: "incidence", width: 90, sortable: true, suppressMovable: true, headerTooltip: "Daily Cases Per Million",
                    cellRenderer: 'IncidenceRenderer', comparator: this.numberSort, cellStyle: { fontSize: "x-small" }, cellStyle: function (params) {
                       let style;
                       const number = (params.data.incidence);
                       if (number > 100) {
                           style = { backgroundColor: '#fdcbdd' };
                       } else if (number <= 50) {
                           style = { backgroundColor: '#e1fae9' };
                       } else if (number <= 100 && number > 50) {
                           style = { backgroundColor: '#fafae1' };
                       }
                       return style;
                       }
                },
                {
                     headerName: "DOUBLING TIME (days)", field: "dbt", width: 90, sortable: true, suppressMovable: true, headerTooltip: "Days taken for closed cases to double",
                     cellRenderer: 'DBTRenderer', cellStyle: { fontSize: "x-small" }, comparator: this.numberSort
                }
			]
		},
		{
			headerName: 'TESTING', headerTooltip: "These numbers indicate the amount of testing being done in a state", children: [
			    {
                    headerName: "DAILY TESTS PER MILLION", field: "dailyTPM", width: 90, sortable: true, suppressMovable: true, comparator: this.numberSort,
                    cellRenderer: 'DailyTPMRenderer', cellStyle: { fontSize: "x-small" }, headerTooltip: "Daily Tests Per Million"
                },
				{
					headerName: "POSITIVITY RATE(%)", field: "posRate", width: 90, sortable: true, suppressMovable: true, headerTooltip: "Percent of tests done per day that came back positive (averaged over last 7 days). Indicates RECENT trend",
					cellRenderer: 'posRateRenderer', comparator: this.numberSort, cellStyle: { fontSize: "x-small" }, cellStyle: function (params) {
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
				}
			]
		},
        {
             headerName: 'HEALTHCARE', headerTooltip: "", children: [
                 {
                    headerName: "RECOVERY RATE(%)", field: "recRate", width: 90, sortable: true, suppressMovable: true, comparator: this.numberSort,
                    cellRenderer: 'RecRateRenderer', cellStyle: { fontSize: "x-small" }, headerTooltip: "Percent of closed cases that have recovered"
                 },
                 {
                    headerName: "FATALITY RATE(%)", field: "ccfr", width: 90, sortable: true, suppressMovable: true, comparator: this.numberSort,
                    cellRenderer: 'cfrRenderer', headerTooltip: "Percent of closed cases that have died", cellStyle: { fontSize: "x-small" }, cellStyle: function (params) {
                        let style;
                        const number = (params.data.ccfr);
                        if (number > 3) {
                            style = { backgroundColor: '#fdcbdd' };
                        } else if (number <= 2) {
                            style = { backgroundColor: '#e1fae9' };
                        } else if (number <= 3 && number > 2) {
                            style = { backgroundColor: '#fafae1' };
                        }
                        return style;
                    }
                 }
             ]
         }
	];

	componentDidMount() {
		this.setData();
		if (window.innerWidth <= '1000') {
			this.setState({ columnDefs: this.columnDefMobile });
			this.setState({ mobileView: true });
		}
	}

	componentWillMount() {
		this.configureVerticalLinesPlugin();
	}



	async setData() {
		//RT
		await axios.get('https://covidtoday.github.io/backend/state_data/rt_graph.json')
			.then(response => {
				this.setState({ rtStateDataApi: response.data });
				this.setState({ rtDataFromApi: this.state.rtStateDataApi });
				this.getRtPointGraphData(this.state.rtDataFromApi.TT);
			});

		await axios.get('https://covidtoday.github.io/backend/district_data/rt_graph.json')
			.then(response => {
				this.setState({ rtDistrictDataApi: response.data });
			});
		//OTHER METRICS
		await axios.get('https://covidtoday.github.io/backend/state_data/allmetrics_states.json')
			.then(response => {
				this.setState({ allStateData: response.data });
				this.setState({ allDataFromApi: response.data });
				this.getCfrGraphData(this.state.allStateData.India);
				this.getPositivityRateGraphData(this.state.allStateData.India);
				this.getDailyCasesGraphData(this.state.allStateData.India);
				this.getDailyTestsGraphData(this.state.allStateData.India);
				this.getDbtGraphData(this.state.allStateData.India);
				this.getComparisionGraphData(this.state.allStateData, "daily_positive_cases");
			});

		await axios.get('https://covidtoday.github.io/backend/district_data/allmetrics_districts.json')
			.then(response => {
				this.setState({ allDistrictData: response.data });
			});
		//BLOG
		await axios.get('https://raw.githubusercontent.com/CovidToday/frontend/master/src/Blogs/Title.txt')
			.then(response => {
				this.setState({ blogtitle: response.data });
				if (response.data[0] != "#")
					this.setState({ showblog: this.state.showblog + 1 });
			});

		await axios.get('https://raw.githubusercontent.com/CovidToday/frontend/master/src/Blogs/Description.txt')
			.then(response => {
				this.setState({ blogdescription: response.data });
				if (response.data[0] != "#")
					this.setState({ showblog: this.state.showblog + 1 });
			});

		await axios.get('https://covidtoday.github.io/backend/mobility-index/india_mobility_indented.json')
			.then(response => {
				this.setState({ mobilityDataFromApi: response.data });
				this.getMobilityGraphData(this.state.mobilityDataFromApi.India);
			});

		const lastUpdated = this.state.allStateData.datetime;
		const timestamp = lastUpdated ? lastUpdated.split(":", 2).join(":") : "NA";
		this.setState({ lastUpdatedTime: timestamp });

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
		return StateEnums.StateNames[key];
	}

	setRowData = () => {
		let allStates = [];
		let allDistricts = [];
		allStates = this.state.rtStateDataApi && Object.keys(this.state.rtStateDataApi);
		allDistricts = this.state.rtDistrictDataApi && Object.keys(this.state.rtDistrictDataApi);
		const list = this.state.showDistricts ? allDistricts : allStates.filter(s => s !== "TT");
		const data = [];
		const infoData = [];
		const pinnedData = [];

		const rtApi = this.state.showDistricts ? this.state.rtDistrictDataApi : this.state.rtStateDataApi;
		this.setState({ rtDataFromApi: rtApi });
		const allApi = this.state.showDistricts ? this.state.allDistrictData : this.state.allStateData;
		this.setState({ allDataFromApi: allApi });

		if (rtApi && allApi && Object.keys(rtApi).length > 0 && Object.keys(allApi).length > 0) {
			list && list.forEach(s => {
				const name = !this.state.showDistricts ? this.getName(s) : s;

				//rt
				let rtIndex = rtApi[s] ? rtApi[s].rt_point.length - 1 : -1;
				for(let i = rtIndex; i>=0; i--) {
				    if(rtApi[s].rt_point[i] !== "") {
				        rtIndex = i;
				        break;
				    }
				}
				const rtPoint = rtIndex > 0 && (rtApi[s].rt_point[rtIndex]) !== "" ? (rtApi[s].rt_point[rtIndex]).toFixed(2) : "NA";
				const rtl95 = rtIndex > 0 && (rtApi[s].rt_l95[rtIndex]) !== "" ? (rtApi[s].rt_l95[rtIndex]).toFixed(2) : "NA";
				const rtu95 = rtIndex > 0 && (rtApi[s].rt_u95[rtIndex]) !== "" ? (rtApi[s].rt_u95[rtIndex]).toFixed(2) : "NA";
				const rtDate = rtIndex > 0 ? (rtApi[s].dates[rtIndex]) : "-";
				const rtToCompare = [];
				if (rtIndex > 13) {
					for (let i = rtIndex - 13; i <= rtIndex; i++) {
						rtToCompare.push((rtApi[s].rt_point[i]) !== "" ? (rtApi[s].rt_point[i]).toFixed(2) : "NA");
					};
				}
				const rtData = rtPoint === "NA" ? "NA" : `${rtPoint} (${rtl95}-${rtu95})`;

				//cfr
				const cfrIndex = allApi[name] && allApi[name].cfr2_point ? allApi[name].cfr2_point.length - 1 : -1;
				const cfrPoint = cfrIndex > 0 && allApi[name].cfr2_point ? (allApi[name].cfr2_point[cfrIndex]).toFixed(2) : "NA";
				const cfrPointOld = cfrIndex > 0 && allApi[name].cfr2_point ? (allApi[name].cfr2_point[cfrIndex - 7]).toFixed(2) : "NA";
				const cfrDate = cfrIndex > 0 && allApi[name].cfr2_point ? allApi[name].dates[cfrIndex] : "-";
				const cfrPoint2 = cfrIndex > 0 && allApi[name].cfr2_point ? (allApi[name].cfr2_point[cfrIndex]).toFixed(2) : "NA";

				const crudeCFRIndex = allApi[name] && allApi[name].cfr1_point ? allApi[name].cfr1_point.length - 1 : -1;
				const crudeCFRPoint = crudeCFRIndex > 0 && allApi[name].cfr1_point ? (allApi[name].cfr1_point[crudeCFRIndex]).toFixed(2) : "NA";
				const crudeCFRPointOld = crudeCFRIndex > 0 && allApi[name].cfr1_point ? (allApi[name].cfr1_point[crudeCFRIndex - 7]).toFixed(2) : "NA";
				const crudeCFRDate = crudeCFRIndex > 0 && allApi[name].cfr1_point ? allApi[name].dates[crudeCFRIndex] : "-";

				//posRate
				const posRateArr = Object.entries(allApi);
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
				let cumDeceased;
				let cumDeceasedDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexCases = data[1].cum_deceased.slice().reverse().findIndex(i => i !== "");
						const countCases = data[1].cum_deceased.length - 1;
						const cumCasesIndex = indexCases >= 0 ? countCases - indexCases : indexCases;
						const cumulativeCasesFloat = data[1].cum_deceased[cumCasesIndex];
						cumDeceased = cumulativeCasesFloat && cumulativeCasesFloat !== "" ? cumulativeCasesFloat : "-";
						cumDeceasedDate = data[1].dates[cumCasesIndex];
					}
				});
				let cumRecovered;
				let cumRecoveredDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexCases = data[1].cum_recovered.slice().reverse().findIndex(i => i !== "");
						const countCases = data[1].cum_recovered.length - 1;
						const cumCasesIndex = indexCases >= 0 ? countCases - indexCases : indexCases;
						const cumulativeCasesFloat = data[1].cum_recovered[cumCasesIndex];
						cumRecovered = cumulativeCasesFloat && cumulativeCasesFloat !== "" ? cumulativeCasesFloat : "-";
						cumRecoveredDate = data[1].dates[cumCasesIndex];
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

				let cumTests;
				let cumTestsDate;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexTests = data[1].cum_tests.slice().reverse().findIndex(i => i !== "");
						const countTests = data[1].cum_tests.length - 1;
						const testsIndex = indexTests >= 0 ? countTests - indexTests : indexTests;
						const testsFloat = (data[1].cum_tests[testsIndex]);
						cumTests = testsFloat && testsFloat !== "" ? Math.floor(testsFloat) : "-";
						cumTestsDate = data[1].dates[testsIndex];
					}
				});

				let dbt;
				let dbtDate;
				let dbtOld;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexDbt = data[1].dbt_point.slice().reverse().findIndex(i => i !== "");
						const countDbt = data[1].dbt_point.length - 1;
						const dbtIndex = indexDbt >= 0 ? countDbt - indexDbt : indexDbt;
						const dbtFloat = (data[1].dbt_point[dbtIndex]);
						dbt = dbtFloat && dbtFloat !== "" ? (dbtFloat).toFixed(1) : "-";
						const dbtFloatOld = (data[1].dbt_point[dbtIndex - 7]);
                        dbtOld = dbtFloatOld && dbtFloatOld !== "" ? (dbtFloatOld).toFixed(1) : "-";
						dbtDate = data[1].dates[dbtIndex];
					}
				});

				let dailyPos;
				let dailyPosOld;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexDailyPos = data[1].daily_positive_cases.slice().reverse().findIndex(i => i !== "");
						const countDailyPos = data[1].daily_positive_cases.length - 1;
						const DailyPosIndex = indexDailyPos >= 0 ? countDailyPos - indexDailyPos : indexDailyPos;
						const DailyPosFloat = (data[1].daily_positive_cases[DailyPosIndex]);
						dailyPos = DailyPosFloat && DailyPosFloat !== "" ? Math.floor(DailyPosFloat) : "-";
						const DailyPosFloatOld = (data[1].daily_positive_cases[DailyPosIndex - 7]);
						dailyPosOld = DailyPosFloatOld && DailyPosFloatOld !== "" ? (DailyPosFloatOld).toFixed(2) : "NA";
					}
				});

				let dailyRec;
				let dailyRecOld;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexDailyRec = data[1].daily_recovered.slice().reverse().findIndex(i => i !== "");
						const countDailyRec = data[1].daily_recovered.length - 1;
						const DailyRecIndex = indexDailyRec >= 0 ? countDailyRec - indexDailyRec : indexDailyRec;
						const DailyRecFloat = (data[1].daily_recovered[DailyRecIndex]);
						dailyRec = DailyRecFloat && DailyRecFloat !== "" ? Math.floor(DailyRecFloat) : "-";
						const DailyRecFloatOld = (data[1].daily_recovered[DailyRecIndex - 7]);
						dailyRecOld = DailyRecFloatOld && DailyRecFloatOld !== "" ? (DailyRecFloatOld).toFixed(2) : "NA";
					}
				});

				let dailyDeath;
				let dailyDeathOld;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexDailyDeath = data[1].daily_deceased.slice().reverse().findIndex(i => i !== "");
						const countDailyDeath = data[1].daily_deceased.length - 1;
						const DailyDeathIndex = indexDailyDeath >= 0 ? countDailyDeath - indexDailyDeath : indexDailyDeath;
						const DailyDeathFloat = (data[1].daily_deceased[DailyDeathIndex]);
						dailyDeath = DailyDeathFloat && DailyDeathFloat !== "" ? Math.floor(DailyDeathFloat) : "-";
						const DailyDeathFloatOld = (data[1].daily_deceased[DailyDeathIndex - 7]);
						dailyDeathOld = DailyDeathFloatOld && DailyDeathFloatOld !== "" ? (DailyDeathFloatOld).toFixed(2) : "NA";
					}
				});

				let dailyTests;
				let dailyTestsOld;
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexDailyTests = data[1].daily_tests.slice().reverse().findIndex(i => i !== "");
						const countDailyTests = data[1].daily_tests.length - 1;
						const DailyTestsIndex = indexDailyTests >= 0 ? countDailyTests - indexDailyTests : indexDailyTests;
						const DailyTestsFloat = (data[1].daily_tests[DailyTestsIndex]);
						dailyTests = DailyTestsFloat && DailyTestsFloat !== "" ? Math.floor(DailyTestsFloat) : "-";
						const DailyTestsFloatOld = (data[1].daily_tests[DailyTestsIndex - 7]);
						dailyTestsOld = DailyTestsFloatOld && DailyTestsFloatOld !== "" ? (DailyTestsFloatOld).toFixed(2) : "NA";
					}
				});

				let dailyCasesPM;
				let dailyCasesPMOld;
				let dailyCasesPMDate
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexdailyCasesPM = data[1].daily_cases_per_million.slice().reverse().findIndex(i => i !== "");
						const countdailyCasesPM = data[1].daily_cases_per_million.length - 1;
						const dailyCasesPMIndex = indexdailyCasesPM >= 0 ? countdailyCasesPM - indexdailyCasesPM : indexdailyCasesPM;
						const dailyCasesPMFloat = (data[1].daily_cases_per_million[dailyCasesPMIndex]);
						dailyCasesPM = dailyCasesPMFloat && dailyCasesPMFloat !== "" ? Math.floor(dailyCasesPMFloat) : "-";
						const dailyCasesPMFloatOld = (data[1].daily_cases_per_million[dailyCasesPMIndex - 7]);
						dailyCasesPMOld = dailyCasesPMFloatOld && dailyCasesPMFloatOld !== "" ? Math.floor(dailyCasesPMFloatOld) : "NA";
						dailyCasesPMDate = data[1].dates[dailyCasesPMIndex];
					}
				});

				let dailyTestsPM;
				let dailyTestsPMOld;
				let dailyTestsPMDate
				posRateArr.forEach(data => {
					if (data[0] === name) {
						const indexdailyTestsPM = data[1].daily_tests_per_million.slice().reverse().findIndex(i => i !== "");
						const countdailyTestsPM = data[1].daily_tests_per_million.length - 1;
						const dailyTestsPMIndex = indexdailyTestsPM >= 0 ? countdailyTestsPM - indexdailyTestsPM : indexdailyTestsPM;
						const dailyTestsPMFloat = (data[1].daily_tests_per_million[dailyTestsPMIndex]);
						dailyTestsPM = dailyTestsPMFloat && dailyTestsPMFloat !== "" ? Math.floor(dailyTestsPMFloat) : "-";
						const dailyTestsPMFloatOld = (data[1].daily_tests_per_million[dailyTestsPMIndex - 7]);
						dailyTestsPMOld = dailyTestsPMFloatOld && dailyTestsPMFloatOld !== "" ? Math.floor(dailyTestsPMFloatOld) : "NA";
						dailyTestsPMDate = data[1].dates[dailyTestsPMIndex];
					}
				});

				const recoveryRate = cumRecovered && cumDeceased && !isNaN((cumRecovered / (cumRecovered + cumDeceased)) * 100) ?
				    ((cumRecovered / (cumRecovered + cumDeceased)) * 100).toFixed(2) : 0;

				infoData.push({
					key: s, state: name, total: cumCases, totalDate: cumCasesDate, recovered: cumRecovered,
					recoveredDate: cumRecoveredDate, deceased: cumDeceased, deceasedDate: cumDeceasedDate, tests: cumTests,
					testsDate: cumTestsDate, rt: rtData, rtDate: rtDate, dbt: dbt, dbtDate: dbtDate, cfr: cfrPoint2, posRate: maPosRate,
					dailyPos: dailyPos, dailyPosOld: dailyPosOld, dailyRec: dailyRec, dailyRecOld: dailyRecOld,
					dailyDeath: dailyDeath, dailyDeathOld: dailyDeathOld, dailyTests: dailyTests, dailyTestsOld: dailyTestsOld
				});

				data.push({
					key: s, state: name, rt: rtData, cumCases: cumCases, dailyCases: dailyPos, posRate: maPosRate, cumPosRate: cumulativePosRate,
					ccfr: cfrPoint, rtCurrent: rtPoint, rtOld: rtToCompare, dailyCasesOld: dailyPosOld, posRateOld: maPosRateOld, cfrOld: cfrPointOld,
					rtDate: rtDate, cumCasesDate: cumCasesDate, maCasesDate: maCasesDate, posRateDate: posRateDate, cumPRateDate: cumPRateDate, cfrDate: cfrDate,
					testsPerMil: tpm, tpmDate: tpmDate, incidence: dailyCasesPM, incidenceOld: dailyCasesPMOld, incidenceDate: dailyCasesPMDate,
                    dailyTPM: dailyTestsPM, dailyTPMOld: dailyTestsPMOld, dailyTPMDate: dailyTestsPMDate, crudeCFR: crudeCFRPoint,
                    crudeCFROld: crudeCFRPointOld, crudeCFRDate: crudeCFRDate, dbt: dbt, dbtOld: dbtOld, dbtDate: dbtDate,
                    recRate: recoveryRate
				});
			});
			data.sort(function (a, b) {
				const aNum = parseInt(a.cumCases);
				const bNum = parseInt(b.cumCases);
				return (aNum < bNum) ? 1 : -1
			});
			this.setState({ rowData: data })
		}

		//India data
		let rtIndexInd = this.state.rtStateDataApi["TT"].rt_point.length - 1;
		for(let i = rtIndexInd; i>=0; i--) {
            if(rtApi["TT"].rt_point[i] !== "") {
        	    rtIndexInd = i;
        		break;
        	}
        }
		const rtPointInd = rtIndexInd > 0 && (this.state.rtStateDataApi["TT"].rt_point[rtIndexInd]) !== "" ? (this.state.rtStateDataApi["TT"].rt_point[rtIndexInd]).toFixed(2) : "NA";
		const rtl95Ind = rtIndexInd > 0 && (this.state.rtStateDataApi["TT"].rt_l95[rtIndexInd]) !== "" ? (this.state.rtStateDataApi["TT"].rt_l95[rtIndexInd]).toFixed(2) : "NA";
		const rtu95Ind = rtIndexInd > 0 && (this.state.rtStateDataApi["TT"].rt_u95[rtIndexInd]) !== "" ? (this.state.rtStateDataApi["TT"].rt_u95[rtIndexInd]).toFixed(2) : "NA";
		const rtDate = rtIndexInd > 0 ? (this.state.rtStateDataApi["TT"].dates[rtIndexInd]) : "-";
		const rtToCompareInd = [];
		if (rtIndexInd > 13) {
			for (let i = rtIndexInd - 13; i <= rtIndexInd; i++) {
				rtToCompareInd.push((this.state.rtStateDataApi["TT"].rt_point[i]) !== "" ? (this.state.rtStateDataApi["TT"].rt_point[i]).toFixed(2) : "NA");
			};
		}
		const rtDataInd = `${rtPointInd} (${rtl95Ind}-${rtu95Ind})`

		const cfrIndexInd = this.state.allStateData.India.cfr2_point && this.state.allStateData.India.cfr2_point.length - 1;
		const cfrPointInd = cfrIndexInd > 0 && this.state.allStateData.India.cfr2_point ? (this.state.allStateData.India.cfr2_point[cfrIndexInd]).toFixed(2) : "NA";
		const cfrDate = cfrIndexInd > 0 ? this.state.allStateData.India.dates[cfrIndexInd] : "-";
		const cfrPointOld = cfrIndexInd > 0 && this.state.allStateData.India.cfr2_point ? (this.state.allStateData.India.cfr2_point[cfrIndexInd - 7]).toFixed(2) : "NA";
		const cfrPointInd2 = cfrIndexInd > 0 && this.state.allStateData.India.cfr2_point ? (this.state.allStateData.India.cfr2_point[cfrIndexInd]).toFixed(2) : "NA";

		const crudeCFRIndexInd = this.state.allStateData.India.cfr1_point && this.state.allStateData.India.cfr1_point.length - 1;
		const crudeCFRPointInd = crudeCFRIndexInd > 0 && this.state.allStateData.India.cfr1_point ? (this.state.allStateData.India.cfr1_point[crudeCFRIndexInd]).toFixed(2) : "NA";
		const crudeCFRDate = crudeCFRIndexInd > 0 && this.state.allStateData.India.cfr1_point ? this.state.allStateData.India.dates[crudeCFRIndexInd] : "-";
		const crudeCFRPointOld = crudeCFRIndexInd > 0 && this.state.allStateData.India.cfr1_point ? (this.state.allStateData.India.cfr1_point[crudeCFRIndexInd - 7]).toFixed(2) : "NA";

		const posRateArrInd = this.state.allStateData.India;

		const cumConfirmedIndIndex = posRateArrInd.cum_positive_cases.slice().reverse().findIndex(i => i !== "");
		const cumConfirmedIndCount = posRateArrInd.cum_positive_cases.length - 1;
		const resultIndex = cumConfirmedIndIndex >= 0 ? cumConfirmedIndCount - cumConfirmedIndIndex : cumConfirmedIndIndex;
		const cumCasesInd = (posRateArrInd.cum_positive_cases[resultIndex]);
		const cumCasesIndDate = posRateArrInd.dates[resultIndex];

		const cumRecoveredIndIndex = posRateArrInd.cum_recovered.slice().reverse().findIndex(i => i !== "");
		const cumRecoveredIndCount = posRateArrInd.cum_recovered.length - 1;
		const recoveredIndex = cumRecoveredIndIndex >= 0 ? cumRecoveredIndCount - cumRecoveredIndIndex : cumRecoveredIndIndex;
		const cumRecoveredInd = (posRateArrInd.cum_recovered[recoveredIndex]);
		const cumRecoveredIndDate = posRateArrInd.dates[recoveredIndex];

		const cumDeceasedIndIndex = posRateArrInd.cum_deceased.slice().reverse().findIndex(i => i !== "");
		const cumDeceasedIndCount = posRateArrInd.cum_deceased.length - 1;
		const deceasedIndex = cumDeceasedIndIndex >= 0 ? cumDeceasedIndCount - cumDeceasedIndIndex : cumDeceasedIndIndex;
		const cumDeceasedInd = (posRateArrInd.cum_deceased[deceasedIndex]);
		const cumDeceasedIndDate = posRateArrInd.dates[deceasedIndex];

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

		const indexIndTests = posRateArrInd.cum_tests.slice().reverse().findIndex(i => i !== "");
		const countIndTests = posRateArrInd.cum_tests.length - 1;
		const testsIndexInd = indexIndTests >= 0 ? countIndTests - indexIndTests : indexIndTests;
		const testsInd = Math.floor(posRateArrInd.cum_tests[testsIndexInd]);
		const testsIndDate = posRateArrInd.dates[testsIndexInd];

		const indexIndDbt = posRateArrInd.dbt_point.slice().reverse().findIndex(i => i !== "");
		const countIndDbt = posRateArrInd.dbt_point.length - 1;
		const dbtIndexInd = indexIndDbt >= 0 ? countIndDbt - indexIndDbt : indexIndDbt;
		const dbtInd = (posRateArrInd.dbt_point[dbtIndexInd]).toFixed(1);;
		const dbtIndDate = posRateArrInd.dates[dbtIndexInd];
		const dbtIndOld = (posRateArrInd.dbt_point[dbtIndexInd - 7]).toFixed(1);;

		const indexIndDailyPos = posRateArrInd.daily_positive_cases.slice().reverse().findIndex(i => i !== "");
		const countIndDailyPos = posRateArrInd.daily_positive_cases.length - 1;
		const DailyPosIndexInd = indexIndDailyPos >= 0 ? countIndDailyPos - indexIndDailyPos : indexIndDailyPos;
		const DailyPosInd = Math.floor(posRateArrInd.daily_positive_cases[DailyPosIndexInd]);
		const DailyPosIndOld = Math.floor(posRateArrInd.daily_positive_cases[DailyPosIndexInd - 7]);

		const indexIndDailyRec = posRateArrInd.daily_recovered.slice().reverse().findIndex(i => i !== "");
		const countIndDailyRec = posRateArrInd.daily_recovered.length - 1;
		const DailyRecIndexInd = indexIndDailyRec >= 0 ? countIndDailyRec - indexIndDailyRec : indexIndDailyRec;
		const DailyRecInd = Math.floor(posRateArrInd.daily_recovered[DailyRecIndexInd]);
		const DailyRecIndOld = Math.floor(posRateArrInd.daily_recovered[DailyRecIndexInd - 7]);

		const indexIndDailyDeath = posRateArrInd.daily_deceased.slice().reverse().findIndex(i => i !== "");
		const countIndDailyDeath = posRateArrInd.daily_deceased.length - 1;
		const DailyDeathIndexInd = indexIndDailyDeath >= 0 ? countIndDailyDeath - indexIndDailyDeath : indexIndDailyDeath;
		const DailyDeathInd = Math.floor(posRateArrInd.daily_deceased[DailyDeathIndexInd]);
		const DailyDeathIndOld = Math.floor(posRateArrInd.daily_deceased[DailyDeathIndexInd - 7]);

		const indexIndDailyTests = posRateArrInd.daily_tests.slice().reverse().findIndex(i => i !== "");
		const countIndDailyTests = posRateArrInd.daily_tests.length - 1;
		const DailyTestsIndexInd = indexIndDailyTests >= 0 ? countIndDailyTests - indexIndDailyTests : indexIndDailyTests;
		const DailyTestsInd = Math.floor(posRateArrInd.daily_tests[DailyTestsIndexInd]);
		const DailyTestsIndOld = Math.floor(posRateArrInd.daily_tests[DailyTestsIndexInd - 7]);

		const indexIndincidence = posRateArrInd.daily_cases_per_million.slice().reverse().findIndex(i => i !== "");
		const countIndincidence = posRateArrInd.daily_cases_per_million.length - 1;
		const incidenceIndexInd = indexIndincidence >= 0 ? countIndincidence - indexIndincidence : indexIndincidence;
		const incidenceInd = Math.floor(posRateArrInd.daily_cases_per_million[incidenceIndexInd]);
		const incidenceIndOld = Math.floor(posRateArrInd.daily_cases_per_million[incidenceIndexInd - 7]);
		const incidenceIndDate = posRateArrInd.dates[incidenceIndexInd];

		const indexInddailytpm = posRateArrInd.daily_tests_per_million.slice().reverse().findIndex(i => i !== "");
		const countInddailytpm = posRateArrInd.daily_tests_per_million.length - 1;
		const dailytpmIndexInd = indexInddailytpm >= 0 ? countInddailytpm - indexInddailytpm : indexInddailytpm;
		const dailytpmInd = Math.floor(posRateArrInd.daily_tests_per_million[dailytpmIndexInd]);
		const dailytpmIndOld = Math.floor(posRateArrInd.daily_tests_per_million[dailytpmIndexInd - 7]);
		const dailytpmIndDate = posRateArrInd.dates[dailytpmIndexInd];

		const recoveryRateInd = cumRecoveredInd && cumDeceasedInd && !isNaN((cumRecoveredInd / (cumRecoveredInd + cumDeceasedInd)) * 100) ?
			((cumRecoveredInd / (cumRecoveredInd + cumDeceasedInd)) * 100).toFixed(2) : 0;

		infoData.push({
			key: "TT", state: "India", total: cumCasesInd, totalDate: cumCasesIndDate, recovered: cumRecoveredInd,
			recoveredDate: cumRecoveredIndDate, deceased: cumDeceasedInd, deceasedDate: cumDeceasedIndDate,
			tests: testsInd, testsDate: testsIndDate, rt: rtDataInd, rtDate: rtDate, dbt: dbtInd, dbtDate: dbtIndDate,
			cfr: cfrPointInd2, posRate: PosRateMaInd, dailyPos: DailyPosInd, dailyPosOld: DailyPosIndOld, dailyRec: DailyRecInd,
			dailyRecOld: DailyRecIndOld, dailyDeath: DailyDeathInd, dailyDeathOld: DailyDeathIndOld, dailyTests: DailyTestsInd,
			dailyTestsOld: DailyTestsIndOld
		});

		pinnedData.push({
			key: "TT", state: "India", rt: rtDataInd, cumCases: cumCasesInd, dailyCases: DailyPosInd, posRate: PosRateMaInd, cumPosRate: cumulativePosRateInd,
			ccfr: cfrPointInd, rtCurrent: rtPointInd, rtOld: rtToCompareInd, rtDate: rtDate, cfrDate: cfrDate, cfrOld: cfrPointOld, dailyCasesOld: DailyPosIndOld,
			posRateOld: PosRateMaIndOld, cumCasesDate: cumCasesIndDate, maCasesDate: maCasesIndDate, posRateDate: posRateDateInd, cumPRateDate: cumPRDateInd,
			testsPerMil: tpmInd, tpmDate: tpmIndDate, incidence: incidenceInd, incidenceOld: incidenceIndOld, incidenceDate: incidenceIndDate,
			dailyTPM: dailytpmInd, dailyTPMOld: dailytpmIndOld, dailyTPMDate: dailytpmIndDate, crudeCFR: crudeCFRPointInd,
            crudeCFROld: crudeCFRPointOld, crudeCFRDate: crudeCFRDate, dbt: dbtInd, dbtOld: dbtIndOld, dbtDate: dbtIndDate, recRate: recoveryRateInd
		})
		this.setState({ pinnedTopRowData: pinnedData });
		this.setState({ cardsData: infoData });
		this.setState({loading: false});

		if(this.state.showDistricts) {
		    this.onStateSelect("Ahmedabad");
		    this.statesHeaderName = "DISTRICTS";
		    this.dataGrid && this.dataGrid.refreshHeader();
		} else {
		    this.onStateSelect("TT");
		    this.statesHeaderName = "STATES";
		    this.dataGrid && this.dataGrid.refreshHeader();
		}
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
				borderColor: 'rgba(0, 64, 101,0.1)',//'#004065',
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
				backgroundColor: 'rgba(0, 64, 101,0.1)',
				radius: 1,
				fill: false,
			}, {
				type: 'line',
				label: 'Daily Tests Moving Average',
				data: dataFromApi.daily_tests_ma.slice(dateIndex, dataFromApi.dates.length),
				borderColor: '#004065',
				radius: 1,
				fill: false
			}];
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

			let maxRtDataPoint = Math.ceil(Math.max(...dataFromApi.rt_u95.slice(dateIndex, dataFromApi.dates.length)));
			maxRtDataPoint = Math.min(maxRtDataPoint, 4);
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
				maxRtDataPoint: maxRtDataPoint,
				minRtDataPoint: minRtDataPoint,
			}, this.RtChartRender);
		}
	}

	getDbtGraphData = (dataFromApi) => {
		if (dataFromApi) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = dataFromApi.dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = dataFromApi.dates.slice(dateIndex, dataFromApi.dates.length);

			let maxDbtDatapoint = Math.floor(Math.max(...dataFromApi.dbt_u95.slice(dateIndex, dataFromApi.dates.length)));
			maxDbtDatapoint = Math.min(maxDbtDatapoint, 130);

			let minDbtDatapoint = Math.floor(Math.min(...dataFromApi.dbt_l95.slice(dateIndex, dataFromApi.dates.length)));
            minDbtDatapoint = Math.max(minDbtDatapoint, -100);

			//Horizontal line
			// let horizontalLineData = [];
			// for (let i = 0; i < data.labels.length; i++) {
			// 	horizontalLineData.push(1);
			// }
			// data.datasets.push({
			// 	label: 'fixed value',
			// 	data: horizontalLineData,
			// 	borderColor: 'rgba(0,100,0,0.5)',
			// 	borderWidth: 2,
			// 	fill: false,
			// 	radius: 0,
			// 	hoverRadius: 0,
			// });

			// Main data
			let mainData = [{
				label: 'DBT l95',
				data: dataFromApi.dbt_l95.slice(dateIndex, dataFromApi.dates.length),
				fill: '2',// + (verticalLineData.length + 2),
				backgroundColor: '#d3efff',
				borderWidth: 1,
				radius: 0,
				hoverRadius: 0,
			}, {
				label: 'DBT',
				data: dataFromApi.dbt_point.slice(dateIndex, dataFromApi.dates.length),
				radius: 1,
				borderColor: '#004065',
				fill: false
			}, {
				label: 'DBT u95',
				data: dataFromApi.dbt_u95.slice(dateIndex, dataFromApi.dates.length),
				fill: '-2',
				backgroundColor: '#d3efff',
				borderWidth: 1,
				radius: 0,
				hoverRadius: 0,
			}];
			data.datasets.push(...mainData);
			this.setState({
				dbtGraphData: data,
				maxDbtDatapoint: maxDbtDatapoint,
				minDbtDatapoint: minDbtDatapoint,
			}, this.DbtChartRender);
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

			let maxCFRPoint = dataFromApi.cfr3_point ? Math.ceil(Math.max(...dataFromApi.cfr3_point.slice(dateIndex, dataFromApi.dates.length))) : 0;
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
			const cfrDataSet = dataFromApi.cfr3_point && dataFromApi.cfr3_point.slice();

			// Main data
			let mainData = [{
				label: 'CFR',
				data: cfrDataSet && cfrDataSet.slice(dateIndex, cfrDataSet.length),
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

	getComparisionGraphData = (api, objType) => {
		const states = this.state.statesForComparision;
		if (api) {
			let data = {
				datasets: [],
				labels: []
			};
			let dateIndex = api["India"] && api["India"].dates &&
				api["India"].dates.indexOf(this.state.graphStartDate);
			dateIndex = (dateIndex == -1) ? 0 : dateIndex;
			data.labels = api["India"] && api["India"].dates &&
				api["India"].dates.slice(dateIndex, api["India"].dates.length);


			// Main data
			let mainData = [];
			states && states.forEach(s => {
				mainData.push({
					label: s,
					data: api && api[s] && api[s][objType] && api[s][objType].slice(dateIndex, api["India"].dates.length),
					fill: false,
					radius: 1,
				});
			});
			console.log(data);
			data.datasets.push(...mainData);
			this.setState({
				comparisionGraphData: data,
			});
		}
	}

	onStateCheckBoxChange(state) {
		const { statesForComparision } = this.state;
		let updatedStates = [];
		if (statesForComparision.indexOf(state) > -1) {
			updatedStates = statesForComparision.filter((s) => s != state);
		} else {
			updatedStates.push(...statesForComparision, state);
		}
		this.setState({
			statesForComparision: updatedStates
		}, () => this.getComparisionGraphData(this.state.allStateData, "daily_positive_cases"));
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

			let maxPosRatePoint = Math.ceil(Math.max(...dataFromApi.daily_positivity_rate_ma.slice(dateIndex, dataFromApi.daily_positivity_rate_ma.length)))
			maxPosRatePoint = Math.min(75, maxPosRatePoint);

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
				maxPosRatePoint: maxPosRatePoint
			});
		}
	}

	onSelectionChanged = (data) => {
		const selectedRows = data.api.getSelectedRows();
		const selectedState = selectedRows[0].key;
		const state = this.state.showDistricts ? selectedState : this.getName(selectedState);
		this.getRtPointGraphData(this.state.rtDataFromApi[selectedState]);
		this.getCfrGraphData(this.state.allDataFromApi[state]);
		this.getMobilityGraphData(this.state.mobilityDataFromApi[state]);
		this.getPositivityRateGraphData(this.state.allDataFromApi[state]);
		this.getDailyCasesGraphData(this.state.allDataFromApi[state]);
		this.getDailyTestsGraphData(this.state.allDataFromApi[state]);
		this.getDbtGraphData(this.state.allDataFromApi[state]);
		this.setState({ selectedState: state });
	}

	onStateSelect(key) {
		const stateName = this.state.showDistricts ? key : this.getName(key);
		this.setState({ selectedState: stateName });
		this.getRtPointGraphData(this.state.rtDataFromApi[key]);
		this.getMobilityGraphData(this.state.mobilityDataFromApi[stateName]);
		this.getPositivityRateGraphData(this.state.allDataFromApi[stateName]);
		this.getCfrGraphData(this.state.allDataFromApi[stateName]);
		this.getDailyCasesGraphData(this.state.allDataFromApi[stateName]);
		this.getDailyTestsGraphData(this.state.allDataFromApi[stateName]);
		this.getDbtGraphData(this.state.allDataFromApi[stateName]);
	}

	blog = () => {
		let newText = this.state.blogdescription.split('\n').map(i => {
			return <p style={{ marginTop: "0px", marginBottom: "0px" }}>{i}</p>
		});
		console.log(this.state.showblog)
		return (

			<div>
				{this.state.showblog === 2 && <>
					<Card className={this.state.mobileView ? "blog-container-mobile text-center" : "blog-container text-center"}>
						<Card.Body>
							<Card.Title>{this.state.blogtitle}</Card.Title>
							<Card.Text>{newText}</Card.Text>
						</Card.Body>
					</Card>
					<br />
					<br />
				</>
				}
			</div>

		)
	}

	NavDropdown = () => {
		return (
			<Dropdown>
				<Dropdown.Toggle variant="success" id="dropdown-dash" className="dropdown-dash">
					<span><img src={menuIcon} style={{ width: "40px" }} className="quicklink-icon" /></span>
				</Dropdown.Toggle>
				<Dropdown.Menu id="dropdown-dash-menu">
					<Dropdown.Item href="#Summary"><img src={summaryIcon} style={{ height: "25px", width: "25px", marginLeft: "-10px" }} />  Summary</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item href="#Graph"><img src={graphIcon} style={{ height: "25px", width: "25px", marginLeft: "-10px" }} />  Graph</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item href="#Table"><img src={tableIcon} style={{ height: "25px", width: "25px", marginLeft: "-10px" }} />  Table</Dropdown.Item>
					<Dropdown.Divider />
					{/*<Dropdown.Item href="#Map"><img src={mapIcon} style={{height : "25px", width : "25px",marginLeft:"-10px" }}  />  Map</Dropdown.Item>
                    <Dropdown.Divider/>*/}
                    <Dropdown.Item onClick={() => this.props.updateView("contribute")}><img src={compareIcon} style={{height : "25px", width : "25px",marginLeft:"-10px" }}   />  Contribute</Dropdown.Item>
                    <Dropdown.Divider/>
					<Dropdown.Item href="#Analysis"><img src={analysisIcon} style={{ height: "25px", width: "25px", marginLeft: "-10px" }} />  Analysis</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>

		)
	}

	compareArr = (a, b) => {
		const itemA = a && a.state && a.state.toUpperCase();
		const itemB = b && b.state && b.state.toUpperCase();

		let comparison = 0;
		if (itemA > itemB) {
			comparison = 1;
		} else if (itemA < itemB) {
			comparison = -1;
		}

		return comparison;
	}

	async switchStateDistrict() {
		const { showDistricts } = this.state;
		await this.setState({ showDistricts: !showDistricts });
		this.setRowData();
	};

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

	getCompareImage = (value, valueOld) => {
		if (value > valueOld) {
			return upIcon;
		} else {
			return downIcon;
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
					Light bands show 95% confidence intervals.
				</Popover.Content>
			</Popover>
		);

		const dbtPopover = (
			<Popover id="dbt-popover" style={{ maxWidth: popoverMaxWidth }}>
				<Popover.Title as="h3" style={{ fontSize: popoverFont }}>Doubling Time</Popover.Title>
				<Popover.Content style={{ fontSize: popoverFont }}>
					The total COVID+ cases doubles in this many days.<br />
					Light bands show 95% confidence intervals.
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
		const cardsArrIndex = this.state.cardsData && this.state.cardsData.length > 1 ?
			this.state.cardsData.findIndex(d => d.state === this.state.selectedState) : -1;

		//summary card values
		const totalCases = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].total) ? this.state.cardsData[cardsArrIndex].total : 0;
		const deceasedCases = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].deceased) ? this.state.cardsData[cardsArrIndex].deceased : 0;
		const recoveredCases = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].recovered) ? this.state.cardsData[cardsArrIndex].recovered : 0;
		const activeCases = totalCases && deceasedCases && recoveredCases && !isNaN((totalCases - (deceasedCases + recoveredCases))) ? (totalCases - (deceasedCases + recoveredCases)) : 0;
		const tests = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].tests) ? this.state.cardsData[cardsArrIndex].tests : 0;
		const rt = cardsArrIndex !== -1 && this.state.cardsData ? this.state.cardsData[cardsArrIndex].rt : 0;
		const dbt = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dbt) ? this.state.cardsData[cardsArrIndex].dbt : 0;
		const recoveryRate = recoveredCases && deceasedCases && !isNaN((recoveredCases / (recoveredCases + deceasedCases)) * 100) ? ((recoveredCases / (recoveredCases + deceasedCases)) * 100) : 0;
		const fatRate = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].cfr) ? (this.state.cardsData[cardsArrIndex].cfr) : 0;
		const posRate = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].posRate) ? this.state.cardsData[cardsArrIndex].posRate : 0;
		const dailyPos = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyPos) ? this.state.cardsData[cardsArrIndex].dailyPos : 0;
		const dailyPosOld = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyPosOld) ? this.state.cardsData[cardsArrIndex].dailyPosOld : 0;
		const dailyRec = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyRec) ? this.state.cardsData[cardsArrIndex].dailyRec : 0;
		const dailyRecOld = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyRecOld) ? this.state.cardsData[cardsArrIndex].dailyRecOld : 0;
		const dailyDeath = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyDeath) ? this.state.cardsData[cardsArrIndex].dailyDeath : 0;
		const dailyDeathOld = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyDeathOld) ? this.state.cardsData[cardsArrIndex].dailyDeathOld : 0;
		const dailyTests = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyTests) ? this.state.cardsData[cardsArrIndex].dailyTests : 0;
		const dailyTestsOld = cardsArrIndex !== -1 && this.state.cardsData && !isNaN(this.state.cardsData[cardsArrIndex].dailyTestsOld) ? this.state.cardsData[cardsArrIndex].dailyTestsOld : 0;
		const dailyActive = dailyPos && dailyDeath && dailyRec && !isNaN((dailyPos - (dailyDeath + dailyRec))) ? (dailyPos - (dailyDeath + dailyRec)) : 0;
		const dailyActiveOld = dailyPosOld && dailyDeathOld && dailyRecOld && !isNaN((dailyPosOld - (dailyDeathOld + dailyRecOld))) ? (dailyPosOld - (dailyDeathOld + dailyRecOld)) : 0;

        const fontSize = this.state.mobileView ? "small" : "medium";
        const array = this.state.rowData && this.state.rowData;
        array.sort(this.compareArr);

		return (
			<div>

			    <div>

			        {this.state.loading && <div className="loader">
			            <Spinner animation="border" /><br/>
			        </div>}

					{!this.state.loading && <div className="App">

						{/*<div className="home-text">
							<div className="for-the-people-heading" style={{ fontSize: fontSizeDynamicHeading }}>Tracking India's Progress Through The Coronavirus Pandemic, Today</div>
							<div className="for-the-people-heading" style={{ fontSize: fontSizeDynamicSH, fontWeight: "bolder" }}>Understanding Your State's Response Through Live Outbreak Indicators</div>
							<br />
						</div>*/}
                        <br/>
						<div className="sub-header-row sticky-top">
                        	<span className="header-bar-nav"><this.NavDropdown /></span>
                        	{!this.state.mobileView &&
                        		<span className="header-bar-text" style={{ fontSize: fontSize }}>
                        			Last Updated -{this.state.mobileView && <br />} {this.state.lastUpdatedTime}
                        		</span>}
                        	<span className="header-bar-dropdown">
                        		<Dropdown>
                        			<Dropdown.Toggle variant="success" id="dropdown-basic" className="dropdown-state">
                        				{this.state.selectedState}
                        			</Dropdown.Toggle>

                        			<Dropdown.Menu className="dropdown-state-list">
                        				{!this.state.showDistricts && <Dropdown.Item onSelect={() => this.onStateSelect("TT")}>India</Dropdown.Item>}
                        				{array.map((item) => {
                        					return <Dropdown.Item onSelect={() => this.onStateSelect(item.key)}>
                        						{!this.state.showDistricts ? this.getName(item.key) : item.key}
                        					</Dropdown.Item>
                        				})}
                        			</Dropdown.Menu>
                        		</Dropdown>
                        	</span>
                        	<span className="header-bar-text">
                        		<span style={{ marginRight: "15px" }}>
                        			<Button variant="outline-primary" style={{ fontSize: fontSize }} className="st-di-toggle" onClick={() => this.switchStateDistrict()}>
                        				{this.state.showDistricts ? "States Data" : "Districts Data"}
                        			</Button>
                        		</span>
                        	</span>
                        	{!this.state.mobileView && <span className="header-bar-text">
                        	</span>}
                        </div>
						<br />
						<div id="Summary">
							<br />
							<this.blog />
							<br />
							{this.state.mobileView && <Container>
								<Row>
									<Col className="mobile-summary-cards">
										<Card className={"blue-card summary-card-mobile"} v>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Confirmed </span><br />
												<span className="summary-card-number-mobile">{numbro(totalCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary-mobile">{numbro(dailyPos).format({ thousandSeparated: true })}</span>
												<span><img src={upIcon} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="mobile-summary-cards">
										<Card className={"blue-card summary-card-mobile"} v>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Reproduction No</span><br />
												<span className="summary-card-description-mobile">Each covid+ spreads it to</span><br />
												<span className="summary-card-number-mobile-rt">{rt} persons</span>
											</span>
										</Card>
									</Col>
								</Row>
								<Row>
									<Col className="mobile-summary-cards">
										<Card className={"red-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Active </span><br />
												<span className="summary-card-number-mobile">{numbro(activeCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary-mobile">{numbro(dailyActive).format({ thousandSeparated: true })}</span>
												<span><img src={this.getCompareImage(dailyActive, dailyActiveOld)} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="mobile-summary-cards">
										<Card className={"red-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Doubling Time</span><br />
												<span className="summary-card-description-mobile">Total cases double in</span><br />
												<span className="summary-card-number-mobile">{numbro(dbt).format({ mantissa: 1 })} days</span>
											</span>
										</Card>
									</Col>
								</Row>
								<Row>
									<Col className="mobile-summary-cards">
										<Card className={"green-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Recovered </span><br />
												<span className="summary-card-number-mobile">{numbro(recoveredCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary-mobile">{numbro(dailyRec).format({ thousandSeparated: true })}</span>
												<span><img src={greenUp} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="mobile-summary-cards">
										<Card className={"green-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Recovery Rate</span><br />
												<span className="summary-card-number-mobile">{numbro(recoveryRate).format({ mantissa: 1 })}%</span><br />
												<span className="summary-card-description-mobile">of closed cases have recovered</span>
											</span>
										</Card>
									</Col>
								</Row>
								<Row>
									<Col className="mobile-summary-cards">
										<Card className={"grey-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Deaths </span><br />
												<span className="summary-card-number-mobile">{numbro(deceasedCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary-mobile">{numbro(dailyDeath).format({ thousandSeparated: true })}</span>
												<span><img src={upIcon} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="mobile-summary-cards">
										<Card className={"grey-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Fatality Rate</span><br />
												<span className="summary-card-number-mobile">{numbro(fatRate).format({ mantissa: 1 })}%</span><br />
												<span className="summary-card-description-mobile">of closed cases have died</span>
											</span>
										</Card>
									</Col>
								</Row>
								<Row>
									<Col className="mobile-summary-cards">
										<Card className={"yellow-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Tests </span><br />
												<span className="summary-card-number-mobile">{numbro(tests).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary-mobile">{numbro(dailyTests).format({ thousandSeparated: true })}</span>
												<span><img src={greenUp} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="mobile-summary-cards">
										<Card className={"yellow-card summary-card-mobile"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading-mobile">Test Positivity</span><br />
												<span className="summary-card-number-mobile">{numbro(posRate).format({ mantissa: 1 })}%</span><br />
												<span className="summary-card-description-mobile">of tests are positive (7 day)</span>
											</span>
										</Card>
									</Col>
								</Row>
							</Container>}
							{!this.state.mobileView && <Container>
								<Row>
									<Col className="summary-cards">
										<Card className={"blue-card summary-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Confirmed </span><br />
												<span className="summary-card-number">{numbro(totalCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary">{numbro(dailyPos).format({ thousandSeparated: true })}</span>
												<span><img src={upIcon} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"red-card summary-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Active </span><br />
												<span className="summary-card-number">{numbro(activeCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary">{numbro(dailyActive).format({ thousandSeparated: true })}</span>
												<span><img src={this.getCompareImage(dailyActive, dailyActiveOld)} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"green-card summary-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Recovered </span><br />
												<span className="summary-card-number">{numbro(recoveredCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary">{numbro(dailyRec).format({ thousandSeparated: true })}</span>
												<span><img src={greenUp} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"grey-card summary-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Deaths </span><br />
												<span className="summary-card-number">{numbro(deceasedCases).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary">{numbro(dailyDeath).format({ thousandSeparated: true })}</span>
												<span><img src={upIcon} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"yellow-card summary-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Tests </span><br />
												<span className="summary-card-number">{numbro(tests).format({ thousandSeparated: true })}</span><br />
												<span className="summary-card-number-secondary">{numbro(dailyTests).format({ thousandSeparated: true })}</span>
												<span><img src={greenUp} className="cell-icon" /></span>
											</span>
										</Card>
									</Col>
								</Row>
								<Row>
									<Col className="summary-cards">
										<Card className={"summary-card blue-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Reproduction No</span><br />
												<span className="summary-card-description">Each covid+ spreads it to</span><br />
												<span className="summary-card-number-rt">{rt}</span>
												<span className="summary-card-number-rt"> persons</span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"summary-card red-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Doubling Time</span><br />
												<span className="summary-card-description">Total cases double in</span><br />
												<span className="summary-card-number">{numbro(dbt).format({ mantissa: 1 })} days</span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"summary-card green-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Recovery Rate</span><br />
												<span className="summary-card-number">{numbro(recoveryRate).format({ mantissa: 1 })}%</span><br />
												<span className="summary-card-description">of closed cases have recovered</span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"summary-card grey-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Fatality Rate</span><br />
												<span className="summary-card-number">{numbro(fatRate).format({ mantissa: 1 })}%</span><br />
												<span className="summary-card-description">of closed cases have died</span>
											</span>
										</Card>
									</Col>
									<Col className="summary-cards">
										<Card className={"summary-card yellow-card"}>
											<span style={{ fontSize: fontSizeDynamic }}>
												<span className="summary-card-heading">Test Positivity</span><br />
												<span className="summary-card-number">{numbro(posRate).format({ mantissa: 1 })}%</span><br />
												<span className="summary-card-description">of tests are positive (7 day)</span>
											</span>
										</Card>
									</Col>
								</Row>
							</Container>}
						</div>

						<div className={mobileView ? "featured-pic-container-mobile" : "featured-pic-container"}>
							<img src={featured} className="featured-pic" />
						</div>

						<div id="Graph">
							<div ref={this.plotsRef} className="sub-header-row mt-4">
								<span className="header-bar-text">GRAPHICAL REPRESENTATION</span>
							</div>

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
														<DailyCasesChart
															dailyCasesGraphData={this.state.dailyCasesGraphData}
															lockdownDates={this.state.lockdownDates}
															lockdownChartText={this.state.lockdownChartText}
														/>
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
														<RtChart
															minRtDataPoint={this.state.minRtDataPoint}
															maxRtDataPoint={this.state.maxRtDataPoint}
															rtPointGraphData={this.state.rtPointGraphData}
															lockdownDates={this.state.lockdownDates}
															lockdownChartText={this.state.lockdownChartText}
														/>
													</div>
												</Card>
											</Col>
										</Row>
										{/* DBT Graph */}
										<Row>
											<Col>
												<Card className={mobileView ? "shadow" : "plots-card shadow"}>
													<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Doubling Time (Days)
													<OverlayTrigger placement="left" overlay={dbtPopover}>
															<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
														</OverlayTrigger>
													</h5>
													<div className="dbt-graph">
														<DbtChart
															maxDbtDatapoint={this.state.maxDbtDatapoint}
															minDbtDatapoint={this.state.minDbtDatapoint}
															dbtGraphData={this.state.dbtGraphData}
															lockdownDates={this.state.lockdownDates}
															lockdownChartText={this.state.lockdownChartText}
														/>
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
														<DailyTestsChart
															dailyTestsGraphData={this.state.dailyTestsGraphData}
															lockdownDates={this.state.lockdownDates}
															lockdownChartText={this.state.lockdownChartText}
														/>
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
														<PosRateChart
															lockdownDates={this.state.lockdownDates}
															lockdownChartText={this.state.lockdownChartText}
															positivityRateGraphData={positivityRateGraphData}
															maxPosRatePoint={this.state.maxPosRatePoint}
														/>
													</div>
												</Card>
											</Col>
										</Row>
										{/* Mobility Graph */}
										{!this.state.showDistricts && <Row>
											<Col>
												<Card className={mobileView ? "shadow" : "plots-card shadow"}>
													<h5 className="mb-0 mt-2 plot-heading font-weight-bold" style={{ fontSize: fontSizeDynamic }}>Social Distancing (% mobility change)
													<OverlayTrigger placement="left" overlay={mobilityPopover}>
															<img src={informationIcon} className="ml-1 information-icon" alt="information png" />
														</OverlayTrigger>
													</h5>
													<div className="mobilityGraph">
														<MobilityChart
															mobilityGraphData={this.state.mobilityGraphData}
															lockdownDates={this.state.lockdownDates}
															lockdownChartText={this.state.lockdownChartText}
														/>
													</div>
												</Card>
											</Col>
										</Row>}
										<div className="mt-2"></div>
									</Col>
								</Row>
							</Container>
						</div>

						<div id="Table">
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
											 Up arrowhead (value increased), down arrowhead (value decreased), and yellow dash (value within +-5%)
											 indicate change in respective parameters as compared to 7 days ago. <br />
													{`Rt is Red: >1, Yellow: <1 for less than 2 weeks, Green: < 1 for more than 2 weeks (based on WHO criteria).`} <br />
													{`Positivity Rate is Red: >10%, Yellow: 5-10%, Green: < 5% (based on WHO criteria).`} <br />
													{`Corrected CFR is Red: >10%, Yellow: 5-10%, Green: < 5%.`} <br /><br />

											Understand what the parameters mean
											<a className="link-text" style={{ color: "blue" }} onClick={this.handleDivScroll}> here</a>.<br />
											Raw data sources and detailed method of calculation
											<a className="link-text" style={{ color: "blue" }} onClick={() => {
														this.props.updateView("methods");
													}}> here</a>.
										</div>
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>
							</div>
							<Container style={{maxWidth: "1350px"}}>
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
										onGridReady={params => this.dataGrid = params.api}
										pinnedTopRowData={this.state.pinnedTopRowData}
										onSelectionChanged={this.onSelectionChanged.bind(this)} />
								</div>
							</Container>
						</div>

						{/*<div id="Map">
						<h1>MAP</h1>
					</div>

					<div id="Compare">
							<div className="sub-header-row mt-4">
							<span className="header-bar-text">COMPARE DATA FOR STATES</span>
							</div>
						{*//* Comparision chart *//*}
						<Container>
							<Row>
								<Col>
									Download the dataset
								</Col>
								<Col xs="9">
									List of objetcs
								</Col>
							</Row>
							<Row>
								<Col>
									<table style={{ maxHeight: 450, overflowX: 'hidden' }} class="table table-responsive">
										<thead>
											<tr style={{ position: 'sticky', top: 0 }}>
												<th></th>
												<th>States</th>
											</tr>
										</thead>
										<tbody>
											{this.state.rowData && this.state.rowData.map((item) => {
												const stateName = this.getName(item.key);
												return (
													<tr>
														<td><input type="checkbox"
															onChange={() => this.onStateCheckBoxChange(stateName)}
															checked={this.state.statesForComparision.indexOf(stateName) > -1 ? true : false}
														></input></td>
														<td>{stateName}</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</Col>
								<Col xs="9">
									<Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
										<Tab eventKey="home" title="1">
											<ComparisionChart
											comparisionGraphData={this.state.comparisionGraphData}
											lockdownDates={this.state.lockdownDates}
											lockdownChartText={this.state.lockdownChartText}
											></ComparisionChart>
										</Tab>
										<Tab eventKey="profile" title="2">
											{*//* <Sonnet /> *//*}
											wfejbgk
										</Tab>
										<Tab eventKey="contact" title="3">
											{*//* <Sonnet /> *//*}
										</Tab>
										<Tab eventKey="profil" title="4">
											{*//* <Sonnet /> *//*}
										</Tab><Tab eventKey="proile" title="5">
											{*//* <Sonnet /> *//*}
										</Tab>
										<Tab eventKey="profie" title="6">
											{*//* <Sonnet /> *//*}
										</Tab>
									</Tabs>
								</Col>
							</Row>
						</Container>
					</div>*/}

						<div id="Analysis">
							<div className="sub-header-row mt-4">
								<span className="header-bar-text">KNOW ABOUT THE INDICATORS</span>
							</div>

							<div className="home-text" ref={this.textDivRef}>
								<IndicatorDescriptionCards fontSize={fontSizeDynamic} />
							</div>
							<div className="disclaimer" style={{ fontSize: fontSizeDynamic }}>The raw data sources and detailed method of calculation is provided in the
							<a className="link-text" style={{ color: "blue" }} onClick={() => {
									this.props.updateView("methods");
								}}> Methods</a> page.
							Caution should be used in interpretation as the transmission and testing indicators are not entirely independent, and one may affect the other.
							We use best practices in all calculations, however some inadvertent errors may creep in despite our efforts.
							<a className="link-text" style={{ color: "blue" }} onClick={() => {
									this.props.updateView("contribute");
								}}> Report an error.</a></div>

							<LinkButtons fontSize={fontSizeDynamic} />

							<div class="wrapper"><div class="divider div-transparent" style={{ marginTop: "10px" }}></div></div>
							<div className="for-the-people">
								<div className="for-the-people-heading" style={{ fontSize: fontSizeDynamic }}>For The People, By The People</div>
								<div className="for-the-people-text" style={{ fontSize: fontSizeDynamic }}>COVID TODAY is an initiative by iCART, a multidisciplinary volunteer team of passionate doctors,
								researchers, coders, and public health experts from institutes across India.
							<a className="link-text" style={{ color: "blue" }} onClick={() => {
										this.props.updateView("about");
									}}> Learn more about the team</a>. This pandemic demands everyone to
							come together so that we can gradually move towards a new normal in the coming months while ensuring those who are vulnerable are protected.
							We envisage this platform to grow with your contribution and we welcome anyone who can contribute meaningfully to the project. Head over to
							the <a className="link-text" style={{ color: "blue" }} onClick={() => {
										this.props.updateView("contribute");
									}}>Contribute </a>page to see how you can pitch in.
							</div>
							</div>
						</div>
                        <div className="footer-pic-container">
                            <img src={Footer} className="footer-pic" onClick={() => {
                                this.props.updateView("about");
                            }} />
                        </div>
                        <Licence font={licenceFont} width={licenceWidth} />
					</div>}
				</div>
			</div>
		);
	}
}

