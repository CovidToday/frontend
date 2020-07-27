import React, { Component } from 'react';

export default class Error extends Component {

	render() {
		const normalText = window.innerWidth > '1000' ? {} : { fontSize: "smaller" };
		return (
			<div>
				<div>
					<span style={{fontSize: {normalText}}}>
					    Oops! Page not found! Please go back and then refresh.
					</span>
				</div>
			</div>

		);
	}
}
