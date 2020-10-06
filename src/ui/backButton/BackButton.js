import React, { Component } from 'react';
import styles from './BackButton.module.css';

export default class BackButton extends Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <button onClick={this.props.goBack}>{this.props.text}</button>
            </div>
        )
    }
}