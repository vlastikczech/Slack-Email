import React, { Component } from 'react';

import { WebClient } from '@slack/client'

import './App.css';


import logo from './assets/images/full-color-mark.png';



class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            channels: [],
            value: '',
            tokenValue: '',
            slackAccess: false
        }

        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleTokenChange = this.handleTokenChange.bind(this)
        this.handleTokenSubmit = this.handleTokenSubmit.bind(this)
    }

    async renderToken() {
        const web = new WebClient(this.state.tokenValue);
        let Array = [];

        let channel = web.channels.list()
            .then((res) => {
                res.channels.map(el => {
                    Array.push({channelName: el.name, channelNumber: el.id})
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
        this.fetchEmails(this.state.value, this.state.tokenValue);
        event.preventDefault();
    }

    handleTokenChange = (event) => {

        this.setState ({
            tokenValue: event.target.value
        });
    }

    handleTokenSubmit = (event) => {

        this.setState ({
            slackAccess: true
        })
        this.renderToken()
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

        let displayChannel =   <form onSubmit={this.handleTokenSubmit}>
            <div className="row">
                <div className="display-info">
                    <p className="display-text">Enter your legacy slack token. Don't have one? <a href="https://api.slack.com/custom-integrations/legacy-tokens">token</a></p>
                </div>
                <input type="text" value={this.state.token} onChange={this.handleTokenChange} placeholder="Enter your legacy slack token." />
                <input type="submit" className="btn" value="Submit"/>
            </div>

        </form>

        if (this.state.slackAccess) {
            displayChannel =  <form onSubmit={this.handleSubmit}>
                <div className="row">
                    <div className="display-info">
                        <p className="display-text">Download your cvs file in one click to extract your channel user's email.</p>
                        <select className="custom-select" value={this.state.value} onChange={this.handleChange}>
                            {displayChannelOptions}
                        </select>
                    </div>


                </div>
                <div className="row">
                    <input type="submit" className="btn" value="Download File"/>
                </div>
            </form>
        }

        return (
            <section className="section-display">
                <div className="container">
                    <div className="display">
                        <img src={logo} alt="logo" id="logo"/>

                        <h3>Slack <br/>Email Retriever</h3>

                        {displayChannel}
                    </div>

                </div>
            </section>


        );
    }

    async fetchEmails(channelName, tokenValue) {
        const url = `http://localhost:3001/${channelName}/${tokenValue}`;
        window.location.href = url
    }


}

export default App;
