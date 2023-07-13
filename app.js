// require packages used in the project
const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')

const usePassport = require('./config/passport')
require('./config/mongoose')

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized:true
}))

// setting static files
app.use(express.static('public'))

// 直接從 express 呼叫 body-parser
app.use(express.urlencoded({ extended: true }))

// methodOverride 處理每條需求
app.use(methodOverride('_method'))

// routes 前調用 usePassport
usePassport(app)

// routes
app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})