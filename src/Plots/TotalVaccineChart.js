import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

export default class TotalVaccineChart extends Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Line
				data={this.props.totalVaccineGraphData}
				height={300}
				options={{
					maintainAspectRatio: false,
					legend: {
						display: false,
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
							}
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
		)
	}
}