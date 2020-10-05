import React, { Component } from 'react';
import Table from '../../ui/table/Table';
import DatabaseSelector from '../../ui/databaseSelector/DatabaseSelector';
import SubmitButton from '../../ui/submitButton/SubmitButton';

// import styles from './Main.module.css';

export default class Main extends Component {
    state = {
        database: "testing_source",
        schema: "fcrb",
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

    // getTable = () => {
    //     console.log("Getting table...")
    //     let data = {
    //         table: null
    //     }
    // }

    connectToDB = () => {
        let data = {
            database: this.props.database,
            schema: this.props.schema
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
                tables: data
            })
            this.showTable();  
        })
        .catch((error) => {
            console.error('Error:', error)
        });
    }

    componentDidUpdate() {
        console.log(this.state)
    }


    render() {
        return (
            <div>
                Main
                <DatabaseSelector 
                    selectDatabase={this.selectDatabase}
                    selectSchema={this.selectSchema}
                />
                <SubmitButton getTable={this.getTable}/>
                <Table />
            </div>
        )
    }
}
