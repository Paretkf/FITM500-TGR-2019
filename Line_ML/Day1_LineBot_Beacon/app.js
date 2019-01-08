const bodyParser = require('body-parser')
const request = require('request')
const express = require('express')

const app = express()
const port = process.env.PORT || 4000
const hostname = '127.0.0.1'
const HEADERS = {
	'Content-Type': 'application/json',
	'Authorization': 'Bearer {E8hLTMRB8ih0niTXAzNCL26xHFZVIZTFOzuv5JPePXm5EoBlp6tsdgVov5iOpFN9L1B8niE4I6gHrRhIM60gHu0fI7Goqs7Sp9PSLRCmHZaj27lA5SariNFFcosCCj8b2ildH95pIyGE2CnvSN+YhwdB04t89/1O/w1cDnyilFU=}'
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Push
app.get('/webhook', (req, res) => {
	const result = push('I am Lisa blackpink')
	res.status(200).send({
		msg: 'success',
		success: 1,
		date: new Date()
	})
})

// Reply
app.post('/webhook', (req, res) => {
	// reply block
	let reply_token = req.body.events[0].replyToken
	if (req.body.events[0].type === 'beacon') {
		reply(reply_token, JSON.stringify(req.body.events[0]))
	} else {
		reply(reply_token, req.body.events[0].message.text)
	}
  res.sendStatus(200)
})

function push(msg) {
	let body = JSON.stringify({
		to: 'Ud0ddba9710e3e87899856dc317d4006c',
		messages: [
			{
				type: 'text',
				text: msg
			}
		]
	})
	curl('push', body)
}

function reply(reply_token, msg) {
	let body = JSON.stringify({
    replyToken: reply_token,
		messages: [{
				type: 'text',
				text: msg
		}]
  })
  curl('reply', body)
}

function curl(method, body) {
	request.post({
		url: 'https://api.line.me/v2/bot/message/' + method,
		headers: HEADERS,
		body: body
	}, (err, res, body) => {
		console.log('status = ' + res.statusCode)
		console.log('error = ' + err)
	})
}

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`)
})
