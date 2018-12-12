const express = require('express');
const bodyParser = require('body-parser');
const FBMessenger = require('fb-messenger');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

const messenger = new FBMessenger();

const FACEBOOK = {
    access_token: "",
    verify_token: "",
};


app.get('/', (req, res) => {
    res.send('hi');
});

app.post('/webhook', (req, res) => {
    console.log(req.body.entry[0].messaging[0].message.nlp.entities);

    const senderId = req.body.entry[0].messaging[0].sender.id;
    const text = req.body.entry[0].messaging[0].message.text;
    const URL = `https://api.giphy.com/v1/gifs/search?api_key=ndQnbCZfWnNWz4kc0Cx25vJH6OPmPIXz&q=${text}`;

    /*axios.get(URL)
        .then((result) => {
            let value = Math.floor(Math.random() * 6);            
            console.log(result.data.data[value].images.fixed_height.url);

            messenger.sendImageMessage({
                id: senderId, 
                url: result.data.data[value].images.fixed_height.url, 
                notificationType: 'REGULAR', 
                token: FACEBOOK.access_token,
            });
        }).catch((err) => {
            messenger.sendTextMessage({
                id: senderId, 
                text: 'hubo un error', 
                notificationType: 'REGULAR', 
                token: FACEBOOK.access_token,
            });
        });
    */
    const response = req.body.entry[0].messaging[0].message.nlp.entities;
    console.log('====================================');
    console.log(response);
    console.log('====================================');    
    
        
    if (response.intent && response.intent[0].confidence >= 0.90) {
        messenger.sendTextMessage({
            id: senderId, 
            text: response.intent[0].value, 
            notificationType: 'REGULAR', 
            token: FACEBOOK.access_token,
        });
    } else {
        messenger.sendTextMessage({
            id: senderId, 
            text: 'hubo un error', 
            notificationType: 'REGULAR', 
            token: FACEBOOK.access_token,
        });
    }

        
    res.send('ok');
});

app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === FACEBOOK.verify_token) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    } else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
});

app.listen(3001, () => {
    console.log(`server on port ${3001}`);
});

