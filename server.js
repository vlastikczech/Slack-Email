const express = require('express');

const { WebClient } = require('@slack/client');

const cors = require('cors');
const csv = require('fast-csv');
const _ = require('lodash');

const app = express();
const port = 3001
app.use(cors());

app.get('/:channelName/:tokenValue', function(req, res) {
    let channelName = req.params.channelName
    const token = req.params.tokenValue

    const web = new WebClient(token)

    const users = []
    const userData = web.channels.info({
        channel: `${channelName}`
    })
        .then((res) => {
            res.channel.members.map(el => {
                users.push(el);
            })
            return users;
        })

    const object = {}
    Promise.all([userData]).then(function(values) {
        values.map(el => {
            return Promise.all(el.map(function(user) {
                return Promise.all([web.users.info({
                    user: user
                })
                    .then((res) => {
                        object[res.user.profile.email] = res.user.profile.real_name
                        console.log(object);
                    })
                ])
            }))
                .then(function() {
                    const array = [['email', 'name']]
                    Object.keys(object).map(email => {
                        array.push([email, object[email]])
                    })
                    const string = array.map(user => {
                        return user.join(',')
                    }).join('\n')

                    res.set('Content-Type', 'text/csv')
                    res.set('Content-Disposition', `attachment;filename="${channelName}.csv"`)
                    res.send(string)
                })
        })
    })
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))