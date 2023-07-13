const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const User = require('../models/user')

module.exports = app => {
  // 初始化 passport 模組
  app.use(passport.initialize())
  app.use(passport.session())

  // 設定本地登陸策略 
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, req.flash('login_err', '此 Email 尚未註冊'))
        }
        return bcrypt.compare(password, user.password).then(isMatch => {
          if(!isMatch) {
            return done(null, false, req.flash('login_err', 'Email 或 Password 錯誤'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, null))
  }))

  // 設定序列化＆反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}