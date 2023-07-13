const express = require('express')
const router = express.Router()

const Restaurant = require('../../models/restaurant')

// 新增餐廳
router.get('/new', (req, res) => {
  res.render('new')
})

router.post('/', (req, res) => {
  const userId = req.user._id
  const newRestaurant = req.body
  newRestaurant.userId = userId
  Restaurant.create(newRestaurant)
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

// 瀏覽特定餐廳
router.get('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(err => console.error(err))
})

// 編輯餐廳頁面
router.get('/:restaurant_id/edit', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(err => console.error(err))
})

// 編輯餐廳
router.put('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.updateOne({ _id, userId }, req.body) // 嘗試更新寫法
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(err => console.error(err))
})

// 刪除餐廳
router.delete('/:restaurant_id', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant_id
  Restaurant.deleteOne({ _id, userId }) // 嘗試更新寫法
    .then(() => res.redirect('/'))
    .catch(err => console.error(err))
})

module.exports = router