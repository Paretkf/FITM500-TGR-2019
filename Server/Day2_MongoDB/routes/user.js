var express = require('express')
var router = express.Router()

var user = require('../models/user.js')

router.get('/', (req, res, next) => {
  user.find().exec(function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.post('/', (req, res, next) => {
  user.create(req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(201)
  })
})

router.get('/:id', (req, res, next) => {
  user.find({ _id: req.params.id }, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.put('/:id', (req, res, next) => {
  user.findByIdAndUpdate(req.params.id, req.body, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

router.delete('/:id', (req, res, next) => {
  user.findByIdAndRemove({ _id: req.params.id }, function (err, payload) {
    if (err) return next(err)
    res.json(payload)
    res.status(200)
  })
})

module.exports = router