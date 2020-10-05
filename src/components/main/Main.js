import React, { Component } from 'react';
import DatabaseSelector from '../../ui/databaseSelector/DatabaseSelector';
import SubmitButton from '../../ui/submitButton/SubmitButton';
import TablesTable from '../../ui/tablesTable/TablesTable';

export default class Main extends Component {
    state = {
        database: "testing_source",
        schema: "fcrb",
        tableNames: [],
        table: null,
        columnNames: [],
        selectedColumns: [],
        display: null
    }

    componentDidMount() {
        let display = <div>
            <DatabaseSelector
                selectDatabase={this.selectDatabase}
                selectSchema={this.selectSchema}
            />
            <SubmitButton connectToDB={this.connectToDB} />
            
        </div>
        this.setState({
            display: display
        })
    }

    selectDatabase = (e) => {
        this.setState({
            database: e.target.value
        })
    }

    selectSchema = (e) => {
        this.setState({
            schema: e.target.value
        })
    }

    selectTable = (e) => {
        this.setState({
            table: e.target.innerText
        })
    }

    getColumns = () => {
        let data = {
            database: this.state.database,
            schema: this.state.schema,
            table: this.state.table
        }
        console.log("Connecting...")
        fetch('http://localhost:5001/table', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            this.setState({
                columnNames: data.columnNames
            })
        })
        .catch((error) => {
            console.error('Error:', error)
        });
    }

    connectToDB = () => {
        let data = {
            database: this.state.database,
            schema: this.state.schema
        }
        console.log("Connecting...")
        fetch('http://localhost:5001/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                this.setState({
                    tableNames: data.tableNames
                })
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    }

    selectColumn = (e) => {
        let columns = this.state.selectedColumns;
        columns.push(e.target.innerText)
        this.setState({
            selectedColumns: columns
        })
    }

    checkArrays = (stateArray, prevStateArray) => {
        return JSON.stringify(stateArray.sort()) !== JSON.stringify(prevStateArray.sort())
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.checkArrays(this.state.tableNames, prevState.tableNames)) {
            this.setState({
                display: <div>
                    <TablesTable
                        header="Table Names"
                        rows={this.state.tableNames}
                        select={this.selectTable}
                    />
                </div>
                    
            })
        }
        if(this.state.table !== prevState.table) {
            this.getColumns()
        }
        if(this.checkArrays(this.state.columnNames, prevState.columnNames)) {
            this.setState({
                display: <div>
                    <TablesTable
                        header="Column Names"
                        rows={this.state.columnNames}
                        select={this.selectColumn}
                    />
                </div>
            })
        }
        console.log("STATE: ", this.state)
    }

    render() {
        return (
            <div>
               {this.state.display}
            </div>
        )
    }
}
