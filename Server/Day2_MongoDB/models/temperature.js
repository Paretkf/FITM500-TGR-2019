var mongoose = require('mongoose')
var temperature = new mongoose.Schema({
  teamID: String,
  temp: Number
})

module.exports = mongoose.model('temperature', temperature)