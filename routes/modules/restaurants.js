const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 新增餐廳
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const newRestaurant = req.body
  Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// 瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.error(err))
})

// 編輯餐廳頁面
router.get('/:restaurant_id/edit', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  Restaurant.findById(restaurant_id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.error(err))
})

// 編輯餐廳
router.put('/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  Restaurant.updateOne({ _id: restaurant_id }, req.body) // 嘗試更新寫法
    .then(() => res.redirect(`/restaurants/${restaurant_id}`))
    .catch(err => console.error(err))
})

// 刪除餐廳
router.delete('/:restaurant_id', (req, res) => {
  const restaurant_id = req.params.restaurant_id
  Restaurant.deleteOne({ _id: restaurant_id }) // 嘗試更新寫法
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

module.exports = router