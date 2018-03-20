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
			decideMessage(sender, text)
			//sendText(sender, "Text echo: \n" + text.substring(0, 100) + "\n \n lololol")
		}
		if(event.postback) {
			let text = JSON.stringify(event.postback)
			decideMessage(sender, text)
			continue
		}
	}

	res.sendStatus(200)
})

function decideMessage(sender, textInput){
	let text = textInput.toLowerCase()
	//give instructions for use
	if (text == "help"){
		sendText(sender, 
			"You asked for help!\n \n" + 
			"For information on what's happening in the rings today, type 'rings'\n \n"+ 
			"For the venue map, type 'venue'\n \n"+ 
			// "To see the current events happening, type 'schedule' \n \n"+ 
			// "To see scores, type 'scores' \n \n"+ 
			// "For information on food trucks (ONLY ON DAY OF COMPETITION), type 'foodtrucks' \n \n"+ 
			"For information on local restaurants, type 'local'\n \n"+ 
			"For contact information, type 'contact'\n \n"+ 
			"To see all this info again, type 'help'")

	//greetings
	} else if (text == "hi") {
		sendText(sender, "Hello! I'm the ACWT Helper ChatBot! To best learn how to use me, type 'help' as a message!")
	} else if (text == "hello"){
		sendText(sender, "Hi! I'm a helper chatbot for the ACWT! Want to know what I can do? Type 'help' as a message!")
	} else if (text == "hey"){
		sendText(sender, "Hey! I'm the ACWT Chatbot! I can give you the best info on where to eat, what's going on, and who to contact! To find out more, type 'help' as a message!")
	//end greetings

	// map of venue with rings/food truck locations?
	} else if (text == "venue"){ 
		let venueText = {text: "Here is a map of the venue:"}
		sendRequest(sender, venueText)
		sendVenueImageMessage(sender)
	//what happens on what ring throughout day
	} else if (text == "rings"){
		sendRingButtonMessage(sender, "What would you like to see? Or type ringall to see EVERYTHING")
	//rings
	} else if (text.includes("ringall")){
		sendText(sender, 	"Ring 1\n"+
							"Beg CQ\n"+
							"Int CQ\n"+
							"Adv CQ\n"+
							"Beg TJ\n \n"+
							"Ring 2\n"+
							"Beg NQ\n"+
							"Int NQ\n"+
							"Adv NQ\n"+
							"Int TJ\n \n"+
							"Ring 3\n"+
							"Beg Trad.\n"+
							"Int Trad.\n"+
							"Adv Trad.\n"+
							"Adv TJ")
	} else if (text.includes("ring1")){
		sendText(sender, 	"Ring 1\n"+
							"Beg CQ\n"+
							"Int CQ\n"+
							"Adv CQ\n"+
							"Beg TJ")
	} else if(text.includes("ring2")){
		sendText(sender,	"Ring 2\n"+
							"Beg NQ\n"+
							"Int NQ\n"+
							"Adv NQ\n"+
							"Int TJ")
	} else if(text.includes("ring3")){
		sendText(sender,	"Ring 3\n"+
							"Beg Trad.\n"+
							"Int Trad.\n"+
							"Adv Trad.\n"+
							"Adv TJ")
	//POTENTIAL real-time schedule... what's happening now?
	// } else if (text == "schedule"){

	// //POTENTIAL real-time scores... let's see?
	// } else if (text == "scores"){

	//local businesses ... pic of map with local markers? ... maybe numbers as markers?
	} else if ((text == "local") || (text.includes("hungry")) || (text.includes("food")) || (text.includes("eat")) || (text.includes("restaurant"))){
		sendLocalButtonMessage(sender, "Choose a price point!\n$ = roughly less than $15\n$$ = roughly $15 to $25\n$$$ = greater than $25")
	//price point breakdown
	} else if (text.includes("1$")){
		sendText(sender, "blah")
	} else if(text.includes("2$")){
		sendText(sender, "blahblah")
	} else if(text.includes("3$")){
		sendText(sender, "blahblahblah")
	//food trucks available (day of)... menus?
	// } else if (text == "foodtrucks"){
	// 	sendText(sender, "Competition day fuel!")
	//pitt wushu contact stuff
	} else if (text == "contact"){
		sendText(sender, "E-mail: pittwushu@gmail.com\nTel: 555-555-5555")
	} else {
		sendText(sender, 
			"Sorry, we didn't recognize that input! Try typing 'help'")
	}
}

function sendText(sender, text) {
	let messageData = {text: text}
	sendRequest(sender, messageData)
}

function sendRingButtonMessage(sender, text){
	let messageData = {
		"attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text": text,
	        "buttons":[
	          {
	            "type":"postback",
	            "title":"Ring 1",
	            "payload":"ring1"
	          },
	          {
	          	"type":"postback",
	            "title":"Ring 2",
	            "payload":"ring2"
	          },
	          {
	          	"type":"postback",
	            "title":"Ring 3",
	            "payload":"ring3"
	          }
	        ]
	      }
	    }
	}
	sendRequest(sender, messageData)
}

function sendLocalButtonMessage(sender, text){
	let messageData = {
		"attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text": text,
	        "buttons":[
	          {
	            "type":"postback",
	            "title":"$",
	            "payload":"1$"
	          },
	          {
	          	"type":"postback",
	            "title":"$$",
	            "payload":"2$"
	          },
	          {
	          	"type":"postback",
	            "title":"$$$",
	            "payload":"3$"
	          }
	        ]
	      }
	    }
	}
	sendRequest(sender, messageData)
}

function sendVenueImageMessage(sender){
	let messageData = {
		"attachment":{
			"type": "image",
			"payload":{
				"url":"https://i.pinimg.com/originals/fd/35/9e/fd359e342d25047aee75ebdd93fb8222.jpg"
			}
		}
	}
	sendRequest(sender, messageData)
}

function sendRequest(sender, messageData) {
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