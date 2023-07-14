const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const db = require('../../config/mongoose')
const Restaurant = require('../restaurant')
const User = require('../user')

const restaurantList = require('./restaurant.json').results
const userList = require('./seedUsers.json')
const restaurant = require('../restaurant')

db.once('open', () => {
  Promise.all(
    // 若種子使用者不存在 建立至資料庫中
    userList.map((seedUser) => {
      const { name, email, password, restaurantIndex } = seedUser
      return User.findOne({ email }).then(user => {
        if (!user) {
          return bcrypt
            .genSalt(10)
            .then(salt => bcrypt.hash(password, salt))
            .then(hash => User.create({
              name,
              email,
              password: hash,
            }))
            // 若該種子資料的餐廳不存在 建立至資料庫中
            .then(createdUser => {
              const userId = createdUser._id
              return Promise.all(
                restaurantIndex.map(index => {
                  const { id } = restaurantList[index]
                  return Restaurant.findOne({ id }).then(existRestaurant => {
                    if (!existRestaurant) {
                      return Restaurant.create({ ...restaurantList[index], userId })
                    }
                    // 若餐廳已存在 更新其userId
                    existRestaurant.userId = userId
                    return existRestaurant.save()
                  })
                })
              )
            })
            .catch(err => console.error(err))
        }
        // 若種子使用者已存在 確認餐廳是否存在 若不存在 建立餐廳至資料庫中
        const userId = user._id
        return Promise.all(
          restaurantIndex.map(index => {
            const { id } = restaurantList[index]
            return Restaurant.findOne({ id, userId }).then(existRestaurant => {
              if (!existRestaurant) {
                return Restaurant.create({ ...restaurantList[index], userId})
              }
            })
          })
        )
      })
    })
  )
  .then(() => {
    console.log('done!')
    process.exit()
  })
  .catch(err => console.error(err))
})