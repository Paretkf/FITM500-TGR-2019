var express = require('express')
var router = express.Router()

var temperature = require('../models/temperature.js')

router.get('/showData', (req, res, next) => {
  temperature.find().exec(function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.post('/addData', (req, res, next) => {
  temperature.create(req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(201)
  })
})

router.post('/receiveData', (req, res, next) => {
  temperature.create({
    teamID: '10',
    temp: req.body.payload_parsed.frames[0].value
  }, function (err, payload) {
    if (err) return next(err)
    console.log(req.body)
    res.json(payload)
    res.status(201)
  })
})

router.put('/editData/:teamID', (req, res, next) => {
  temperature.findOneAndUpdate({ teamID: req.params.teamID }, req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.delete('/deleteData/:teamID', (req, res, next) => {
  temperature.findOneAndRemove({ teamID: req.params.teamID }, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

module.exports = router