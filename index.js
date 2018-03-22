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
		}
		if(event.postback) {
			let text = JSON.stringify(event.postback)
			decideMessage(sender, text)
			continue
		}
	}

	res.sendStatus(200)
})

//Beginner
let begChangquan =
"Female Changquan\n\n"+
"- Janet Abou Elias\n"+
"- Shyanne Amoyo\n"+
"- Michelle Chen\n"+
"- Jin Yun Chow\n"+
"- Victoria Crevoisier\n"+
"- Jamie Evely\n"+
"- Elena Felix\n"+
"- Bryanna Geiger\n"+
"- Camryn Gray\n"+
"- Olivia Guo\n"+
"- Elissa He\n"+
"- Xuelin Hong\n"+
"- Christine Hwang\n"+
"- Olivia Kuziel\n"+
"- Claire Lee\n"+
"- Janette Levin\n"+
"- Jo Lin\n"+
"- Tian Low\n"+
"- Jessica Luo\n"+
"- Deborah Ma\n"+
"- Sara Moore\n"+
"- Janet Nguyen\n"+
"- Michelle Nguyen\n"+
"- Christine Ou\n"+
"- Cj Rogers\n"+
"- Shannon Tsang\n"+
"- Claire Tsau\n"+
"- Jennifer Tsui\n"+
"- Emily Vick\n"+
"- Claire Weber\n"+
"- Unique Wei\n"+
"- Alexis Weyh\n"+
"- Helen Xu\n"+
"- Doris Xu\n"+
"- Dielai Yang\n"+
"- Gabrianna Zacharias\n"+
"- Kelly Zhang\n\n\n"+

"Male Changquan\n\n"+
"- Kyle Chan\n"+
"- Benjamin Chen\n"+
"- Lucas Cheng\n"+
"- Arie Dash\n"+
"- Nutong Her\n"+
"- Bienvenido Hernandez\n"+
"- Julian Hodge\n"+
"- Justin Lu\n"+
"- William Lund\n"+
"- Kevin Marston\n"+
"- Simon Nguyen\n"+
"- Allen Peng\n"+
"- Francis Poon\n"+
"- Dylan Sanfilippo\n"+
"- Christopher Tran\n"+
"- Everett White\n"+
"- Michael Yeh\n\n\n"

let begNanquan =
"Female Nanquan\n\n"+
"- Olivia Kuziel\n"+
"- Sara Moore\n"+
"- Samantha Ono\n"+
"- Unique Wei\n"+
"- Alexis Weyh\n\n\n"+

"Male Nanquan\n\n"+
"- Lucas Verde\n\n\n"

let beg24Taiji =
"Female 24 Taiji\n\n"+
"- Jin Yun Chow\n"+
"- Jo Lin\n"+
"- Jessica Luo\n\n\n"+

"Male 24 Taiji\n\n"+
"- Arie Dash\n"+
"- Kevin Marston\n\n\n"

let begOpenYang =
"Female Open Yang\n\n"+
"- Deborah Ma\n\n\n"

let begTradOpenBH =
"Female Traditional Open Barehand\n\n"+
"- Shyanne Amoyo\n"+
"- Olivia Guo\n"+
"- Shannon Tsang\n"+
"- Claire Tsau\n"+
"- Unique Wei\n\n\n"+

"Male Traditional Open Barehand\n\n"+
"- Justin Lu\n"+
"- Allen Peng\n\n\n"

let begBroadsword =
"Female Broadsword\n\n"+
"- Janet Abou Elias\n"+
"- Deborah Ma\n"+
"- Cj Rogers\n"+
"- Claire Tsau\n"+
"- Gabrianna Zacharias\n\n\n"+

"Male Broadsword\n\n"+
"- Robin Calvo\n"+
"- William Lund\n"+
"- Lucas Verde\n"+
"- Everett White\n\n\n"

let begStraightsword =
"Female Straightsword\n\n"+
"- Olivia Guo\n"+
"- Lillian Lee\n"+
"- Janet Nguyen\n"+
"- Michelle Nguyen\n"+
"- Kelly Zhang\n\n\n"+

"Male Straightsword\n\n"+
"- Allen Peng"

let begOtherWeapon =
"Female Other Weapon\n\n"+
"- Samantha Ono\n\n\n"

let begStaff =
"Female Staff\n\n"+
"- Janet Abou Elias\n"+
"- Bryanna Geiger\n"+
"- Christine Hwang\n"+
"- Janette Levin\n"+
"- Shannon Tsang\n"+
"- Claire Weber\n"+
"- Gabrianna Zacharias\n\n\n"+

"Male Staff\n\n"+
"- Kyle Chan\n"+
"- Benjamin Chen\n"+
"- Lucas Cheng\n"+
"- Justin Lu\n"+
"- Simon Nguyen\n"+
"- Francis Poon\n"+
"- Christopher Tran\n"+
"- Michael Yeh\n\n\n"

let begTradShortWeapon =
"Male Traditional Short Weapon\n\n"+
"- Simon Nguyen\n\n\n"

//Intermediate
let intChangquan =
"Female Changquan\n\n"+
"- Mekenzie Dyer\n"+
"- Winni Gao\n"+
"- Kimberly Gomez\n"+
"- Audrey Gunawan\n"+
"- Annie Hanichak\n"+
"- Yong-yi Hu\n"+
"- Tiffany Hwu\n"+
"- Karen Kuang\n"+
"- Julia Leung\n"+
"- Melodee Li\n"+
"- Kathie Lin\n"+
"- Kristi Lin\n"+
"- Adanna Liu\n"+
"- Sara Ng\n"+
"- Annie Shi\n"+
"- Michelle Tan\n"+
"- Michelle Tu\n"+
"- Jasmine Wong\n"+
"- Rebecca Yap\n"+
"- Erika Yu\n"+
"- Lisa Yu\n"+
"- Kelly Zhang\n"+
"- Jessica Zhu\n\n\n"+

"Male Changquan\n\n"+
"- Akshara Aditya\n"+
"- Chinmaya Aditya\n"+
"- Danny Be\n"+
"- Kenneth Chen\n"+
"- Brian Cheng\n"+
"- Ethan Devara\n"+
"- Davin Devara\n"+
"- Carlos Estrada\n"+
"- Ethan Green\n"+
"- Bumjoon Kim\n"+
"- Simon Lee\n"+
"- Alden Liu\n"+
"- Connor Maples\n"+
"- Haejin Park\n"+
"- Erick Partida\n"+
"- Varun Singh\n"+
"- Stuart Sy\n"+
"- Ryan Wang\n"+
"- Henderson Wong\n"+
"- Joshua Ya\n"+
"- Robert Yang\n"+
"- Tommy Yang\n\n\n"

let intNanquan =
"Female Nanquan\n\n"+
"- Annmarie Cong\n"+
"- Kimberly Gomez\n"+
"- Shirley Mach\n"+
"- Jasmine Pham\n\n\n"+

"Male Nanquan\n\n"+
"- John Caldas\n"+
"- Alexandre Gunnerson\n"+
"- Jeffrey Guo\n"+
"- John Maclean\n"+
"- Noah Mastruserio\n"+
"- Vincent Ngo\n"+
"- Mohammad Ullah\n"+
"- Eric Wang\n"+
"- Anthony Wang\n\n\n"

let intOpenBH =
"Female Open Barehand\n\n"+
"- Jae Hee Jang\n\n\n"

let int24Taiji =
"Female 24 Taiji\n\n"+
"- Annie Hanichak\n"+
"- Melodee Li\n"+
"- Adanna Liu\n"+
"- Sara Ng\n"+
"- Annie Shi\n"+
"- Erika Yu\n\n\n"

let intOpenTaiji =
"Female Open Taiji\n\n"+
"- Julie Wang\n\n\n"

let intOpenChen =
"Male Open Chen\n\n"+
"- Carlos Estrada\n\n\n"

let int42Fist =
"Female 42 Fist\n\n"+
"- Erika Yu\n\n\n"

let intTradOpenBH =
"Female Traditional Open Barehand\n\n"+
"- Jasmine Chen\n"
"- Sunny Chiu\n"
"- Clarity Chua\n"
"- Karen Kuang\n"
"- Jennie Wang\n"
"- Julie Wang\n"
"- Lisa Yu\n\n\n"+

"Male Traditional Open Barehand\n\n"+
"- Akshara Aditya\n"+
"- Simon Lee\n"+
"- Vincent Ngo\n"+
"- Henderson Wong\n\n\n"

let intBroadsword =
"Female Broadsword\n\n"+
"- Karen Kuang\n"+
"- Kristi Lin\n"+
"- Katie Zhao\n\n\n"+

"Male Broadsword\n\n"+
"- Chinmaya Aditya\n"+
"- Danny Be\n"+
"- Carlos Estrada\n"+
"- Mitchell Levasseur\n"+
"- Stuart Sy\n"+
"- Anthony Wang\n"+
"- Joshua Ya\n\n\n"

let intStraightsword =
"Female Straightsword\n\n"+
"- Winni Gao\n"+
"- Annie Hanichak\n"+
"- Melodee Li\n"+
"- Adanna Liu\n"+
"- Melanie Ngo\n"+
"- Annie Shi\n"+
"- Sharon Shu\n"+
"- Jasmine Wong\n"+
"- Rebecca Yap\n\n\n"+

"Male Straightsword\n\n"+
"- Kenneth Chen\n"+
"- Haejin Park\n"+
"- Ryan Wang\n\n\n"

let intNandao =
"Male Nandao\n\n"+
"- Noah Mastruserio\n"+
"- Mohammad Ullah\n\n\n"

let intOtherWeapon =
"Female Other Weapon\n\n"+
"- Tiffany Hwu\n"+
"- Shirley Mach\n"+
"- Vivienne Nguyen\n"+
"- Sharon Shu\n\n\n"+

"Male Other Weapon\n\n"+
"- Henderson Wong\n\n\n"

let intStaff ="Female Staff\n\n"+
"- Tiffany Hwu\n"+
"- Karen Kuang\n\n\n"+

"Male Staff\n\n"+
"- Ethan Green\n"+
"- Kwynn Johnson\n\n\n"

let intSpear =
"Female Spear\n\n"+
"- Annmarie Cong\n"+
"- Julia Leung\n"+
"- Michelle Tu\n\n\n"+

"Male Spear\n\n"+
"- Kenneth Chen\n"+
"- Ryan Wang\n\n\n"

let intSouthernStaff =
"Female Southern Staff\n\n"+
"- Jasmine Wong\n\n\n"+

"Male Southern Staff\n\n"+
"- John Caldas\n"+
"- Eric Wang\n\n\n"

let intTradLongWeapon =
"Female Traditional Long Weapon\n\n"+
"- Lisa Yu\n\n\n"+

"Male Traditional Long Weapon\n\n"+
"- Erick Partida\n"+
"- Eric Wang\n\n\n"

let intTradShortWeapon =
"Female Traditional Short Weapon\n\n"+
"- Sunny Chiu\n"+
"- Clarity Chua\n"+
"- Kristi Lin\n"+
"- Kelly Zhang\n\n\n"+

"Male Traditional Short Weapon\n\n"+
"- Simon Lee\n\n\n"

//Advanced
let advChangquanNandu =
"Male Changquan(nandu)\n\n"+
"- Patrick Moua\n"+
"- Tim Wang\n\n\n"

let advChangquan =
"Female Changquan\n\n"+
"- Rebecca Chinn\n"+
"- Caitlin Escudero\n"+
"- Emily Fan\n"+
"- Crystal Huang\n"+
"- Gwyneth Huynh\n"+
"- Bridget Keeney\n"+
"- Alyssa Lo\n"+
"- Kaitlyn Trinh\n"+
"- Joy Zeng\n"+
"- Daisy Zheng\n\n\n"+

"Male Changquan\n\n"+
"- Jeffson Atienza\n"+
"- Mario Caballero\n"+
"- Oey Chang\n"+
"- Chuan Chen\n"+
"- Dominic Chow\n"+
"- Eric Fu\n"+
"- Jason Hui\n"+
"- Connor Hum\n"+
"- Philip Hwang\n"+
"- Christopher Johnson\n"+
"- Chi Tun Lam\n"+
"- Winston Lee\n"+
"- Tianming Li\n"+
"- Jonathan Li\n"+
"- Daniel Liang\n"+
"- Xian Kai Ng\n"+
"- Khang Nguyen\n"+
"- Angel Pan\n"+
"- Erik Song\n"+
"- Howard Wang\n"+
"- Alexander Wu\n"+
"- Robert Yu\n"+
"- Albert Zhang\n"+
"- Ryan Zheng\n"+
"- Jemmy Zhou\n"+
"- Jason Zou\n\n\n"

let advNanquan ="Female Nanquan\n\n"+
"- Sabrina Chiang"+
"- Queenie Li\n\n\n"+

"Male Nanquan\n\n"+
"- Darren Deng\n\n\n"

let advOpenBH =
"Male Open Barehand\n\n"+
"- Robert Yu\n\n\n"

let adv24Taiji =
"Female 24 Taiji\n\n"+
"- Gina Bao\n"+
"- Marianne Dang\n"+
"- Amy Pribadi\n\n\n"+

"Male 24 Taiji\n\n"+
"- Kevin Chen\n"+
"- Michael Fang\n"+
"- Jonathan Li\n"+
"- Richard Nguyen\n"+
"- Ying Hong Tham\n\n\n"

let advOpenYang =
"Male Open Yang\n\n"+
"- William Du\n"+
"- Ethyn Leong\n\n\n"

let advOpenChen =
"Female Open Chen\n\n"+
"- Gina Bao\n"+
"- Marianne Dang\n"+
"- Amy Pribadi\n"+
"- Dimei Wu\n\n\n"+

"Male Open Chen\n\n"+
"- William Du\n"+
"- Michael Fang\n"+
"- Philip Hwang\n"+
"- Ying Hong Tham\n\n\n"

let adv42Fist =
"Female 42 Fist\n\n"+
"- Marianne Dang]n"+
"- Amy Pribadi\n\n\n"+

"Male 42 Fist\n\n"+
"- Michael Fang\n"+
"- Ying Hong Tham\n\n\n"

let advInternalOpenFist =
"Female Internal Open Fist\n\n"+
"- Cecilia Springer\n\n\n"+

"Male Internal Open Fist\n\n"+
"- Richard Nguyen\n\n\n"

let advTradOpenBH =
"Female Traditional Open Barehand\n\n"+
"- Rebecca Chinn\n"+
"- Cecilia Springer\n\n\n"+

"Male Traditional Open Barehand\n\n"+
"- Oey Chang\n"+
"- Connor Hum\n"+
"- Kristian Koeser\n"+
"- Winston Lee\n"+
"- Alexander Lu\n"+
"- Linfeng Wu\n\n\n"

let advBroadsword =
"Female Broadsword\n\n"+
"- Zoe Chan\n"+
"- Sabrina Chiang\n"+
"- Rebecca Chinn\n"+
"- Irene Javier\n"+
"- Queenie Li\n"+
"- Michelle Sit\n"+
"- Kaitlyn Trinh\n"+
"- Daisy Zheng\n\n\n"+

"Male Broadsword\n\n"+
"- Jeffson Atienza\n"+
"- Oey Chang\n"+
"- Chuan Chen\n"+
"- Wesley Huie\n"+
"- Jonathan Li\n"+
"- Daniel Liang\n"+
"- Khang Nguyen\n"+
"- Erik Song\n"+
"- Howard Wang\n"+
"- Alexander Wu\n"+
"- Jason Zou\n\n\n"

let advStraightsword =
"Female Straightsword\n\n"+
"- Kasey Chan\n"+
"- Emily Fan\n"+
"- Hannah Ho\n"+
"- Gwyneth Huynh\n"+
"- Bridget Keeney\n"+
"- Alyssa Lo\n"+
"- Dimei Wu\n"+
"- Emily Yang\n"+
"- Joy Zeng\n\n\n"+

"Male Straightsword\n\n"+
"- Mario Caballero\n"+
"- Kevin Chen\n"+
"- Dominic Chow\n"+
"- William Du\n"+
"- Irwin Hui\n"+
"- Christopher Johnson\n"+
"- Chi Tun Lam\n"+
"- Alexander Lu\n"+
"- Xian Kai Ng\n"+
"- Jason Tang\n"+
"- Tim Wang\n"+
"- Robert Yu\n"+
"- Ryan Zheng\n"+
"- Jemmy Zhou\n\n\n"

let adv42Sword =
"Female 42 Sword\n\n"+
"- Amy Pribadi\n"+
"- Dimei Wu\n\n\n"+

"Male 42 Sword\n\n"+
"- Ying Hong Tham\n\n\n"

let advTaijiWeapon =
"Female Taiji Weapon\n\n"+
"- Gina Bao\n"+
"- Marianne Dang\n\n\n"+

"Male Taiji Weapon\n\n"+
"- William Du\n"+
"- Ethyn Leong\n"+
"- Richard Nguyen\n\n\n"

let advOtherWeapon =
"Female Other Weapon\n\n"+
"- Zoe Chan\n\n\n"+

"Male Other Weapon\n\n"+
"- Kevin Chen\n"+
"- Irwin Hui\n"+
"- Winston Lee\n"+
"- Linfeng Wu\n\n\n"

let advStaff =
"Female Staff\n\n"+
"- Rebecca Chinn\n"+
"- Bridget Keeney\n"+
"- Queenie Li\n\n\n"+

"Male Staff\n\n"+
"- Jeffson Atienza\n"+
"- Oey Chang\n"+
"- Chuan Chen\n"+
"- Connor Hum\n"+
"- Winston Lee\n"+
"- Tianming Li\n"+
"- Daniel Liang\n"+
"- Patrick Moua\n"+
"- Khang Nguyen\n"+
"- Brian Tran\n"+
"- Ryan Zheng\n"+
"- Jason Zou\n\n\n"

let advSpear =
"Female Spear\n\n"+
"- Kasey Chan\n"+
"- Emily Fan\n"+
"- Alyssa Lo\n"+
"- Emily Yang\n\n\n"+

"Male Spear\n\n"+
"- Irwin Hui\n"+
"- Kristian Koeser\n"+
"- Jason Tang\n"+
"- Robert Yu\n"+
"- Jemmy Zhou\n\n\n"

let advSouthernStaff =
"Male Southern Staff\n\n"+
"- Darren Deng\n\n\n"

let advLongWeapon =
"Female Long Weapon\n\n"+
"- Cecilia Springer\n\n\n"

let advTradShortWeapon =
"Female Traditional Short Weapon\n\n"+
"- Michelle Chin\n"+
"- Cecilia Springer\n\n\n"+

"Male Traditional Short Weapon\n\n"+
"- Alexander Wu\n\n\n"

let advTradSoftWeapon =
"Female Traditional Soft Weapon\n\n"+
"- Queenie Li\n\n\n"+

"Male Traditional Soft Weapon\n\n"+
"- Eric Fu\n\n\n"

//greetings
let greetings =["Hello! I'm the ACWT Helper ChatBot! To best learn how to use me, type 'help' as a message!",
			"Hi! I'm a helper chatbot for the ACWT! Want to know what I can do? Type 'help' as a message!",
			"Hey! I'm the ACWT Chatbot! I can give you the best info on where to eat, what's going on, and who to contact! To find out more, type 'help' as a message!"]

function decideMessage(sender, textInput){
	let text = textInput.toLowerCase()
	//give instructions for use
	if ((text == "help") || (text.includes("halp")) || (text.includes("help"))){
		sendText(sender, 
			"You asked for help!\n\n" + 
			"- For ring info, type 'rings'\n\n"+ 
			"- For event info, type 'events', 'beg', 'int', or 'adv'\n\n"+
			"- For the venue map, type 'venue'\n\n"+ 
			// "To see scores, type 'scores' \n \n"+ 
			"- For the food court (ONLY FOR LUNCH ON DAY OF COMPETITION), type 'foodcourt' or 'lunch'\n\n"+ 
			"- For local restaurants, type 'local'\n\n"+ 
			"- For contact information, type 'contact'\n\n"+ 
			"- To see all this info again, type 'help'")

	//greetings
	} else if ((text.includes("hi")) || (text.includes("hola")) || (text.includes("aloha")) || (text.includes("konichiwa")) || 
				(text.includes("hello")) || (text.includes("holla")) || (text.includes("bonjour")) || (text.includes("ni hao")) || 
				(text.includes("sup")) || (text.includes("hey")) || (text.includes("hallo")) || (text.includes("ciao")) || 
				(text.includes("ello")) || (text.includes("yo"))){
		sendText(sender, greetings[Math.floor(Math.random() * greetings.length)])
		//end greetings
	} else if ((text.includes"yes")&&("coming")){
		sendText(sender, "Would you like a map of the venue? If yes, type 'venue'")
	} else if ((text.includes"no")&&("coming")){
		sendText(sender, "Okay. I'm sorry to hear that. We will remove you from the lineup")
	} else if (text == "schedule"){ 
		sendText(sender, "Ring 1: Beginner Changquan\nRing2: Beginner Nanquan\nRing 3: Beginner 24 Taiji(starting soon!)")
	// map of venue with rings
	} else if (text == "venue"){ 
		let venueText = {text: "Here is a map of the venue:"}
		sendRequest(sender, venueText)
		sendVenueImageMessage(sender)
	} else if (text.includes("when")){
		sendText(sender, "The 22nd Annual Collegiate Wushu Tournament is April 7th, 2018.")
	} else if ((text.includes("where")) || (text.includes("location"))){
		sendText(sender, "The 22nd Annual Collegiate Wushu Tournament is being held at Fitzgeral Fieldhouse in Pittsburgh, PA")
	//view events
	} else if (text.includes("events")){
		sendText(sender, "Please type 'beg', 'int', 'adv', 'beginner', 'intermediate', or 'advanced' to continue to that category.")
	} else if ((text == "beg") || (text == "beginner")){
		sendBeginner(sender)
	} else if ((text == "int") || (text == "intermediate")){
		sendIntermediate(sender)
	} else if ((text == "adv") || (text == "advanced")){
		sendAdvanced(sender)
	} else if (text.includes("begchangquan")){
	sendText(sender, begChangquan)	
	} else if (text.includes("begnanquan")){
		sendText(sender, begNanquan)	
	} else if (text.includes("beg24taiji")){
		sendText(sender, beg24Taiji)	
	} else if (text.includes("begopenyang")){
		sendText(sender, begOpenYang)	
	} else if (text.includes("begtradopenbh")){
		sendText(sender, begTradOpenBH)	
	} else if (text.includes("begbroadsword")){
		sendText(sender, begBroadsword)	
	} else if (text.includes("begstraightsword")){
		sendText(sender, begStraightsword)	
	} else if (text.includes("begotherweapon")){
		sendText(sender, begOtherWeapon)	
	} else if (text.includes("begstaff")){
		sendText(sender, begStaff)	
	} else if (text.includes("begtradshortweapon")){
		sendText(sender, begTradShortWeapon)	
	} else if (text.includes("intchangquan")){
		sendText(sender, intChangquan)	
	} else if (text.includes("intnanquan")){
		sendText(sender, intNanquan)	
	} else if (text.includes("intopenbh")){
		sendText(sender, intOpenBH)	
	} else if (text.includes("int24taiji")){
		sendText(sender, int24Taiji)	
	} else if (text.includes("intopentaiji")){
		sendText(sender, intOpenTaiji)	
	} else if (text.includes("intopenchen")){
		sendText(sender, intOpenChen)	
	} else if (text.includes("int42fist")){
		sendText(sender, int42Fist)	
	} else if (text.includes("inttradopenbh")){
		sendText(sender, intTradOpenBH)	
	} else if (text.includes("intbroadsword")){
		sendText(sender, intBroadsword)	
	} else if (text.includes("intstraightsword")){
		sendText(sender, intStraightsword)	
	} else if (text.includes("intnandao")){
		sendText(sender, intNandao)	
	} else if (text.includes("intotherweapon")){
		sendText(sender, intOtherWeapon)	
	} else if (text.includes("intstaff")){
		sendText(sender, intStaff)	
	} else if (text.includes("intspear")){
		sendText(sender, intSpear)	
	} else if (text.includes("intsouthernstaff")){
		sendText(sender, intSouthernStaff)	
	} else if (text.includes("inttradlongweapon")){
		sendText(sender, intTradLongWeapon)	
	} else if (text.includes("inttradshortweapon")){
		sendText(sender, intTradShortWeapon)	
	} else if (text.includes("advchangquannandu")){
		sendText(sender, advChangquanNandu)	
	} else if (text.includes("advchangquan")){
		sendText(sender, advChangquan)	
	} else if (text.includes("advnanquan")){
		sendText(sender, advNanquan)	
	} else if (text.includes("advopenbh")){
		sendText(sender, advOpenBH)	
	} else if (text.includes("adv24taiji")){
		sendText(sender, adv24Taiji)	
	} else if (text.includes("advopenyang")){
		sendText(sender, advOpenYang)	
	} else if (text.includes("advopenchen")){
		sendText(sender, advOpenChen)	
	} else if (text.includes("adv42fist")){
		sendText(sender, adv42Fist)	
	} else if (text.includes("advinternalopenfist")){
		sendText(sender, advInternalOpenFist)	
	} else if (text.includes("advtradopenbh")){
		sendText(sender, advTradOpenBH)	
	} else if (text.includes("advbroadsword")){
		sendText(sender, advBroadsword)	
	} else if (text.includes("advstraightsword")){
		sendText(sender, advStraightsword)	
	} else if (text.includes("adv42sword")){
		sendText(sender, adv42Sword)	
	} else if (text.includes("advtaijiweapon")){
		sendText(sender, advTaijiWeapon)	
	} else if (text.includes("advotherweapon")){
		sendText(sender, advOtherWeapon)	
	} else if (text.includes("advstaff")){
		sendText(sender, advStaff)	
	} else if (text.includes("advspear")){
		sendText(sender, advSpear)	
	} else if (text.includes("advsouthernstaff")){
		sendText(sender, advSouthernStaff)	
	} else if (text.includes("advlongweapon")){
		sendText(sender, advLongWeapon)	
	} else if (text.includes("advtradshortweapon")){
		sendText(sender, advTradShortWeapon)	
	} else if (text.includes("advtradsoftweapon")){
		sendText(sender, advTradSoftWeapon)	
	} else if ((text.includes("beg")) || (text.includes("beginner"))){
		sendBeginner(sender)
	} else if ((text.includes("int")) || (text.includes("intermediate"))){
		sendIntermediate(sender)
	} else if ((text.includes("adv")) || (text.includes("advanced"))){
		sendAdvanced(sender)
	//end events

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
	//	sendText(sender, "Ring 1: event1\nRing 2: event2\nRing 3: event3")
	// //POTENTIAL real-time scores... let's see?
	// } else if (text == "scores"){

	//food court available (day of)
	} else if ((text == "foodcourt") || (text == "lunch") || (text == "food court")){
		sendLunch(sender)
		let lunchText = {text: "The food court will be open from 11 A.M. to 6 P.M. ONLY on the day of the competition!\n\nThe food court is located at 3719 Terrace Street, down the escalators!"}
		sendRequest(sender, lunchText)
	//local businesses ... pic of map with local markers? ... maybe numbers as markers?
	} else if ((text == "local") || (text.includes("hungry")) || (text.includes("food")) || (text.includes("eat")) || (text.includes("restaurant"))){
		sendLocalButtonMessage(sender, "Choose a price point!\n$ = roughly less than $15\n$$ = roughly $15 to $25\n$$$ = greater than $25")
	//price point breakdown 
	} else if((text.includes("3$")) || (text.includes("$$$"))){
		sendText(sender, 
					"Legume\n- American\n- Sleek bistro serving seasonal, locally sourced fare, with drinks from the attached bar, Butterjoint.\n- 214 N Craig St, Pittsburgh, PA 15213\n\n"+

					"The Butcher and the Rye\n- American\n- Trendy outpost serving innovative New American cuisine & craft cocktails in a rustic-chic space.\n- 212 6th St, Pittsburgh, PA 15222s\n\n"+ 

					"Texas de Brazil\n- Brazilian\n- Upscale Brazilian eatery featuring all-you-can-eat grilled meat carved tableside & a salad bar.\n- 240 W. Station Square Drive, Suite D1, Pittsburgh, PA 15219\n\n"+

					"The Melting Pot\n- Other\n- Fondue restaurant chain offering heated pots of cheese, chocolate or broth for dipping & cooking.\n- 125 W Station Square Dr, Pittsburgh, PA 15219\n\n"+

					"Grand Concourse\n- Seafood\n- Train station turned upscale restaurant with seafood & steaks plus a more casual attached saloon.\n- 100 W Station Square Dr, Pittsburgh, PA 15219\n\n"+

					"Monterey Bay Fish Grotto\n- Seafood\n- White-tablecloth eatery & bar with panoramic riverside views offers elegantly plated seafood.\n- 1411 Grandview Ave, Pittsburgh, PA 15211")
	} else if((text.includes("2$")) || (text.includes("$$"))){
		sendText(sender, 
					"Meat and Potatoes\n- American\n- Chic, modern gastropub making New American dinners, eclectic brunch items & inventive mixed drinks.\n- 649 Penn Ave, Pittsburgh, PA 15222\n\n"+

					"The Porch\n- American\n- Laid-back eatery with a patio for seasonal menus crafted using ingredients from local producers.\n- 221 Schenley Drive, Pittsburgh, PA 15213\n\n"+ 

					"Sichuan Gourmet\n- Asian\n- Casual Chinese eatery offering a menu of staples plus many spicy Sichuan dishes in a bright space.\n- 1900 Murray Ave, Pittsburgh, PA 15217\n\n"+

					"Hoffbrauhaus Pittsburgh\n- European\n- German brewery modeled like the Munich original has seasonal beer, Bavarian fare & costumed servers.\n- 2705 S Water St, Pittsburgh, PA 15203\n\n"+

					"Church Brew Works\n- Other\n- Former church is now a lofty space for house-brewed beers, plus a mix of pizza, pierogi & bratwurst.\n- 3525 Liberty Ave, Pittsburgh, PA 15201\n\n"+

					"täkō\n- Mexican\n- Lively taqueria with sidewalk seating serving inventive Mexican street food in chill digs.\n- 214 6th St, Pittsburgh, PA 15222")
	} else if ((text.includes("1$")) || (text.includes("$"))){
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
	//pitt wushu contact stuff
	} else if (text == "contact"){
		sendText(sender, "To get in touch:\n\nE-mail: pittwushu@gmail.com\nTel: 555-555-5555")
	} else if((text.includes("thanks")) || (text.includes("thank you"))){
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

function sendEventButtonMessage(sender, text){
	let messageData = {
		"attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text": text,
	        "buttons":[
	          {
	            "type":"postback",
	            "title":"Beginner",
	            "payload":"beg"
	          },
	          {
	          	"type":"postback",
	            "title":"Intermediate",
	            "payload":"int"
	          },
	          {
	          	"type":"postback",
	            "title":"Advanced",
	            "payload":"adv"
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
				"url":"https://i.imgur.com/5P8LyL8.png"
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

function sendBeginner(sender){
	let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Beg Changquan",
                "payload": "begChangquan"
              },
              {
                "type": "postback",
                "title": "Beg Nanquan",
                "payload": "begNanquan"
              },
              {
                "type": "postback",
                "title": "Beg 24 Taiji",
                "payload": "beg24Taiji"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Beg Open Yang",
                "payload": "begOpenYang"
              },
              {
                "type": "postback",
                "title": "Beg Trad Open BH",
                "payload": "begTradOpenBH"
              },
              {
                "type": "postback",
                "title": "Beg Broadsword",
                "payload": "begBroadsword"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Beg Straightsword",
                "payload": "begStraightsword"
              },
              {
                "type": "postback",
                "title": "Beg Other Weapon",
                "payload": "begOtherWeapon"
              },
              {
                "type": "postback",
                "title": "Beg Staff",
                "payload": "begStaff"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Beg Trad Short Weapon",
                "payload": "begTradShortWeapon"
              }
            ]
          }
        ]
      }
    }
  }
  sendRequest(sender, messageData)
}

function sendIntermediate(sender){
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Changquan",
                "payload": "intChangquan"
              },
              {
                "type": "postback",
                "title": "Int Nanquan",
                "payload": "intNanquan"
              },
              {
                "type": "postback",
                "title": "Int Open BH",
                "payload": "intOpenBH"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int 24 Taiji",
                "payload": "int24Taiji"
              },
              {
                "type": "postback",
                "title": "Int Open Taiji",
                "payload": "intOpenTaiji"
              },
              {
                "type": "postback",
                "title": "Int Open Chen",
                "payload": "intOpenChen"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int 42 Fist",
                "payload": "int42Fist"
              },
              {
                "type": "postback",
                "title": "Int Trad Open BH",
                "payload": "intTradOpenBH"
              },
              {
                "type": "postback",
                "title": "Int Broadsword",
                "payload": "intBroadsword"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Straightsword",
                "payload": "intStraightsword"
              },
              {
                "type": "postback",
                "title": "Int Nandao",
                "payload": "intNandao"
              },
              {
                "type": "postback",
                "title": "Int Other Weapon",
                "payload": "intOtherWeapon"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Staff",
                "payload": "intStaff"
              },
              {
                "type": "postback",
                "title": "Int Spear",
                "payload": "intSpear"
              },
              {
                "type": "postback",
                "title": "Int Southern Staff",
                "payload": "intSouthernStaff"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Trad Long Weapon",
                "payload": "intTradLongWeapon"
              },
              {
                "type": "postback",
                "title": "Int Trad Short Weapon",
                "payload": "intTradShortWeapon"
              }
            ]
          } 
        ]
      }
    }
  }
  sendRequest(sender, messageData)
}

function sendAdvanced(sender){
	let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv CQ Nandu",
                "payload": "advChangquanNandu"
              },
              {
                "type": "postback",
                "title": "Adv Changquan",
                "payload": "advChangquan"
              },
              {
                "type": "postback",
                "title": "Adv Nanquan",
                "payload": "advNanquan"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Open BH",
                "payload": "advOpenBH"
              },
              {
                "type": "postback",
                "title": "Adv 24 Taiji",
                "payload": "adv24Taiji"
              },
              {
                "type": "postback",
                "title": "Adv Open Yang",
                "payload": "advOpenYang"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Open Chen",
                "payload": "advOpenChen"
              },
              {
                "type": "postback",
                "title": "Adv 42 Fist",
                "payload": "adv42Fist"
              },
              {
                "type": "postback",
                "title": "Adv Internal Open Fist",
                "payload": "advInternalOpenFist"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Trad Open BH",
                "payload": "advTradOpenBH"
              },
              {
                "type": "postback",
                "title": "Adv Broadsword",
                "payload": "advBroadsword"
              },
              {
                "type": "postback",
                "title": "Adv Straightsword",
                "payload": "advStraightsword"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv 42 Sword",
                "payload": "adv42Sword"
              },
              {
                "type": "postback",
                "title": "Adv Taiji Weapon",
                "payload": "advTaijiWeapon"
              },
              {
                "type": "postback",
                "title": "Adv Other Weapon",
                "payload": "advOtherWeapon"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Staff",
                "payload": "advStaff"
              },
              {
                "type": "postback",
                "title": "Adv Spear",
                "payload": "advSpear"
              },
              {
                "type": "postback",
                "title": "Adv Southern Staff",
                "payload": "advSouthernStaff"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Long Weapon",
                "payload": "advLongWeapon"
              },
              {
                "type": "postback",
                "title": "Adv Trad Short Weapon",
                "payload": "advTradShortWeapon"
              },
              {
                "type": "postback",
                "title": "Adv Trad Soft Weapon",
                "payload": "advTradSoftWeapon"
              }
            ]
          }
        ]
      }
    }
  }
  sendRequest(sender, messageData)
}

//SECRETS
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
//END SECRETS

app.listen(app.get('port'), function(){
	console.log("Running: port")
})