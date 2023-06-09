const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

const sortMethod = [{ _id: 'asc' }, { name: 'asc' }, { name: 'desc' }, { location: 'asc' }, { category: 'asc' }, { rating: 'desc' }, { rating: 'asc' }]

// 首頁
router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
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
  const sort = req.query.sort

  Restaurant.find()
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