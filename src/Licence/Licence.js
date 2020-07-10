import React, { Component } from 'react';

export default class Licence extends Component {
    constructor(props) {
        super(props);
      }
    render() {
        return (
            <div style={{ marginTop: "30px", display: "inline-block", textAlign: "end", width: "100%", fontSize: this.props.font }}>
            	<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            	    <img alt="Creative Commons License" style={{ borderWidth: 0, width: this.props.width }}
            	        src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
            	 </a><br />
            	 This work is licensed under a
            	 <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            	    {` Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License`}
            	 </a>
            </div>
        )
    }
}