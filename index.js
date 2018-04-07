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
"- Claire Tsau - 0.00\n"+
"- Emily Vick - 0.00\n"+
"- Christine Ou - 0.00\n"+
"- Gabrianna Zacharias - 0.00\n"+
"- Janette Levin - 0.00\n"+
"- Shyanne Amoyo - 0.00\n"+
"- Camryn Gray - 0.00\n"+
"- Michelle Chen - 0.00\n"+
"- Olivia Guo - 0.00\n"+
"- Tian Low - 0.00\n"+
"- Janet Abou Elias - 0.00\n"+
"- Raki Sy - 0.00\n"+
"- Christine Hwang - 0.00\n"+
"- Janet Nguyen - 0.00\n"+
"- Shannon Tsang - 0.00\n"+
"- Bryanna Geiger - 0.00\n"+
"- Elena Felix - 0.00\n"+
"- Michelle Nguyen - 0.00\n"+
"- Alexis Weyh - 0.00\n"+
"- Jennifer Tsui - 0.00\n"+
"- Dielai Yang - 0.00\n"+
"- Kelly Zhang - 0.00\n"+
"- Claire Lee - 0.00\n"+
"- Victoria Crevoisier - 0.00\n"+
"- Xuelin Hong - 0.00\n"+
"- Claire Weber - 0.00\n"+
"- Elissa He - 0.00\n"+
"- Unique Wei - 0.00\n"+
"- Jamie Evely - 0.00\n"+
"- Helen Xu - 0.00\n"+
"- Sara Moore - 0.00\n"+
"- Cj Rogers - 0.00\n"+
"- Doris Xu - 0.00\n"+
"- Deborah Ma - 0.00\n"+
"- Olivia Kuziel - 0.00\n"+
"- Jin Yun Chow - 0.00\n\n\n"+

"Male Changquan\n\n"+
"- Dylan Sanfilippo - 0.00\n"+
"- Allen Peng - 0.00\n"+
"- Kevin Marston - 0.00\n"+
"- Benjamin Chen - 0.00\n"+
"- Kyle Chan - 0.00\n"+
"- Simon Nguyen - 0.00\n"+
"- William Lund - 0.00\n"+
"- Nutong Her - 0.00\n"+
"- Lucas Cheng - 0.00\n"+8
"- Justin Lu - 0.00\n"+
"- Julian Hodge - 0.00\n"+
"- Christopher Tran - 0.00\n"+
"- Michael Yeh - 0.00\n"+
"- Angel Pan - 0.00\n"+
"- Everett White - 0.00\n"+
"- Francis Poon - 0.00\n"+
"- Bienvenido Hernandez - 0.00\n\n\n"

let begNanquan =
"Female Nanquan\n\n"+
"- Unique Wei - 0.00\n"+
"- Alexis Weyh - 0.00\n"+
"- Olivia Kuziel - 0.00\n"+
"- Sara Moore - 0.00\n"+
"- Samantha Ono - 0.00\n\n\n"+

"Male Nanquan\n\n"+
"- Lucas Verde - 0.00\n\n\n"

let beg24Taiji =
"Female 24 Taiji\n\n"+
"- Jin Yun Chow - 0.00\n"+
"- Jo Lin - 0.00\n\n\n"+

"Male 24 Taiji\n\n"+
"- Kevin Marston - 0.00\n\n\n"

let begOpenYang =
"Female Open Yang\n\n"+
"- Deborah Ma - 0.00\n\n\n"

let begTradOpenBH =
"Female Traditional Open Barehand\n\n"+
"- Shannon Tsang - 0.00\n"+
"- Claire Tsau - 0.00\n"+
"- Shyanne Amoyo - 0.00\n"+
"- Olivia Guo - 0.00\n"+
"- Unique Wei - 0.00\n\n\n"+

"Male Traditional Open Barehand\n\n"+
"- Allen Peng - 0.00\n"+
"- Justin Lu - 0.00\n\n\n"

let begBroadsword =
"Female Broadsword\n\n"+
"- Janet Abou Elias - 0.00\n"+
"- Deborah Ma - 0.00\n"+
"- Cj Rogers - 0.00\n"+
"- Claire Tsau - 0.00\n"+
"- Gabrianna Zacharias - 0.00\n\n\n"+

"Male Broadsword\n\n"+
"- Robin Calvo - 0.00\n"+
"- William Lund - 0.00\n"+
"- Lucas Verde - 0.00\n"+
"- Everett White - 0.00\n\n\n"

let begStraightsword =
"Female Straightsword\n\n"+
"- Olivia Guo - 0.00\n"+
"- Lillian Lee - 0.00\n"+
"- Janet Nguyen - 0.00\n"+
"- Michelle Nguyen - 0.00\n"+
"- Kelly Zhang - 0.00\n\n\n"+

"Male Straightsword\n\n"+
"- Allen Peng"

let begOtherWeapon =
"Female Other Weapon\n\n"+
"- Samantha Ono - 0.00\n\n\n"

let begStaff =
"Female Staff\n\n"+
"- Gabrianna Zacharias - 0.00\n"+
"- Christine Hwang - 0.00\n"+
"- Bryanna Geiger - 0.00\n"+
"- Shannon Tsang - 0.00\n"+
"- Claire Weber - 0.00\n"+
"- Janette Levin - 0.00\n"+
"- Janet Abou Elias - 0.00\n\n\n"+

"Male Staff\n\n"+
"- Lucas Cheng - 0.00\n"+
"- Benjamin Chen - 0.00\n"+
"- Christopher Tran - 0.00\n"+
"- Kyle Chan - 0.00\n"+
"- Simon Nguyen - 0.00\n"+
"- Francis Poon - 0.00\n"+
"- Michael Yeh - 0.00\n"+
"- Justin Lu - 0.00\n\n\n"

let begTradShortWeapon =
"Male Traditional Short Weapon\n\n"+
"- Simon Nguyen - 0.00\n\n\n"


















//Intermediate
let intChangquan =
"Female Changquan\n\n"+
"- Audrey Gunawan - 7.33\n"+
"- Kathie Lin - 0.00\n"+
"- Sara Ng - 0.00\n"+
"- Kimberly Gomez - 0.00\n"+
"- Annie Shi - 0.00\n"+
"- Michelle Tan - 0.00\n"+
"- Jasmine Wong - 0.00\n"+
"- Yong-yi Hu - 0.00\n"+
"- Adanna Liu - 0.00\n"+
"- Annmarie Cong - 0.00\n"+
"- Julia Leung - 0.00\n"+
"- Tiffany Hwu - 0.00\n"+
"- Jessica Zhu - 0.00\n"+
"- Jessica Luo - 0.00\n"+
"- Michelle Tu - 0.00\n"+
"- Melodee Li - 0.00\n"+
"- Kristi Lin - 0.00\n"+
"- Erika Yu - 0.00\n"+
"- Karen Kuang - 0.00\n"+
"- Rebecca Yap - 0.00\n"+
"- Annie Hanichak - 0.00\n"+
"- Winni Gao - 0.00\n"+
"- Mekenzie Dyer - 0.00\n"+
"- Lisa Yu - 0.00\n"+
"- Kelly Zhang - 0.00\n\n\n"+

"Male Changquan\n\n"+
"- Thomas Bozzi - 0.00\n"+
"- Akshara Aditya - 0.00\n"+
"- Robert Yang - 0.00\n"+
"- Alden Liu - 0.00\n"+
"- Bumjoon Kim - 0.00\n"+
"- Ryan Wang - 0.00\n"+
"- Chinmaya Aditya - 0.00\n"+
"- Ethan Green - 0.00\n"+
"- Kenneth Chen - 0.00\n"+
"- Carlos Estrada - 0.00\n"+
"- Henderson Wong - 0.00\n"+
"- Tommy Yang - 0.00\n"+
"- Davin Devara - 0.00\n"+
"- Ethan Devara - 0.00\n"+
"- Simon Lee - 0.00\n"+
"- Brian Cheng - 0.00\n"+
"- Haejin Park - 0.00\n"+
"- Connor Maples - 0.00\n"+
"- Danny Be - 0.00\n\n\n"

let intNanquan =
"Female Nanquan\n\n"+
"- Jasmine Pham - 0.00\n"+
"- Kimberly Gomez - 0.00\n"+
"- Shirley Mach - 0.00\n\n\n"+

"Male Nanquan\n\n"+
"- Alexandre Gunnerson - 0.00\n"+
"- Eric Wang - 0.00\n"+
"- Jeffrey Guo - 0.00\n"+
"- Noah Mastruserio - 0.00\n"+
"- John Caldas - 0.00\n"+
"- Vincent Ngo - 0.00\n"+
"- John Maclean - 0.00\n\n\n"

let intOpenBH =
"Female Open Barehand\n\n"+
"- Jae Hee Jang - 0.00\n\n\n"

let int24Taiji =
"Female 24 Taiji\n\n"+
"- Erika Yu - 0.00\n"+
"- Jessica Luo - 0.00\n"+
"- Sara Ng - 0.00\n"+
"- Melodee Li - 0.00\n"+
"- Annie Hanichak - 0.00\n"+
"- Annie Shi - 0.00\n"+
"- Adanna Liu - 0.00\n\n\n"

let intOpenTaiji =
"Female Open Yang\n\n"+
"- Julie Wang - 0.00\n\n\n"

let intOpenChen =
"Male Open Chen\n\n"+
"- Carlos Estrada - 0.00\n\n\n"

let int42Fist =
"Female 42 Fist\n\n"+
"- Erika Yu - 0.00\n\n\n"

let intTradOpenBH =
"Female Traditional Open Barehand\n\n"+
"- Karen Kuang - 0.00\n"+
"- Sunny Chiu - 0.00\n"+
"- Jasmine Chen - 0.00\n"+
"- Jennie Wang - 0.00\n"+
"- Jae Hee Jang - 0.00\n"+
"- Julie Wang - 0.00\n"+
"- Clarity Chua - 0.00\n"+
"- Lisa Yu - 0.00\n\n\n"+

"Male Traditional Open Barehand\n\n"+
"- Akshara Aditya - 0.00\n"+
"- Simon Lee - 0.00\n"+
"- Vincent Ngo - 0.00\n"+
"- Henderson Wong - 0.00\n\n\n"

let intBroadsword =
"Female Broadsword\n\n"+
"- Karen Kuang - 0.00\n"+
"- Kristi Lin - 0.00\n"+
"- Katie Zhao - 0.00\n\n\n"+

"Male Broadsword\n\n"+
"- Chinmaya Aditya - 0.00\n"+
"- Danny Be - 0.00\n"+
"- Carlos Estrada - 0.00\n"+
"- Mitchell Levasseur - 0.00\n"+
"- Anthony Wang - 0.00\n\n\n"

let intStraightsword =
"Female Straightsword\n\n"+
"- Winni Gao - 0.00\n"+
"- Jasmine Wong - 0.00\n"+
"- Melodee Li - 0.00\n"+
"- Rebecca Yap - 0.00\n"+
"- Melanie Ngo - 0.00\n"+
"- Sharon Shu - 0.00\n\n\n"+

"Male Straightsword\n\n"+
"- Kenneth Chen - 0.00\n"+
"- Haejin Park - 0.00\n"+
"- Ryan Wang - 0.00\n\n\n"

let intNandao =
"Male Nandao\n\n"+
"- Noah Mastruserio - 0.00\n\n\n"

let intOtherWeapon =
"Female Other Weapon\n\n"+
"- Tiffany Hwu - 0.00\n"+
"- Shirley Mach - 0.00\n"+
"- Vivienne Nguyen - 0.00\n"+
"- Sharon Shu - 0.00\n\n\n"+

"Male Other Weapon\n\n"+
"- Henderson Wong - 0.00\n\n\n"

let intStaff ="Female Staff\n\n"+
"- Tiffany Hwu - 0.00\n"+
"- Karen Kuang - 0.00\n\n\n"+

"Male Staff\n\n"+
"- Ethan Green - 0.00\n"+
"- Erick Partida - 0.00\n"+
"- Kwynn Johnson - 0.00\n\n\n"

let intSpear =
"Female Spear\n\n"+
"- Annmarie Cong - 0.00\n"+
"- Julia Leung - 0.00\n"+
"- Michelle Tu - 0.00\n\n\n"+

"Male Spear\n\n"+
"- Kenneth Chen - 0.00\n"+
"- Ryan Wang - 0.00\n\n\n"

let intSouthernStaff =
"Female Southern Staff\n\n"+
"- Jasmine Wong - 0.00\n\n\n"+

"Male Southern Staff\n\n"+
"- John Caldas - 0.00\n"+
"- Eric Wang - 0.00\n\n\n"

let intTradLongWeapon =
"Female Traditional Long Weapon\n\n"+
"- Lisa Yu - 0.00\n\n\n"+

"Male Traditional Long Weapon\n\n"+
"- Eric Wang - 0.00\n\n\n"

let intTradShortWeapon =
"Female Traditional Short Weapon\n\n"+
"- Sunny Chiu - 0.00\n"+
"- Kelly Zhang - 0.00\n"+
"- Kristi Lin - 0.00\n"+
"- Jessica Zhu - 0.00\n"+
"- Clarity Chua - 0.00\n\n\n"+

"Male Traditional Short Weapon\n\n"+
"- Simon Lee - 0.00\n\n\n"

























//Advanced
let advChangquanNandu =
"Male Changquan(nandu)\n\n"+
"- Tim Wang - 8.35\n"+
"- Patrick Moua - 7.30\n\n\n"

let advChangquan =
"Female Changquan\n\n"+
"- Joy Zeng - 8.26\n"+
"- Caitlin Escudero - 8.48\n"+
"- Gwyneth Huynh - 7.77\n"+
"- Bridget Keeney - 8.46\n"+
"- Rebecca Chinn - 8.33\n"+
"- Daisy Zheng - 0.00\n"+
"- Kaitlyn Trinh - 0.00\n"+
"- Emily Fan - 0.00\n"+
"- Michelle Chiang - 0.00\n"+
"- Alyssa Lo - 0.00\n"+
"- Crystal Huang - 0.00\n\n\n"+

"Male Changquan\n\n"+
"- Daniel Liang - 0.00\n"+
"- Winston Lee - 0.00\n"+
"- Varun Singh - 0.00\n"+
"- Tianming Li - 0.00\n"+
"- Chuan Chen - 0.00\n"+
"- Dominic Chow - 0.00\n"+
"- Jason Tang - 0.00\n"+
"- Eric Fu - 0.00\n"+
"- Jason Hui - 0.00\n"+
"- Connor Hum - 0.00\n"+
"- Philip Hwang - 0.00\n"+
"- Robert Yu - 0.00\n"+
"- Chi Tun Lam - 0.00\n"+
"- Mario Caballero - 0.00\n"+
"- Oey Chang - 0.00\n"+
"- Jonathan Li - 0.00\n"+
"- Jeffson Atienza - 0.00\n"+
"- Xian Kai Ng - 0.00\n"+
"- Erik Song - 0.00\n"+
"- Howard Wang - 0.00\n"+
"- Alexander Wu - 0.00\n"+
"- Jason Zou - 0.00\n"+
"- Albert Zhang - 0.00\n"+
"- Ryan Zheng - 0.00\n"+
"- Jemmy Zhou - 0.00\n"+
"- Khang Nguyen - 0.00\n"+
"- Christopher Johnson - 0.00\n\n\n"

let advNanquan ="Female Nanquan\n\n"+
"- Sabrina Chiang - 0.00\n"+
"- Queenie Li - 0.00\n\n\n"+

"Male Nanquan\n\n"+
"- Mohammad Ullah - 0.00\n"+
"- Darren Deng - 0.00\n\n\n"

let advOpenBH =
"Male Open Barehand\n\n"+
"- Oey Chang - 0.00\n"+
"- Robert Yu - 0.00\n\n\n"

let adv24Taiji =
"Female 24 Taiji\n\n"+
"- Amy Pribadi - 0.00\n"+
"- Gina Bao - 0.00\n"+
"- Marianne Dang - 0.00\n\n\n"+

"Male 24 Taiji\n\n"+
"- Michael Fang - 0.00\n"+
"- Richard Nguyen - 0.00\n"+
"- Kevin Chen - 0.00\n"+
"- Jonathan Li - 0.00\n"+
"- Ying Hong Tham - 0.00\n\n\n"

let advOpenYang =
"Male Open Yang\n\n"+
"- William Du - 0.00\n"+
"- Ethyn Leong - 0.00\n\n\n"

let advOpenChen =
"Female Open Chen\n\n"+
"- Dimei Wu - 0.00\n"+
"- Marianne Dang - 0.00\n"+
"- Amy Pribadi - 0.00\n"+
"- Gina Bao - 0.00\n\n\n"+

"Male Open Chen\n\n"+
"- Philip Hwang - 0.00\n"+
"- Ying Hong Tham - 0.00\n"+
"- Michael Fang - 0.00\n"+
"- William Du - 0.00\n\n\n"

let adv42Fist =
"Female 42 Fist\n\n"+
"- Amy Pribadi - 0.00\n"+
"- Marianne Dang - 0.00\n\n\n"+

"Male 42 Fist\n\n"+
"- Ying Hong Tham - 0.00\n"+
"- Michael Fang - 0.00\n\n\n"

let advInternalOpenFist =
"Female Internal Open Fist\n\n"+
"- Cecilia Springer - 0.00\n\n\n"+

"Male Internal Open Fist\n\n"+
"- Richard Nguyen - 0.00\n\n\n"

let advTradOpenBH =
"Female Traditional Open Barehand\n\n"+
"- Cecilia Springer - 0.00\n"+
"- Rebecca Chinn - 0.00\n\n\n"+

"Male Traditional Open Barehand\n\n"+
"- Alexander Lu - 0.00\n"+
"- Connor Hum - 0.00\n"+
"- Kristian Koeser - 0.00\n"+
"- Winston Lee - 0.00\n"+
"- Linfeng Wu - 0.00\n\n\n"

let advBroadsword =
"Female Broadsword\n\n"+
"- Michelle Sit - 0.00\n"+
"- Daisy Zheng - 0.00\n"+
"- Sabrina Chiang - 0.00\n"+
"- Rebecca Chinn - 0.00\n"+
"- Zoe Chan - 0.00\n"+
"- Queenie Li - 0.00\n"+
"- Kaitlyn Trinh - 0.00\n"+
"- Irene Javier - 0.00\n\n\n"+

"Male Broadsword\n\n"+
"- Wesley Huie - 0.00\n"+
"- Alexander Wu - 0.00\n"+
"- Chuan Chen - 0.00\n"+
"- Jason Zou - 0.00\n"+
"- Jonathan Li - 0.00\n"+
"- Daniel Liang - 0.00\n"+
"- Khang Nguyen - 0.00\n"+
"- Erik Song - 0.00\n"+
"- Howard Wang - 0.00\n"+
"- Stuart Sy - 0.00\n"+
"- Jeffson Atienza - 0.00\n"+
"- Oey Chang - 0.00\n"+
"- Kevin Ty - 0.00\n\n\n"

let advStraightsword =
"Female Straightsword\n\n"+
"- Alyssa Lo - 0.00\n"+
"- Emily Fan - 0.00\n"+
"- Hannah Ho - 0.00\n"+
"- Gwyneth Huynh - 0.00\n"+
"- Bridget Keeney - 0.00\n"+
"- Kasey Chan - 0.00\n"+
"- Dimei Wu - 0.00\n"+
"- Emily Yang - 0.00\n"+
"- Joy Zeng - 0.00\n"+
"- Michelle Chiang - 0.00\n\n\n"+

"Male Straightsword\n\n"+
"- Alexander Lu - 0.00\n"+
"- Daniel Liang - 0.00\n"+
"- Dominic Chow - 0.00\n"+
"- Mario Caballero - 0.00\n"+
"- Christopher Johnson - 0.00\n"+
"- Xian Kai Ng - 0.00\n"+
"- Robert Yu - 0.00\n"+
"- Kevin Qin - 0.00\n"+
"- William Du - 0.00\n"+
"- Ryan Zheng - 0.00\n"+
"- Chi Tun Lam - 0.00\n"+
"- Jemmy Zhou - 0.00\n"+
"- Kevin Chen - 0.00\n"+
"- Irwin Hui - 0.00\n"+
"- Tim Wang - 0.00\n\n\n"

let adv42Sword =
"Female 42 Sword\n\n"+
"- Dimei Wu - 0.00\n"+
"- Amy Pribadi - 0.00\n\n\n"+

"Male 42 Sword\n\n"+
"- Ying Hong Tham - 0.00\n\n\n"

let advTaijiWeapon =
"Female Taiji Weapon\n\n"+
"- Marianne Dang - 0.00\n"+
"- Gina Bao - 0.00\n\n\n"+

"Male Taiji Weapon\n\n"+
"- Ethyn Leong - 0.00\n"+
"- William Du - 0.00\n"+
"- Richard Nguyen - 0.00\n\n\n"

let advNandao =
"Male Nandao\n\n"+
"- Mohammad Ullah - 0.00\n\n\n"

let advOtherWeapon =
"Female Other Weapon\n\n"+
"- Zoe Chan - 0.00\n\n\n"+

"Male Other Weapon\n\n"+
"- Irwin Hui - 0.00\n"+
"- Winston Lee - 0.00\n"+
"- Linfeng Wu - 0.00\n"+
"- Kevin Chen - 0.00\n\n\n"

let advStaff =
"Female Staff\n\n"+
"- Bridget Keeney - 0.00\n"+
"- Rebecca Chinn - 0.00\n"+
"- Queenie Li - 0.00\n\n\n"+

"Male Staff\n\n"+
"- Connor Hum - 0.00\n"+
"- Khang Nguyen - 0.00\n"+
"- Tianming Li - 0.00\n"+
"- Chuan Chen - 0.00\n"+
"- Brian Tran - 0.00\n"+
"- Jason Zou - 0.00\n"+
"- Patrick Moua - 0.00\n"+
"- Oey Chang - 0.00\n"+
"- Winston Lee - 0.00\n"+
"- Jeffson Atienza - 0.00\n\n\n"

let advSpear =
"Female Spear\n\n"+
"- Kasey Chan - 0.00\n"+
"- Emily Fan - 0.00\n"+
"- Emily Yang - 0.00\n"+
"- Alyssa Lo - 0.00\n\n\n"+

"Male Spear\n\n"+
"- Irwin Hui - 0.00\n"+
"- Kristian Koeser - 0.00\n"+
"- Ryan Zheng - 0.00\n"+
"- Jason Tang - 0.00\n"+
"- Robert Yu - 0.00\n"+
"- Jemmy Zhou - 0.00\n\n\n"

let advSouthernStaff =
"Male Southern Staff\n\n"+
"- Darren Deng - 0.00\n\n\n"

let advLongWeapon =
"Female Traditional Long Weapon\n\n"+
"- Cecilia Springer - 0.00\n\n\n"

let advTradShortWeapon =
"Female Traditional Short Weapon\n\n"+
"- Cecilia Springer - 0.00\n"+
"- Michelle Chin - 0.00\n\n\n"+

"Male Traditional Short Weapon\n\n"+
"- Alexander Wu - 0.00\n\n\n"

let advTradSoftWeapon =
"Female Soft Weapon\n\n"+
"- Queenie Li - 0.00\n\n\n"























let groupsetHalf1 = 
"Columbia - ~cu later ;) : 0.00\n"+
"- Rebecca Chinn\n"+
"- Janette Levin\n"+
"- Haejin Park\n"+
"- Sharon Shu\n"+
"- Jennifer Tsui\n"+
"- Chi Tun Lam\n\n"+

"Cornell - Baby's First Groupset: 0.00\n"+
"- Albert Zhang\n"+
"- Sara Ng\n"+
"- Daisy Zheng\n"+
"- Winni Gao\n"+
"- Erika Yu\n"+
"- Ethyn Leong\n\n"+

"Northern Arizona - NAU Iron Fist: 0.00\n"+
"- Mekenzie Dyer \n"+
"- Bumjoon Kim\n"+
"- Alexis Weyh\n"+
"- John MacLean\n"+
"- Jamie Evely\n"+
"- Sara Moore\n\n"+

"Stanford - Stanford Wushu: 0.00\n"+
"- William Du\n"+
"- Michael Fang\n"+
"- Jin Yun Chow\n"+
"- Stuart Sy\n"+
"- Michelle Chin\n"+
"- Jessica Luo\n\n"+

"UMD: College Park:\n"+

"1) Bae Team: 0.00\n"+
"- Tianming Li\n"+
"- Jason Tang\n"+
"- Dominic Chow\n"+
"- Christine Hwang\n"+
"- Christopher Tran\n"+
"- Jae Hee Jang\n\n"+

"2) HEEEE HAW: 0.00\n"+
"- Connor Maples\n"+
"- Benjamin Chen\n"+
"- Claire Weber\n"+
"- Kristian Koeser\n"+
"- Alexander Lu\n"+
"- Kelly Zhang\n\n"+

"3) Bustin Jenedik's Fanclub: 0.00\n"+
"- Michelle Tu\n"+
"- Emily Yang\n"+
"- Kyle Chan\n"+
"- Kasey Chan\n"+
"- Francis Poon\n"+
"- Julia Leung\n\n"+

"Pitt - Bao Down PITTches: 0.00\n"+
"- Gina Bao\n"+
"- Melodee Li\n"+
"- Adanna Liu\n"+
"- Kevin Chen\n"+
"- Jonathan Li\n"+
"- Annie Shi\n\n"+

"UVA - WuHoos: 0.00\n"+
"- Mario Caballero\n"+
"- Erik Song\n"+
"- Katie Zhao\n"+
"- Mitchell Levasseur\n"+
"- Kenneth Chen\n"+
"- CJ Rogers\n\n"

let groupsetHalf2 = "UC Berkeley:\n"+
"1) Cal Wushu A Team: 0.00\n"+
"- Robert Yu\n"+
"- Jason Zou\n"+
"- Queenie Li\n"+
"- Jemmy Zhou\n"+
"- Alyssa Lo\n"+
"- Emily Fan\n\n"+

"2) Cal Wushu Baewatch Team: 0.00\n"+
"- Cecilia Springer\n"+
"- Vincent Ngo\n"+
"- Eric Fu\n"+
"- Karen Kuang\n"+
"- Shannon Tsang\n"+
"- Olivia Guo\n\n"+

"3) The Mighty C: 0.00\n"+
"- Ryan Zheng\n"+
"- Unique Wei\n"+
"- Claire Tsau\n"+
"- Alden Liu\n"+
"- Henderson Wong\n"+
"- Julie Wang\n\n"+

"UCI - UCI's Jasmine Milk Tea-M: 0.00\n"+
"- Jasmine Wong\n"+
"- Kristi Lin\n"+
"- Ryan Wang\n"+
"- Lucas Verde\n"+
"- Simon Nguyen\n"+
"- Carlos Estrada\n\n"+

"UCLA:\n"+

"1) Spi-C Team: 0.00\n"+
"- Michelle Tan\n"+
"- Janet Nguyen\n"+
"- Michelle Nguyen\n"+
"- Kelly Zhang\n"+
"- Samantha Ono\n"+
"- Clarity Chua\n\n"+

"2) The Big Baller Brand Team: 0.00\n"+
"- Chinmaya Aditya\n"+
"- Akshara Aditya\n"+
"- Eric Wang\n"+
"- Rebecca Yap\n"+
"- Annmarie Cong\n"+
"- Jennie Wang\n\n"+

"3) Wakan大麻辣: 0.00\n"+
"- Connor Hum\n"+
"- Xian Kai Ng\n"+
"- Alexander Wu\n"+
"- Chuan Chen\n"+
"- Gwyneth Huynh\n"+
"- Dimei Wu\n\n"+

"UCSD - Team Meow Dao: 0.00\n"+
"- Winston Lee\n"+
"- Zoe Chan\n"+
"- Kaitlyn Trinh\n"+
"- Richard Nguyen\n"+
"- Michelle Sit\n"+
"- Darren Deng\n\n"+

"VCU - Doki Doki Wushu Club: 0.00\n"+
"- Wesley Huie\n"+
"- Claire Lee\n"+
"- Bienvenido Hernandez\n"+
"- Michelle Chen"

//list of schools and associated competitors
let berklee = 
"Berklee College of Music:\n\n"+ 
"- Kevin Qin\n"

let calstateLB = 
"California State University - Long Beach:\n\n"+ 
"- Vivienne Nguyen\n"

let columbia = 
"Columbia University:\n\n"+ 
"- Rebecca Chinn\n"+
"- Bryanna Geiger\n"+
"- Chi Tun Lam\n"+
"- Janette Levin\n"+
"- Tian Low\n"+
"- Haejin Park\n"+
"- Sharon Shu\n"+
"- Jennifer Tsui\n"+
"- Tim Wang\n"+
"- Doris Xu\n"+
"- Dielai Yang\n"

let cornell = 
"Cornell University:\n\n"+ 
"- Winni Gao\n"+
"- Camryn Gray\n"+
"- Audrey Gunawan\n"+
"- Xuelin Hong\n"+
"- Ethyn Leong\n"+
"- Kathie Lin\n"+
"- Sara Ng\n"+
"- Christine Ou\n"+
"- Emily Vick\n"+
"- Everett White\n"+
"- Linfeng Wu\n"+
"- Helen Xu\n"+
"- Robert Yang\n"+
"- Erika Yu\n"+
"- Lisa Yu\n"+
"- Albert Zhang\n"+
"- Daisy Zheng\n"

let harvard = 
"Harvard University:\n\n"+ 
"- Michelle Chiang\n"

let mit = 
"Massachusetts Institute of Technology:\n\n"+ 
"- Elissa He\n"+
"- Joy Zeng\n"

let nyu = 
"New York University:\n\n"+ 
"- Daniel Liang\n"+
"- Jasmine Pham\n"

let nau = 
"Northern Arizona University:\n\n"+ 
"- Mekenzie Dyer\n"+
"- Jamie Evely\n"+
"- Bumjoon Kim\n"+
"- Olivia Kuziel\n"+
"- John MacLean\n"+
"- Sara Moore\n"+
"- Dylan Sanfilippo\n"+
"- Alexis Weyh\n"

let osu = 
"Ohio State University:\n\n"+ 
"- Thomas Bozzi\n"+
"- Alexandre Gunnerson\n"+
"- Jeffrey Guo\n"+
"- Noah Mastruserio\n"+
"- Mitch Seiple\n"

let stpeters = 
"Saint Peter's University:\n\n"+ 
"- Caitlin Escudero\n"

let sdmiramar = 
"San Diego Miramar College:\n\n"+ 
"- Patrick Moua\n"

let stanford = 
"Stanford University:\n\n"+ 
"- Michelle Chin\n"+
"- Jin Yun Chow\n"+
"- Victoria Crevoisier\n"+
"- Marianne Dang\n"+
"- William Du\n"+
"- Michael Fang\n"+
"- Elena Felix\n"+
"- Jessica Luo\n"+
"- Angel Pan\n"+
"- Stuart Sy\n"

let stonybrook = 
"SUNY Stony Brook:\n\n"+ 
"- Ying Hong Tham\n"

let houston = 
"University of Houston:\n\n"+ 
"- Jeffson Atienza\n"+
"- Mohammad Ullah\n"

let umbc = 
"University of Maryland: Baltimore County:\n\n"+ 
"- Julian Hodge\n"+
"- Irene Javier\n"+
"- Kwynn Johnson\n"

let umcp = 
"University of Maryland: College Park:\n\n"+ 
"- Robin Calvo\n"+
"- Kasey Chan\n"+
"- Kyle Chan\n"+
"- Benjamin Chen\n"+
"- Lucas Cheng\n"+
"- Dominic Chow\n"+
"- Christine Hwang\n"+
"- Jae Hee Jang\n"+
"- Kristian Koeser\n"+
"- Julia Leung\n"+
"- Tianming Li\n"+
"- Alexander Lu\n"+
"- Connor Maples\n"+
"- Francis Poon\n"+
"- Jason Tang\n"+
"- Christopher Tran\n"+
"- Brian Tran\n"+
"- Michelle Tu\n"+
"- Claire Weber\n"+
"- Emily Yang\n"+
"- Michael Yeh\n"+
"- Kelly Zhang\n"

let oregon = 
"University of Oregon:\n\n"+ 
"- Nutong Her\n"+
"- Jason Hui\n"+
"- Tommy Yang\n"

let pitt = 
"University of Pittsburgh:\n\n"+ 
"- Gina Bao\n"+
"- Kevin Chen\n"+
"- Arie Dash\n"+
"- Annie Hanichak\n"+
"- Melodee Li\n"+
"- Jonathan Li\n"+
"- Jo Lin\n"+
"- Adanna Liu\n"+
"- Kevin Marston\n"+
"- Allen Peng\n"+
"- Annie Shi\n"+
"- Diana Zhou\n"

let texas = 
"University of Texas:\n\n"+ 
"- Janet Abou Elias\n"+
"- Ethan Devara\n"+
"- Davin Devara\n"+
"- Hannah Ho\n"+
"- Crystal Huang\n"+
"- Gabrianna Zacharias\n"

let uva = 
"University of Virginia:\n\n"+ 
"- Mario Caballero\n"+
"- Kenneth Chen\n"+
"- Mitchell Levasseur\n"+
"- William Lund\n"+
"- CJ Rogers\n"+
"- Erik Song\n"+
"- Kevin Ty\n"+
"- Joshua Ya\n"+
"- Katie Zhao\n"

let uwash = 
"University of Washington:\n\n"+ 
"- Oey Chang\n"

let cal = 
"UC Berkeley:\n\n"+ 
"- Shyanne Amoyo\n"+
"- Emily Fan\n"+
"- Eric Fu\n"+
"- Olivia Guo\n"+
"- Karen Kuang\n"+
"- Queenie Li\n"+
"- Alden Liu\n"+
"- Alyssa Lo\n"+
"- Deborah Ma\n"+
"- Vincent Ngo\n"+
"- Cecilia Springer\n"+
"- Shannon Tsang\n"+
"- Claire Tsau\n"+
"- Julie Wang\n"+
"- Unique Wei\n"+
"- Henderson Wong\n"+
"- Robert Yu\n"+
"- Ryan Zheng\n"+
"- Jemmy Zhou\n"+
"- Jason Zou\n"

let uci = 
"UC Irvine:\n\n"+ 
"- Danny Be\n"+
"- Sunny Chiu\n"+
"- Carlos Estrada\n"+
"- Kimberly Gomez\n"+
"- Philip Hwang\n"+
"- Tiffany Hwu\n"+
"- Bridget Keeney\n"+
"- Simon Lee\n"+
"- Kristi Lin\n"+
"- Simon Nguyen\n"+
"- Erick Partida\n"+
"- Varun Singh\n"+
"- Lucas Verde\n"+
"- Ryan Wang\n"+
"- Jasmine Wong\n"+
"- Jessica Zhu\n"

let ucla = 
"UC Los Angeles:\n\n"+ 
"- Akshara Aditya\n"+
"- Chinmaya Aditya\n"+
"- Jasmine Chen\n"+
"- Chuan Chen\n"+
"- Sabrina Chiang\n"+
"- Clarity Chua\n"+
"- Annmarie Cong\n"+
"- Irwin Hui\n"+
"- Connor Hum\n"+
"- Gwyneth Huynh\n"+
"- Shirley Mach\n"+
"- Xian Kai Ng\n"+
"- Melanie Ngo\n"+
"- Janet Nguyen\n"+
"- Michelle Nguyen\n"+
"- Samantha Ono\n"+
"- Michelle Tan\n"+
"- Eric Wang\n"+
"- Jennie Wang\n"+
"- Alexander Wu\n"+
"- Dimei Wu\n"+
"- Rebecca Yap\n"+
"- Kelly Zhang\n"

let ucsd = 
"UC San Diego:\n\n"+ 
"- John Caldas\n"+
"- Zoe Chan\n"+
"- Brian Cheng\n"+
"- Darren Deng\n"+
"- Ethan Green\n"+
"- Yong-Yi Hu\n"+
"- Christopher Johnson\n"+
"- Lillian Lee\n"+
"- Winston Lee\n"+
"- Richard Nguyen\n"+
"- Amy Pribadi\n"+
"- Michelle Sit\n"+
"- Kaitlyn Trinh\n"+
"- Howard Wang\n"+
"- Anthony Wang\n"

let vcu = 
"Virginia Commonwealth University:\n\n"+ 
"- Michelle Chen\n"+
"- Bienvenido Hernandez\n"+
"- Wesley Huie\n"+
"- Claire Lee\n"

let vtech = 
"Virginia Tech:\n\n"+ 
"- Justin Lu\n"+
"- Khang Nguyen\n"








let ringOne = 
"This is the order for ring 1. Type 'events' to see who is in what event!\n\n"+
"- ADV Male CQ - Nandu\n"+
"- ADV Female CQ \n"+
"- ADV Male CQ\n"+
"- ADV Open Barehand\n"+
"- ADV Female NQ\n"+
"- ADV Male NQ\n"+
"- ADV F Traditional Open Barehand\n"+
"- ADV M Traditional Open Barehand\n"+
"- ADV Female Broadsword\n"+
"- ADV Male Broadsword\n"+
"- ADV Female Straightsword\n"+
"- ADV Male Straightsword\n"+
"- ADV Male Nandao\n"+
"- ADV Female Other Weapon\n"+
"- ADV Male Other Weapon\n"+
"- ADV Female Staff\n"+
"- ADV Male Staff\n"+
"- ADV Female Spear\n"+
"- ADV Male Spear\n"+
"- ADV Male Southern Staff\n"+
"- ADV Female Traditional Short Weapon\n"+
"- ADV Male Traditional Short Weapon\n"+
"- ADV Female Traditional Long Weapon\n"+
"- ADV Female Soft Weapon\n"




















let ringTwo = 
"This is the order for ring 2. Type 'events' to see who is in what event!\n\n"+
"- INT Female CQ\n"+
"- INT Male CQ\n"+
"- INT Female NQ\n"+
"- INT Male NQ\n"+
"- INT Female Traditional Open Barehand\n"+
"- INT Male Traditional Open Barehand\n"+
"- INT Female Broadsword\n"+
"- INT Male Broadsword\n"+
"- INT Female Straightsword\n"+
"- INT Male Straightsword\n"+
"- INT Male Nandao\n"+
"- INT Female Southern Staff\n"+
"- INT Male Southern Staff\n"+
"- INT Female Other Weapon\n"+
"- INT Male Other Weapon\n"+
"- INT Female Staff\n"+
"- INT Male Staff\n"+
"- INT Female Spear\n"+
"- INT Male Spear\n"+
"- INT Female Traditional Short Weapon\n"+
"- INT Male Traditional Short Weapon\n"+
"- INT Female Traditional Long Weapon\n"+
"- INT Male Traditional Long Weapon\n"





















let ringThree = 
"This is the order for ring 3. Type 'events' to see who is in what event!\n\n"+
"- BEG Male CQ\n"+
"- BEG Female CQ\n"+
"- BEG Male NQ\n"+
"- BEG Female NQ\n"+
"- BEG F Traditional Open Barehand\n"+
"- BEG M Traditional Open Barehand\n"+
"- BEG Female Broadsword\n"+
"- BEG Male Broadsword\n"+
"- BEG Male Straightsword\n"+
"- BEG Female Straightsword\n"+
"- BEG Female Other Weapon\n"+
"- BEG Male Staff\n"+
"- BEG Female Staff\n"+
"- BEG Male Traditional Short Weapon\n"+
"- ADV Male Open Yang\n"+
"- BEG Female Open Yang\n"+
"- INT Female Open Yang\n"+
"- INT Male Open Chen\n"+
"- ADV Male Open Chen \n"+
"- ADV Female Open Chen\n"+
"- BEG Female 24\n"+
"- BEG Male 24\n"+
"- INT Female 24\n"+
"- ADV Male 24\n"+
"- ADV Female 24\n"+
"- ADV Male 42 Fist\n"+
"- INT Female 42 Fist\n"+
"- ADV Female 42 Fist\n"+
"- ADV Male Internal Open Fist\n"+
"- ADV Female Internal Open Fist\n"+
"- ADV Male 42 Sword\n"+
"- ADV Female 42 Sword\n"+
"- ADV Male Taiji Weapon\n"+
"- ADV Female Taiji Weapon\n"










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
			"- For event info, type 'events', 'beg', 'int', or 'adv'\n\n"+
			"- For a list of competitors associated with schools, type 'school'\n\n"+
			"- For ring info, type 'rings'\n\n"+ 
			"- To find out what's going on right now, type 'schedule'\n\n"+ 
			"- To learn more about parking, type 'parking'\n\n"+ 
			"- For useful maps, type 'map'\n\n"+ 
			// "To see scores, type 'scores' \n \n"+ 
			"- For the food court (ONLY FOR LUNCH ON DAY OF COMPETITION), type 'foodcourt' or 'lunch'\n\n"+ 
			"- For local restaurants, type 'local'\n\n"+ 
			"- For contact information, type 'contact'\n\n"+ 
			"- To see all this info again, type 'help'")
	} else if ((text.includes("parking"))){ 
		sendText(sender, 
			"Here is a list of possible parking spots, barring regular street parking in the area "+
			"(street parking costs vary, but are in effect from 8am-5pm on Saturday; parking is free all day on Sunday should you need it).\n\n"+ 

				"- Parking Garages on Darragh St\n"+
				"- Cost Center Parking Garage\n"+
				//"- Parking in front of the Fitzgerald Field House (will need final go-ahead from Jason)\n"+
				"- Parking Garage on Terrace St\n"+
				"- Parking Garage on Lothrop St\n"
)
	// map of venue with rings
	} else if ((text == "venue") || text.includes("fitzgerald")){ 
		let venueText = {text: "Here is a map of the venue:"}
		sendRequest(sender, venueText)
		sendVenueImageMessage(sender)
	} else if ((text == "map")){ 
		sendMapOptions(sender, "What map would you like to see:")
	} else if ((text.includes("surrounding")) || text.includes("nearby")){ 
		let staticLocalMapText = {text: "Here is a static, local map, with Fitzgerald highlighted at the top and the competitor-reserved hotel, Hampton Inn, UPMC:"}
		sendRequest(sender, staticLocalMapText)
		sendLocalMapImage(sender)
	} else if (text.includes("when")){
		sendText(sender, "The 22nd Annual Collegiate Wushu Tournament is April 7th, 2018.")
	} else if ((text.includes("where")) || (text.includes("location"))){
		sendText(sender, "The 22nd Annual Collegiate Wushu Tournament is being held at Fitzgeral Fieldhouse in Pittsburgh, PA")
		//food court available (day of)
	} else if ((text == "foodcourt") || (text == "lunch") || (text.includes("food court"))){
		sendLunch(sender)
		let lunchText = {text: "The food court will be open from 11 A.M. to 6 P.M. ONLY on the day of the competition!\n\nThe food court is located at 3719 Terrace Street, down the escalators!"}
		sendRequest(sender, lunchText)
	//local businesses ... pic of map with local markers? ... maybe numbers as markers?
	} else if ((text == "local") || (text == "restaurants") || (text.includes("hungry")) || (text.includes("restaurant") || (text.includes("food")))){
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
		//begin schools
	} else if (text.includes("berklee")){
		sendText(sender, berklee)	
	} else if (text.includes("calstatelb")){
		sendText(sender, calstateLB)	
	} else if (text.includes("columbia")){
		sendText(sender, columbia)
	} else if (text.includes("cornell")){
		sendText(sender, cornell)
	} else if (text.includes("harvard")){
		sendText(sender, harvard)
	} else if (text.includes("mit")){
		sendText(sender, mit)	
	} else if (text.includes("nyu")){
		sendText(sender, nyu)
	} else if (text.includes("nau")){
		sendText(sender, nau)	
	} else if (text.includes("osu")){
		sendText(sender, osu)
	} else if (text.includes("stpeters")){
		sendText(sender, stpeters)
	} else if (text.includes("sdmiramar")){
		sendText(sender, sdmiramar)
	} else if (text.includes("stanford")){
		sendText(sender, stanford)
	} else if (text.includes("stonybrook")){
		sendText(sender, stonybrook)
	} else if (text.includes("houston")){
		sendText(sender, houston)	
	} else if (text.includes("umbc")){
		sendText(sender, umbc)
	} else if (text.includes("umcp")){
		sendText(sender, umcp)	
	} else if (text.includes("oregon")){
		sendText(sender, oregon)
	} else if (text.includes("pitt")){
		sendText(sender, pitt)
	} else if (text.includes("texas")){
		sendText(sender, texas)
	} else if (text.includes("uva")){
		sendText(sender, uva)
	} else if (text.includes("uwash")){
		sendText(sender, uwash)
	} else if (text.includes("cal")){
		sendText(sender, cal)	
	} else if (text.includes("uci")){
		sendText(sender, uci)	
	} else if (text.includes("ucla")){
		sendText(sender, ucla)	
	} else if (text.includes("ucsd")){
		sendText(sender, ucsd)	
	} else if (text.includes("vcu")){
		sendText(sender, vcu)	
	} else if (text.includes("vtech")){
		sendText(sender, vtech)	
	} else if ((text.includes("school")) || (text.includes("university")) || (text.includes("universities")) || (text.includes("college"))){
		sendSchools(sender)
		//end schools
	} else if (text.includes("allBegScores")){
		sendScoreOptions(sender)
	} else if (text.includes("allIntScores")){
		sendScoreOptions(sender)
	} else if (text.includes("allAdvScores")){
		sendScoreOptions(sender)
	//POTENTIAL real-time scores... let's see?
	} else if (text.includes("score")){
		sendText(sender, "Scores will be posted next to the competitor's name. Check their event by typing 'events'.")
	//view events
	} else if (text.includes("events")){
		sendText(sender, "Please type 'beg', 'int', 'adv', 'beginner', 'intermediate', 'advanced', or 'groupset' to continue to that category.")
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
	} else if (text.includes("advnandao")){
		sendText(sender, advNandao)	
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
	} else if (text.includes("groupset")){
		sendText(sender, groupsetHalf1)	
		sendText(sender, groupsetHalf2)	
	} else if ((text.includes("beg")) || (text.includes("beginner"))){
		sendBeginner(sender)
	} else if ((text.includes("int")) || (text.includes("intermediate"))){
		sendIntermediate(sender)
	} else if ((text.includes("adv")) || (text.includes("advanced"))){
		sendAdvanced(sender)
	//end events
	
	//what happens on what ring throughout day
	} else if ((text == "rings") || (text == "ring")){
		sendRingButtonMessage(sender, "What would you like to see? Or type 'ringall' to see EVERYTHING")
	//rings
	} else if ((text.includes("rings all")) || (text.includes("ringsall")) || (text.includes("ringall")) || (text.includes("all rings")) || (text.includes("ring all"))){
		let completeSched = ringOne + "\n\n\n\n" + ringTwo + "\n\n\n\n" + ringThree
		sendText(sender, completeSched)
	} else if ((text.includes("ring1")) || (text.includes("ring 1")) || (text.includes("mat1")) || (text.includes("mat 1"))){
		sendText(sender, ringOne)
	} else if ((text.includes("ring2")) || (text.includes("ring 2")) || (text.includes("mat2")) || (text.includes("mat 2"))){
		sendText(sender, ringTwo)
	} else if ((text.includes("ring3")) || (text.includes("ring 3")) || (text.includes("mat3")) || (text.includes("mat 3"))){
		sendText(sender, ringThree)
	//POTENTIAL real-time schedule... what's happening now?















	} else if (text == "schedule"){
		sendText(sender, "Ring 1: ADV Female CQ. \nRing 2: INT Female CQ. \nRing 3: Beg Male CQ.")

















































	//pitt wushu contact stuff
	} else if (text == "contact"){
		sendText(sender, "To get in touch:\n\nE-mail: pittwushu@gmail.com\nTel: ‭Alyssa, +1 (717) 977-0886‬")
	} else if((text.includes("thank"))){
		sendText(sender, "You're welcome! You're my favorite human!")
	} else if(text.includes("i love you")) {
		sendText(sender, "WHAT IS LOVE?\nBABY, DON'T HURT ME!\nDON'T HURT ME!\nNO MORE!")
	//greetings
	} else if ((text.includes("hi")) || (text.includes("hola")) || (text.includes("aloha")) || (text.includes("konichiwa")) || 
				(text.includes("hello")) || (text.includes("holla")) || (text.includes("bonjour")) || (text.includes("ni hao")) || 
				(text.includes("sup")) || (text.includes("hey")) || (text.includes("hallo")) || (text.includes("ciao")) || 
				(text.includes("ello")) || (text.includes("yo"))){
		sendText(sender, greetings[Math.floor(Math.random() * greetings.length)])
		//end greetings
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

function sendMapOptions(sender, text){
	let messageData = {
		"attachment":{
	      "type":"template",
	      "payload":{
	        "template_type":"button",
	        "text": text,
	        "buttons":[
	          {
	            "type":"postback",
	            "title":"Fitzgerald Map",
	            "payload":"fitzgerald"
	          },
	          {
	          	"type":"postback",
	            "title":"Surrounding Areas",
	            "payload":"surrounding"
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

function sendLocalMapImage(sender){
	let messageData = {
		"attachment":{
			"type": "image",
			"payload":{
				"url":"https://i.imgur.com/Kxp5RcP.png"
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
			console.log("sending error: " +  error)
		} else if (response.body.error) {
			console.log("response body error: " + JSON.stringify(response.body.error))
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

function sendRules(sender){
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
                "title": "Uniforms/Apparel",
                "payload": "uniformrules"
              },
              {
                "type": "postback",
                "title": "Weapons",
                "payload": "weaponrules"
              },
              {
                "type": "postback",
                "title": "Time Limits",
                "payload": "timelimits"
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
                "title": "Int 24 Taiji",
                "payload": "int24Taiji"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Open Yang",
                "payload": "intOpenTaiji"
              },
              {
                "type": "postback",
                "title": "Int Open Chen",
                "payload": "intOpenChen"
              },
              {
                "type": "postback",
                "title": "Int 42 Fist",
                "payload": "int42Fist"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Trad Open BH",
                "payload": "intTradOpenBH"
              },
              {
                "type": "postback",
                "title": "Int Broadsword",
                "payload": "intBroadsword"
              },
              {
                "type": "postback",
                "title": "Int Straightsword",
                "payload": "intStraightsword"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Nandao",
                "payload": "intNandao"
              },
              {
                "type": "postback",
                "title": "Int Other Weapon",
                "payload": "intOtherWeapon"
              },
              {
                "type": "postback",
                "title": "Int Staff",
                "payload": "intStaff"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Int Spear",
                "payload": "intSpear"
              },
              {
                "type": "postback",
                "title": "Int Southern Staff",
                "payload": "intSouthernStaff"
              },
              {
                "type": "postback",
                "title": "Int Trad Long Weapon",
                "payload": "intTradLongWeapon"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
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
                "title": "Adv Nandao",
                "payload": "advNandao"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Other Weapon",
                "payload": "advOtherWeapon"
              },
              {
                "type": "postback",
                "title": "Adv Staff",
                "payload": "advStaff"
              },
              {
                "type": "postback",
                "title": "Adv Spear",
                "payload": "advSpear"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Southern Staff",
                "payload": "advSouthernStaff"
              },
              {
                "type": "postback",
                "title": "Adv Traditional Long Weapon",
                "payload": "advLongWeapon"
              },
              {
                "type": "postback",
                "title": "Adv Trad Short Weapon",
                "payload": "advTradShortWeapon"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Adv Soft Weapon",
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

function sendSchools(sender){
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
                "title": "Berklee College",
                "payload": "berklee"
              },
              {
                "type": "postback",
                "title": "Cal State U - Long Beach",
                "payload": "calstateLB"
              },
              {
                "type": "postback",
                "title": "Columbia U",
                "payload": "columbia"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Cornell U",
                "payload": "cornell"
              },
              {
                "type": "postback",
                "title": "Harvard U",
                "payload": "harvard"
              },
              {
                "type": "postback",
                "title": "MIT",
                "payload": "mit"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "NYU",
                "payload": "nyu"
              },
              {
                "type": "postback",
                "title": "Northern Arizona U",
                "payload": "nau"
              },
              {
                "type": "postback",
                "title": "THE Ohio State U",
                "payload": "osu"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "Saint Peter's U",
                "payload": "stpeters"
              },
              {
                "type": "postback",
                "title": "San Diego Miramar",
                "payload": "sdmiramar"
              },
              {
                "type": "postback",
                "title": "Stanford U",
                "payload": "stanford"
              }
            ]
          },
          {
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "SUNY Stony Brook",
                "payload": "stonybrook"
              },
              {
                "type": "postback",
                "title": "U Houston",
                "payload": "houston"
              },
              {
                "type": "postback",
                "title": "UMD: Baltimore County",
                "payload": "umbc"
              }
            ]
          },{
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "UMD: College Park",
                "payload": "umcp"
              },
              {
                "type": "postback",
                "title": "U Oregon",
                "payload": "oregon"
              },
              {
                "type": "postback",
                "title": "U Pittsburgh",
                "payload": "pitt"
              }
            ]
          },{
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "U Texas",
                "payload": "texas"
              },
              {
                "type": "postback",
                "title": "U Virginia",
                "payload": "uva"
              },
              {
                "type": "postback",
                "title": "U Washington",
                "payload": "uwash"
              }
            ]
          },{
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "UC Berkeley",
                "payload": "cal"
              },
              {
                "type": "postback",
                "title": "UC Irvine",
                "payload": "uci"
              },
              {
                "type": "postback",
                "title": "UC Los Angeles",
                "payload": "ucla"
              }
            ]
          },{
            "title": "Swipe left/right for more options. On browser, click on arrows in the menu below.",
            "buttons": [
              {
                "type": "postback",
                "title": "UC San Diego",
                "payload": "ucsd"
              },
              {
                "type": "postback",
                "title": "VCU",
                "payload": "vcu"
              },
              {
                "type": "postback",
                "title": "Virginia Tech",
                "payload": "vtech"
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
let wushuMemes = 	[	"https://i.imgur.com/4MAU9s1.jpg",
						"https://i.imgur.com/ULsYtq9.jpg",
						"https://i.imgur.com/dFW0oRC.jpg",
						"https://i.imgur.com/DXGS3gR.jpg",
						"https://i.imgur.com/ZGlyoeO.jpg",
						"https://i.imgur.com/lASlpcj.jpg",
						"https://i.imgur.com/VonH0Lk.jpg",
						"https://i.imgur.com/M4oREX5.jpg",
						"https://i.imgur.com/OnJn0J7.jpg"];

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