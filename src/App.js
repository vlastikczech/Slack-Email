import React, { Component } from 'react';

import { WebClient } from '@slack/client'

import './App.css';

const web = new WebClient('xoxp-80321462342-457809939091-464794034962-f0b0a3019847c87e71832b6ac80badba');


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
        <section>
            <div className="container">
                <div className="display">
                    <h3 className="display-text">Slack Email Retriever</h3>

                    <form onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="display-info">
                                <label>Select The Slack Channel:</label>
                                <select value={this.state.value} onChange={this.handleChange}>
                                    {displayChannelOptions}
                                </select>
                            </div>


                        </div>
                        <div className="row">
                                <input type="submit" value="Submit"/>
                        </div>
                    </form>
                    <a href="../export.csv" download="export.csv">Download</a>
                </div>

            </div>
        </section>


    );
  }

  async fetchEmails(channelName) {
        const url = `http://localhost:3001/${channelName}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
  }


}

export default App;
