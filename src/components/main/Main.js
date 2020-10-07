import React, { Component } from 'react';
import DatabaseSelector from '../../ui/databaseSelector/DatabaseSelector';
import SubmitButton from '../../ui/submitButton/SubmitButton';
import TablesTable from '../../ui/tablesTable/TablesTable';
import BackButton from '../../ui/backButton/BackButton';

import styles from './Main.module.css';

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
        display: null,
        reset: false,
        saveSchema: null
    }

    componentDidMount() {
        let display = <div>
            <div className={styles.header}>
                <h1>Select Database</h1>
            </div>
            <DatabaseSelector
                selectDatabase={this.selectDatabase}
                selectSchema={this.selectSchema}
            />
            <SubmitButton
                submit={this.connectToDB}
                text="Get Tables"
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


    setSatellite = (e, columnName) => {
        let columns = this.state.columns;
        columns[columnName].satellite = e.target.value;
        this.setState({
            columns: columns
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
            console.log('Success: ', data);
            this.setState({
                tableNames: data.tableNames
            })
        })
        .catch(error => {
            console.error('Error: ', error)
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
            let columnNames = []
            Object.keys(data).forEach(key => {
                columns[key] = {
                    selected: false,
                    primaryKey: false,
                    satellite: null,
                    dataType: data[key]
                }
                columnNames.push(key)
            })
            this.setState({
                columns: columns,
                columnNames: columnNames
            })
        })
        .catch(error => {
            console.error('Error: ', error)
        });
    }

    addSatellite = () => {
        let data = {
            database: this.state.database,
            schema: this.state.schema,
            table: this.state.table,
            columns: this.state.columns,
            satellite: this.state.satellite,
            saveSchema: this.state.saveSchema
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
            console.log('Success: ', data);
            this.setState({
                saveSchema: data.saveSchema
            })
        })
        .catch(error => {
            console.error('Error: ', error)
        });
    }

    wakeUpVaultBot = () => {
        console.log("Waking up")
        let data = {
            schema: this.state.saveSchema
        }
        fetch('http://localhost:5001/vaultbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success: ', data);
        })
        .catch(error => {
            console.error('Error: ', error)
        })
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
                <div className={styles.header}>
                    <h1>Select Table</h1>
                </div>
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
        if (this.checkArrays(this.state.tableNames, prevState.tableNames)) {
            this.setState({
                display: <div>
                    <div className={styles.header}>
                        <h1>Select Table</h1>
                    </div>
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
        if (this.state.table !== prevState.table && this.state.table) {
            this.getColumns()
        }
        if (this.checkArrays(this.state.columnNames, prevState.columnNames)) {
            this.setState({
                display: <div>
                    <div className={styles.header}>
                        <h1>Select Columns</h1>
                        <h3>Table: {this.state.table}</h3>
                    </div>
                    <TablesTable
                        header={["Column Names", "Selected", "Primary Key", "Satellite"]}
                        rows={this.state.columnNames}
                        select={this.selectColumn}
                        selectable={true}
                        columns={this.state.columns}
                        setSatellite={this.setSatellite}
                    />
                    <BackButton
                        text="Select Table"
                        goBack={this.goBackToTableSelection}
                    />
                    <SubmitButton
                        text="Add Satellite"
                        submit={this.addSatellite}
                    />
                    <SubmitButton
                        text="Wake Up Vault Bot"
                        submit={this.wakeUpVaultBot}
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
