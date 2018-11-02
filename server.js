const express = require('express');
const { WebClient } = require('@slack/client');
const web = new WebClient('SLACK_ACCESS_TOKEN');

const cors = require('cors');

const fs = require('fs');
const csv = require('fast-csv');

const _ = require('lodash');

const ws = fs.createWriteStream('my.csv');


const app = express();
const port = 3001

app.use(cors());

app.get('/:channelName', function(req, res) {
    let channelName = req.params.channelName

    const users = []
    const userData = web.channels.info({
        channel: `${channelName}`
    })
        .then((res) => {
            res.channel.members.map(el => {
                users.push(el);
                console.log(el);

            })
            return users;
        })
    res.send(userData);


    const array = []
    Promise.all([userData]).then(function(values) {
        values.map(el => {
            return Promise.all(el.map(function(user) {
                return Promise.all([web.users.info({
                    user: user
                })
                    .then((res) => {
                        array.push({
                            name: res.user.profile.real_name,
                            email: res.user.profile.email
                        })
                        console.log(array);
                        return array;
                    })
                ])
            }))
            .then(function(data) {
                var newData = _.uniqBy(data, 'name:');
                newData.map(el => {
                    el.map(el => {
                        csv.
                        write((el), {
                            headers: true
                        })
                            .pipe(ws)
                    })
                })
            })
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))