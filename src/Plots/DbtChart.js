import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

export default class DbtChart extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		const { maxDbtDatapoint, dbtGraphData, lockdownDates, lockdownChartText } = this.props;
		return <Line
			data={dbtGraphData}
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
						return tooltipItem.datasetIndex === 1;
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
							max: maxDbtDatapoint,
							// stepSize: 0.5
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
}