import React, { Component } from 'react';

export default class DatabaseSelector extends Component {
    render() {
        return (
            <div>
                <input 
                    // onChange={this.props.selectDatabase}
                    placeholder="Enter database name..."
                />
                <input 
                    // onChange={this.props.selectSchema}
                    placeholder="Enter schema name..."
                />
            </div>
        )
    }
}