const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
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
          if (!isMatch) {
            return done(null, false, req.flash('login_err', 'Email 或 Password 錯誤'))
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, null))
  }))

  // 設定 Facebook 登入策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },
   (accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        // 若沒有註冊過 則往下進行
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, null))
      })
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