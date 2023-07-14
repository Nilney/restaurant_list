const express = require('express')
const Handlebars = require('handlebars')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

const sortMethod = [{ _id: 'asc' }, { name: 'asc' }, { name: 'desc' }, { location: 'asc' }, { category: 'asc' }, { rating: 'desc' }, { rating: 'asc' }]

// 協助於handlebars判別
Handlebars.registerHelper('if_eq', function (sort, value, selected) {
  if (sort === value) {
    return selected.fn(this)
  } else {
    return selected.inverse(this)
  }
})

// 首頁
router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.error(err))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const theKeyword = req.query.keyword.trim().toLowerCase()
  const sort = req.query.sort
  const userId = req.user._id

  Restaurant.find({ userId })
    .lean()
    .sort(sortMethod[sort])
    .then(restaurantsData => {
      const restaurants = restaurantsData.filter(restaurant =>
        restaurant.name.toLowerCase().includes(theKeyword) || restaurant.category.toLowerCase().includes(theKeyword)
      )
      return res.render('index', { keyword, restaurants, sort })
    })
    .catch(err => console.error(err))
})

module.exports = router