import React, { Component } from 'react';

import { WebClient } from '@slack/client'

import logo from './logo.svg';
import './App.css';

const fs = require('fs');
const csv = require('fast-csv');

const _ = require('lodash');


const web = new WebClient('SLACK_ACCESS_TOKEN');



class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            channels: [],
            value: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    componentDidMount() {
        let Array = [];

        let channel = web.channels.list()
            .then((res) => {
                res.channels.map(el => {
                    Array.push( {channelName: el.name, channelNumber: el.id} )
                });
                return Array
            })
            .catch(console.error);

        const data = Promise.all([channel]).then(function (values) {
            return values.map(el => {
                return el;
            })
        }).then((result) => this.setState({
            channels: [...result]
        }));
    }

    handleChange = (event) => {
        this.setState ({
            value: event.target.value
        });
    }

    handleSubmit = (event) => {
        console.log(this.state.value);
        this.fetchEmails(this.state.value);
        event.preventDefault();
    }




  render() {
    const displayChannelOptions = this.state.channels.map(channel => {
            return channel.map(el =>
                (
                    <option value={el.channelNumber}>{el.channelName}</option>
                )
            )
        }
    )

    return (
        <form onSubmit={this.handleSubmit}>
            <label>Select the Slack Channel</label>
            <select value={this.state.value} onChange={this.handleChange}>
                {displayChannelOptions}
            </select>
            <input type="submit" value="Submit"/>
        </form>
    );
  }

  async fetchEmails(channelName) {
        const url = `http://localhost:3001/${channelName}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(function(data) {
            console.log(data);
        })
  }

}

export default App;
