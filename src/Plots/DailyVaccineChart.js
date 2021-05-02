import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';

export default class DailyVaccineChart extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        const { dailyVaccineGraphData } = this.props;
        		return <Bar
        			data={dailyVaccineGraphData}
        			height={300}

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
}