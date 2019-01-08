const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
let fs = require('fs')

app.use(bodyParser.json({ limit: '50mb', extended: true }))

app.get('/', (req, res) => {
  res.send({
    current_date: new Date(),
    message: 'Hello My Server'
  })
})

app.get('/listUsers', function (req, res) {
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
    res.status(200)
    res.send(JSON.parse(data))
  })
})

app.get('/showbyID/:id', function (req, res) {
  let id = req.params.id
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
    data = JSON.parse(data)
    res.send(data['user' + id])
  })
})

app.post('/addUser', function (req, res) {
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
    data = JSON.parse(data)
    let arrofkey = Object.keys(data)
    let key = parseInt(data['user' + arrofkey.length].id)
    while (arrofkey.findIndex(a => a === 'user' + key) !== -1) {
      key++
    }
    req.body.id = key
    data['user' + key] = req.body
    let jsondata = JSON.stringify(data)
    fs.writeFile('users.json', jsondata, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        res.status(400)
        res.send(err)
      }
    })
    res.status(201)
    res.send(data)
  })
})

app.post('/addMultiUser', function (req, res) {
  // First read existing users.
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
    data = JSON.parse(data)
    let numData = Object.keys(req.body)
    for (let i = 0; i < numData.length; i++) {
      let arrofkey = Object.keys(data)
      let key = parseInt(data['user' + arrofkey.length].id)
      while (arrofkey.findIndex(a => '' + a === 'user' + key) !== -1) {
        key++
      }
      req.body[i].id = key
      data['user' + key] = req.body[i]
    }
    let jsondata = JSON.stringify(data)
    fs.writeFile('users.json', jsondata, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        res.status(400)
        res.send(err)
      }

    })
    res.status(201)
    res.send(data)
  })
})

app.delete('/deleteUser/:id', function (req, res) {
  let id = req.params.id
  fs.readFile(__dirname + '/' + 'users.json', 'utf8', function (err, data) {
    data = JSON.parse(data)
    delete data['user' + id]
    let jsondata = JSON.stringify(data)
    fs.writeFile('users.json', jsondata, 'utf8', (err, data) => {
      if (err) {
        console.log(err)
        res.status(400)
        res.send(err)
      }
    })
    res.status(200)
    res.send(data)
  })
})

let server = app.listen(port, () => {
  let port = server.address().port
  console.log('Start server at port ' + port + ' >> localhost:' + port)
})