import React, { Component } from 'react';

export default class BackButton extends Component {
    render() {
        return (
            <div>
                <button onClick={this.props.goBack}>{this.props.text}</button>
            </div>
        )
    }
}