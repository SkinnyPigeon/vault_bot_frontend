import React, { Component } from 'react';
const _ = require('lodash');

export default class TablesTable extends Component {

    state = {
        table: null,
        columns: {}
    }

    componentDidUpdate(prevProps) {
        if(JSON.stringify(this.props.rows.sort()) !== JSON.stringify(prevProps.rows.sort())) {
            this.makeTable();
        }
        console.log("PROPS: ", this.props)
        if(!_.isEqual(this.props.columns, prevProps.columns)) {
            this.makeTable();
        }
    }

    componentDidMount() {
        this.makeTable()
    }

    makeTable = () => {
        let header = this.generateHeader();
        let rows = this.generateRows();
        let satelliteInput = <input 
            placeholder="Enter Satellite Name..." 
            onChange={this.props.selectSatellite}
        />
        let satellite = this.props.selectable ? satelliteInput : '';
        let table = <div>
            {satellite}
            <table className='table table-bordered table-hover'>
                <thead>
                    {header}
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

    generateHeader = () => {
        if(this.props.selectable) {
            return <tr key={123}>
                <th>{this.props.header[0]}</th>
                <th>{this.props.header[1]}</th>
                <th>{this.props.header[2]}</th>
            </tr>
        } else {
            return <tr key={123}>
                <th>{this.props.header[0]}</th>
            </tr>
        }
    }

    generateRows = () => {
        if(this.props.selectable) {
            return this.props.rows.map(function(name, index) {
                let selected = this.props.columns[name].selected ? "Yes" : "";
                let primaryKey = this.props.columns[name].primaryKey ? "Yes": "";
                return <tr key={index}>
                            <td onClick={() => {this.props.select(name, 'selected'); this.makeTable();}}>{name}</td>
                            <td onClick={() => {this.props.select(name, 'selected'); this.makeTable();}}>{selected}</td>
                            <td onClick={() => {this.props.select(name, 'primaryKey'); this.makeTable();}}>{primaryKey}</td>
                        </tr>
            }.bind(this))
        } else {
            return this.props.rows.map(function(name, index) {
                return <tr key={index} onClick={(e) => this.props.select(e.target.innerText)}>
                            <td>{name}</td>
                        </tr>
            }.bind(this))
        }
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