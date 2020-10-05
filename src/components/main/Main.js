import React, { Component } from 'react';
import DatabaseSelector from '../../ui/databaseSelector/DatabaseSelector';
import SubmitButton from '../../ui/submitButton/SubmitButton';
import TablesTable from '../../ui/tablesTable/TablesTable';

export default class Main extends Component {
    state = {
        database: "testing_source",
        schema: "fcrb",
        tableNames: null,
        table: null,
        columns: null,
        selectedColumns: null,
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
        console.log(data)
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

    componentDidUpdate() {
        if(this.state.table) {
            this.getColumns();
        }
        console.log(this.state);
    }


    render() {
        return (
            <div>
                <DatabaseSelector
                    selectDatabase={this.selectDatabase}
                    selectSchema={this.selectSchema}
                />
                <SubmitButton connectToDB={this.connectToDB} />
                <TablesTable
                    tableNames={this.state.tableNames}
                    selectTable={this.selectTable}
                />
            </div>
        )
    }
}
