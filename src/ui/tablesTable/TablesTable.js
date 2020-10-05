import React, { Component } from 'react';

export default class TablesTable extends Component {

    state = {
        table: null
    }

    componentDidUpdate(prevProps) {
        if(this.props.tableNames !== prevProps.tableNames) {
            this.makeTable();
        }
    }

    makeTable = () => {
        let header = ['Table Names'];
        let rows = this.generateRows();
        let table = <div>
            <table className='table table-bordered table-hover'>
                <thead>
                    <tr key={1}>
                        <th key={2}>{header}</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table> 
        </div>

        this.setState({
            table: table
        })
    }

    generateRows = () => {
        return this.props.tableNames.map(function(name, index) {
            return <tr key={index} onClick={this.props.selectTable}>
                        <td>{name}</td>
                    </tr>
        }.bind(this))
    }

    render() {
        let display = this.state.table ? this.state.table : null;
        return (
            <div>
                {display}
            </div>
        )
    }
}