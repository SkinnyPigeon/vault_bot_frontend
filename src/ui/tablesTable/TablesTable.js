import React, { Component } from 'react';

export default class TablesTable extends Component {

    state = {
        table: null
    }

    componentDidUpdate(prevProps) {
        if(JSON.stringify(this.props.rows.sort()) !== JSON.stringify(prevProps.rows.sort())) {
            this.makeTable()
        }
    }

    componentDidMount() {
        this.makeTable()
    }

    makeTable = () => {
        let header = [this.props.header];
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
        return this.props.rows.map(function(name, index) {
            return <tr key={index} onClick={this.props.select}>
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