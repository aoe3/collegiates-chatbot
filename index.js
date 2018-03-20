'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

//Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//ROUTES

app.get('/', function(req, res) {
	res.send("I am the Annual Collegiate Wushu Tournament chatbot!")
})

let token = "EAAE8KvOZCFv8BANkH83XSfCll4Wbj8epmq7yB74eRzD505sSPdv8sO2lDFhbjXravOBIDg7aXquu2yy4X6U1KQqqCF2EKBOHC3tpAAOGH8kKooWEyRrqSuLu7KQBN2hzek8fJrJfgwTAVZAdSS9bh1cUDcmZBYT6zgtGvZB1ZAgZDZD"

//Facebook

app.get('/webhook/', function(req, res) {
	if(req.query['hub.verify_token'] === "acwtbotapp") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function (req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			sendText(sender, "Text echo: \n" + text.substring(0, 100) + "\n \n lololol")
		}
	}

	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token : token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function(){
	console.log("Running: port")
})