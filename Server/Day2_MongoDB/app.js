const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT || 8080
const mongoose = require('mongoose')
const logger = require('morgan')

//Import File
var user = require('./routes/user')
var temperature = require('./routes/temperature')

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://fitm500:fitm500@localhost/hwData', { useMongoClient: true, promiseLibrary: require('bluebird') })
  .then(() => console.log('MongoDB Connection Succesful'))
  .catch((err) => console.error(err))

app.use(logger('dev'))
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// Route
app.use('/user', user)
app.use('', temperature)

app.get('/', (req, res) => {
  res.status(200)
  res.send('RESTFul-API @FITM500-TGR2019')
})

let server = app.listen(port, () => {
  let port = server.address().port
  console.log('Start server at port ' + port + ' >> localhost:' + port)
})