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
			"For information on the food court (ONLY FOR LUNCH ON DAY OF COMPETITION), type 'foodcourt' or 'lunch' \n \n"+ 
			"For information on local restaurants, type 'local'\n \n"+ 
			"For contact information, type 'contact'\n \n"+ 
			"To see all this info again, type 'help'")

	//greetings
	} else if (text.includes("hi")) {
		sendText(sender, "Hello! I'm the ACWT Helper ChatBot! To best learn how to use me, type 'help' as a message!")
	} else if (text.includes("hello")){
		sendText(sender, "Hi! I'm a helper chatbot for the ACWT! Want to know what I can do? Type 'help' as a message!")
	} else if (text.includes("hey")){
		sendText(sender, "Hey! I'm the ACWT Chatbot! I can give you the best info on where to eat, what's going on, and who to contact! To find out more, type 'help' as a message!")
	//end greetings

	// map of venue with rings
	} else if (text == "venue"){ 
		let venueText = {text: "Here is a map of the venue:"}
		sendRequest(sender, venueText)
		sendVenueImageMessage(sender)
	//what happens on what ring throughout day
	} else if (text == "rings"){
		sendRingButtonMessage(sender, "What would you like to see? Or type 'ringall' to see EVERYTHING")
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

	//food court available (day of)
	} else if ((text == "foodcourt") || (text == "lunch")){
		sendLunch(sender)
	// 	sendText(sender, "Competition day fuel!")
	//local businesses ... pic of map with local markers? ... maybe numbers as markers?
	} else if ((text == "local") || (text.includes("hungry")) || (text.includes("food")) || (text.includes("eat")) || (text.includes("restaurant"))){
		sendLocalButtonMessage(sender, "Choose a price point!\n$ = roughly less than $15\n$$ = roughly $15 to $25\n$$$ = greater than $25")
	//price point breakdown
	} else if (text.includes("1$")){
		sendText(sender, 
					"Pamela's Diner(CASH ONLY)\nAmerican\n- Charming, retro breakfast & lunch spot for specialty crepe-hotcakes, omelets & burgers. Cash only.\n- 3703 Forbes Ave, Pittsburgh, PA 15213\n\n"+

					"Primanti Bros.\n- American\n- Pittsburgh-born counter-serve chain known for its sandwiches.\n- 3803 Forbes Ave, Pittsburgh, PA 15213\n\n"+ 

					"The Yard\n- American\n- Brick-walled bar with TVs, craft beer & pub grub, including a gourmet grilled-cheese menu.\n- 736 Bellefonte St, Pittsburgh, PA 15232\n- Alt: 100 Fifth Ave, Pittsburgh, PA 15222\n\n"+

					"Chengdu Gourmet\n- Asian\n- Basic Sichuan spot offering both traditional and American-style Chinese eats in simple surrounds.\n- 5840 Forward Ave, Pittsburgh, PA 15217\n\n"+

					"Everyday Noodles\n- Asian\n- A casual Chinese eatery specializing in noodle dishes that's known for its kitchen viewing window.\n- 5875 Forbes Ave, Pittsburgh, PA 15217\n\n"+

					"How Lee\n- Asian\n- Spartan establishment with a large menu including familiar fare & specialty Sichuan entrees.\n- 5888 Forbes Ave, Pittsburgh, PA 15217\n\n"+

					"Noodlehead(CASH ONLY)\n- Asian\n- BYOB, cash-only Thai joint featuring street-market noodles & other bites in cool, industrial digs.\n- 242 S Highland Ave, Pittsburgh, PA 15206\n\n"+

					"Klavon's Ice Cream Parlor\n- Dessert\n- Charming, old-school spot for shakes, floats & sundaes made Penn State Creamery ice cream.\n- 2801 Penn Ave, Pittsburgh, PA 15222\n\n"+

					"S&D Polish Deli\n- European\n- Simple Polish deli with traditional fare plus meats, sweets & products imported from Eastern Europe.\n- 2204 Penn Ave, Pittsburgh, PA 15222")
	} else if(text.includes("2$")){
		sendText(sender, 
					"Meat and Potatoes\n- American\n- Chic, modern gastropub making New American dinners, eclectic brunch items & inventive mixed drinks.\n- 649 Penn Ave, Pittsburgh, PA 15222\n\n"+

					"The Porch\n- American\n- Laid-back eatery with a patio for seasonal menus crafted using ingredients from local producers.\n- 221 Schenley Drive, Pittsburgh, PA 15213\n\n"+ 

					"Sichuan Gourmet\n- Asian\n- Casual Chinese eatery offering a menu of staples plus many spicy Sichuan dishes in a bright space.\n- 1900 Murray Ave, Pittsburgh, PA 15217\n\n"+

					"Hoffbrauhaus Pittsburgh\n- European\n- German brewery modeled like the Munich original has seasonal beer, Bavarian fare & costumed servers.\n- 2705 S Water St, Pittsburgh, PA 15203\n\n"+

					"Church Brew Works\n- Other\n- Former church is now a lofty space for house-brewed beers, plus a mix of pizza, pierogi & bratwurst.\n- 3525 Liberty Ave, Pittsburgh, PA 15201\n\n"+

					"täkō\n- Mexican\n- Lively taqueria with sidewalk seating serving inventive Mexican street food in chill digs.\n- 214 6th St, Pittsburgh, PA 15222")
	} else if(text.includes("3$")){
		sendText(sender, 
					"Legume\n- American\n- Sleek bistro serving seasonal, locally sourced fare, with drinks from the attached bar, Butterjoint.\n- 214 N Craig St, Pittsburgh, PA 15213\n\n"+

					"The Butcher and the Rye\n- American\n- Trendy outpost serving innovative New American cuisine & craft cocktails in a rustic-chic space.\n- 212 6th St, Pittsburgh, PA 15222s\n\n"+ 

					"Texas de Brazil\n- Brazilian\n- Upscale Brazilian eatery featuring all-you-can-eat grilled meat carved tableside & a salad bar.\n- 240 W. Station Square Drive, Suite D1, Pittsburgh, PA 15219\n\n"+

					"The Melting Pot\n- Other\n- Fondue restaurant chain offering heated pots of cheese, chocolate or broth for dipping & cooking.\n- 125 W Station Square Dr, Pittsburgh, PA 15219\n\n"+

					"Grand Concourse\n- Seafood\n- Train station turned upscale restaurant with seafood & steaks plus a more casual attached saloon.\n- 100 W Station Square Dr, Pittsburgh, PA 15219\n\n"+

					"Monterey Bay Fish Grotto\n- Seafood\n- White-tablecloth eatery & bar with panoramic riverside views offers elegantly plated seafood.\n- 1411 Grandview Ave, Pittsburgh, PA 15211")
	//pitt wushu contact stuff
	} else if (text == "contact"){
		sendText(sender, "To get in touch:\n\nE-mail: pittwushu@gmail.com\nTel: 555-555-5555")
	} else if((text == "thanks") || (text == "thank you")){
		sendText(sender, "You're welcome! You're my favorite human!")
	} else if(text.includes("i love you")) {
		sendText(sender, "WHAT IS LOVE?\nBABY, DON'T HURT ME!\nDON'T HURT ME!\nNO MORE!")
	} else if(text == "meme") {
		sendMeme(sender)	
	} else {
		sendText(sender, 
			"Sorry, I didn't recognize that input! Try typing 'help'")
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
	            "title":"$ (less than $15)",
	            "payload":"1$"
	          },
	          {
	          	"type":"postback",
	            "title":"$$ ($15 to $25)",
	            "payload":"2$"
	          },
	          {
	          	"type":"postback",
	            "title":"$$$ (over $25)",
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
				"url":"https://i.imgur.com/h6LQiPl.png"
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

function sendLunch(sender){
	let messageData = { "attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"generic",
	        "elements":[
	           {
	            "title":"Petersen Food Court (DAY OF)",
	            "image_url":"http://www.utimes.pitt.edu/wp-content/uploads/2014/06/seal.jpg",
	            "subtitle":"Click here to see what's available for lunch!",
	            "buttons":[
	              {
	                "type":"web_url",
	                "url":"https://www.pc.pitt.edu/dining/locations/petersenEvents.php",
	                "title": "View Website"
	              }              
	            ]      
	          }
	        ]
	      }
	    }
	}
	sendRequest(sender, messageData)
}

let wushuMemes = 	["https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-12/29134107_10155852780251634_897366883_n.jpg?oh=4ed630117311ed82f489fa0ddebda7b7&oe=5AB3EA45",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/s261x260/29019269_10155852777861634_2022816261_n.jpg?_nc_cat=0&oh=fcb8a22170812642f50e55885547d9aa&oe=5AB3CCF2",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/p160x160/29134838_10155852780256634_1495910984_n.jpg?_nc_cat=0&oh=3684fb47d1467616af4946e450f2e929&oe=5AB4D899",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/p235x165/29004292_10155852780261634_2022813090_n.jpg?oh=92c2083e2b9ccddf3851a027872ca725&oe=5AB3BCC0",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/p173x172/29137970_10155852780266634_437161095_n.jpg?oh=c9561f8ff8a19740939cb5fb48b1d355&oe=5AB3F63B",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/s261x260/29134750_10155852780276634_606042746_n.jpg?_nc_cat=0&oh=5e29fad0cd35cc773317a6e66b2c8dff&oe=5AB3B240",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/p173x172/29138552_10155852780281634_1290475951_n.jpg?_nc_cat=0&oh=37f910462311487fea58836ed25cc447&oe=5AB4C424",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/s261x260/29344890_10155852780286634_914066600_n.jpg?_nc_cat=0&oh=23bc1920c546155539b88a37122044db&oe=5AB3D5BF",
					"https://scontent-lga3-1.xx.fbcdn.net/v/t34.0-0/p173x172/29003887_10155852780291634_702017091_n.jpg?oh=f273af681614967d1d8396128932df39&oe=5AB3E49B"];

function sendMeme(sender){
	let url = wushuMemes[Math.floor(Math.random() * wushuMemes.length)]
	let messageData = {
		"attachment":{
			"type": "image",
			"payload":{
				"url":url
			}
		}
	}
	sendRequest(sender, messageData)
}

app.listen(app.get('port'), function(){
	console.log("Running: port")
})