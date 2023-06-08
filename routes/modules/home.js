const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(err => console.error(err))
})

// 搜尋餐廳
router.get('/search', (req, res) => {
  if (!req.query.keyword) {
    return res.redirect('/')
  }

  const keyword = req.query.keyword
  const theKeyword = req.query.keyword.trim().toLowerCase()

  Restaurant.find()
    .lean()
    .then(restaurantsData => {
      const restaurants = restaurantsData.filter(restaurant =>
        restaurant.name.toLowerCase().includes(theKeyword) || restaurant.category.toLowerCase().includes(theKeyword)
      )
      return res.render('index', { keyword, restaurants })
    })
    .catch(err => console.error(err))
})

module.exports = router