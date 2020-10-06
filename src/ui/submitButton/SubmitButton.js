import React, { Component } from 'react';
import styles from './SubmitButton.module.css';

export default class SubmitButton extends Component {
    render() {
        return (
            <div className={styles.wrapper}>
                <button
                    onClick={this.props.submit}
                >{this.props.text}
                </button>
            </div>
        )
    }
}