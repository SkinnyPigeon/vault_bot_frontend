import React, { Component } from 'react';

export default class SubmitButton extends Component {
    render() {
        return (
            <div>
                <button
                    onClick={this.props.getTable}
                >Get Table
                </button>
            </div>
        )
    }
}