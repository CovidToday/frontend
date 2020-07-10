import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

export default class CfrChart extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        const { cfrGraphData, lockdownDates, lockdownChartText, maxCFRPoint } = this.props;
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
}