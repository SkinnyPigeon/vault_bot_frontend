import React, { Component } from 'react';
import DatabaseSelector from '../../ui/databaseSelector/DatabaseSelector';
import SubmitButton from '../../ui/submitButton/SubmitButton';
import TablesTable from '../../ui/tablesTable/TablesTable';
import BackButton from '../../ui/backButton/BackButton';

export default class Main extends Component {
    state = {
        database: "testing_source",
        schema: "fcrb",
        tableNames: [],
        table: null,
        columnNames: [],
        columns: {
            placeHolder: true
        },
        satellite: "sat_object_diagnostic_details",
        display: null,
        reset: false
    }

    componentDidMount() {
        let display = <div>
            <h1>Select Database</h1>
            <DatabaseSelector
                selectDatabase={this.selectDatabase}
                selectSchema={this.selectSchema}
            />
            <SubmitButton 
                submit={this.connectToDB} 
                text="Get Table"
            />
            
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

    selectTable = (tableName) => {
        this.setState({
            table: tableName
        })
    }

    selectSatellite = (e) => {
        this.setState({
            satellite: e.target.value
        })
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
            let columns = {}
            for(let column in data.columnNames) {
                console.log(data.columnNames[column])
                columns[data.columnNames[column]] = {
                    selected: false,
                    primaryKey: false
                }
            }
            this.setState({
                columns: columns,
                columnNames: data.columnNames
            })
        })
        .catch((error) => {
            console.error('Error:', error)
        });
    }

    addSatellite = () => {
        let data = {
            database: this.state.database,
            schema: this.state.schema,
            table: this.state.table,
            columns: this.state.columns,
            satellite: this.state.satellite
        }
        console.log("Connecting...")
        fetch('http://localhost:5001/satellite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error)
            });
    }

    selectColumn = (columnName, value) => {
        let columns = this.state.columns;
        columns[columnName][value] = !columns[columnName][value];
        this.setState({
            columns: columns
        })
    }

    goBackToTableSelection = () => {
        this.setState({
            display: <div>
                <h1>Select Table</h1>
                <TablesTable
                    header={["Table Names"]}
                    rows={this.state.tableNames}
                    select={this.selectTable}
                    selectable={false}
                    columns={false}
                />
            </div>
        })
    }

    checkArrays = (stateArray, prevStateArray) => {
        return JSON.stringify(stateArray.sort()) !== JSON.stringify(prevStateArray.sort())
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.reset === nextState.reset;
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.checkArrays(this.state.tableNames, prevState.tableNames)) {
            this.setState({
                display: <div>
                    <h1>Select Table</h1>
                    <TablesTable
                        header={["Table Names"]}
                        rows={this.state.tableNames}
                        select={this.selectTable}
                        selectable={false}
                        columns={false}
                    />
                </div>
            })
        }
        if(this.state.table !== prevState.table && this.state.table) {
            this.getColumns()
        }
        if(this.checkArrays(this.state.columnNames, prevState.columnNames)) {
            this.setState({
                display: <div>
                    <h1>Select Columns</h1>
                    <h3>{this.state.table}</h3>
                    <TablesTable
                        header={["Column Names", "Selected", "Primary Key"]}
                        rows={this.state.columnNames}
                        select={this.selectColumn}
                        selectable={true}
                        columns={this.state.columns}
                        selectSatellite={this.selectSatellite}
                    />
                    <BackButton 
                        text="Select Database"
                        goBack={this.goBackToTableSelection}
                    />
                    <SubmitButton 
                        text="Add Satellite"
                        submit={this.addSatellite}
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
