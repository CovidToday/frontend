import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

class ComparisionChart extends Component {
    state = {}
    render() {
        const { comparisionGraphData, lockdownDates, lockdownChartText } = this.props;
        return (
            <Line
                data={comparisionGraphData}
                height={500}
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
                        // filter: function (item) {
                        //     return !item.datasetIndex == 0;
                        // },
                    },
                    hover: {
                        mode: 'index',
                        intersect: false,
                        animationDuration: 200,
                        onHover: function (event, chart) {
                            // console.log(event, chart)
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
        );
    }
}

export default ComparisionChart;