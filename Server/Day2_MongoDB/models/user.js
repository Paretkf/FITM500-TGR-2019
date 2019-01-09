var mongoose = require('mongoose')
var user = new mongoose.Schema({
  name: String,
  address: String,
  position: String,
  salary: Number,
  update_at : {type: Date, default: Date.now }
})

module.exports = mongoose.model('user', user)