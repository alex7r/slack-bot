/*
 * Copyright (c) 2018. Alexandr Kosarev, @kosarev.by
 */

const Hapi=require('hapi');
const Request = require('request');

const clientId = 'DIGITS.DIGITS';
const clientSecret = 'HASH';

// Create a server with a host and port
const server=Hapi.server({
    host:'localhost',
    port:8000
});

// Add the route
server.route({
    method:'GET',
    path:'/',
    handler:function(request,h) {
        return '<a href="https://slack.com/oauth/authorize?client_id='+clientId+'&scope=commands,bot"><img alt="Add to Slack"' +
        ' height="40" width="139" src="https://platform.slack-edge.com/img/add_to_slack.png" srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" /></a>';
    }
});

server.route({
    method:'GET',
    path:'/command',
    handler:function(request,h) {
        return 'Your ngrok tunnel is up and running!';
    }
});

server.route({
    method:'GET',
    path:'/oauth/',
    handler:function(req,h) {
        if(!req.query.code){
            let data = {"Error": "Looks like we're not getting code."};
            return h.response(data).code(500);
        }else{
            return new Promise(function(resolve, reject) {
                "use strict";
                Request({
                    url: 'https://slack.com/api/oauth.access',
                    qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
                    method: 'GET',
                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        reject(error)
                    } else {
                        resolve(h.response(storeBotData(JSON.parse(body))));
                    }
                });
            });
        }
    }
});

function storeBotData(data){
    "use strict";
    let bot = data.bot;
    console.log(data);
    let message_count = 0;
    Request({
        url:'https://slack.com/api/chat.postMessage',
        qs: {
            token: bot.bot_access_token,
            channel: data.user_id,
            text: "I'm down for whatever",
            as_user: true
        },
        method: 'POST'
    });
    let intervalHolder = setInterval(()=>{
        message_count++;
        Request({
            url:'https://slack.com/api/chat.postMessage',
            qs: {
                token: bot.bot_access_token,
                channel: data.user_id,
                text: "I'm sending message #"+message_count
            },
            method: 'POST'
        });
        if(message_count>=20){
            clearInterval(intervalHolder);
        }
    },5000);
    return bot;
}

// Start the server
async function start() {
    try {
        await server.start();
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
    console.log('Server running at:', server.info.uri);
};

start();
