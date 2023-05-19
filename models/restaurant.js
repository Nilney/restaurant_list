const mongoose = require('mongoose')
const Schema = mongoose.Schema

const restaurantSchema = new Schema({
  name: { type: String, require: true },
  name_en: { type: String, require: true },
  category: { type: String, require: true },
  image: { type: String, require: true },
  location: { type: String, require: true },
  phone: { type: String, require: true },
  google_map: { type: String, required: true },
  rating: { type: Number, required: true },
  description: { type: String, required: true },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)