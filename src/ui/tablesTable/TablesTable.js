import React, { Component } from 'react';
import styles from './TablesTable.module.css';
const _ = require('lodash');

export default class TablesTable extends Component {

    state = {
        table: null,
        columns: {},
        list: []
    }

    componentDidMount() {
        console.log("MOUNTING")
        this.makeTable()
    }

    componentWillUnmount() {
        console.log("UNMOUNTING")
        this.setState({
            table: null,
            columns: {},
            list: []
        })
    }

    componentDidUpdate(prevProps, prevState) {
        console.log("PROPS: ", this.props)
        if(JSON.stringify(this.props.rows.sort()) !== JSON.stringify(prevProps.rows.sort())) {
            this.setState({
                table: null,
                columns: {},
                list: []
            })
            this.makeTable();
        }
        if(!_.isEqual(this.props.columns, prevProps.columns)) {
            this.setState({
                table: null,
                columns: {},
                list: []
            })
            this.makeTable();
        }
        if(!_.isEqual(this.state.list, prevState.list)) {
            this.makeTable()
        }
    }

    makeTable = () => {
        let header = this.generateHeader();
        let rows = this.generateRows();
        let table = <div>
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
                <th>{this.props.header[3]}</th>
            </tr>
        } else {
            return <tr key={123}>
                <th>{this.props.header[0]}</th>
            </tr>
        }
    }

    updateList = (e) => {
        let list = this.state.list;
        if(!list.includes(e.target.value) && e.target.value !== "") {
            list.push(e.target.value)
            this.setState({
                list: list
            })
            this.makeTable()
        }
        console.log("TABLE STATE: ", this.state)
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
                            <td>
                                <input 
                                    onChange={(e) => this.props.setSatellite(e, name)}
                                    className={styles.satInput} 
                                    type="text"
                                    onBlur={this.updateList}
                                    list="satellites"
                                />
                                <datalist id="satellites">
                                    {this.state.list.map((option, key) => {
                                        return <option key={key} value={option}>{option}</option>
                                    })}
                                </datalist>
                            </td>
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