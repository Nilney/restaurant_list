// require packages used in the project
const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')

const app = express()
const port = 3000
require('./config/mongoose')

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// setting static files
app.use(express.static('public'))

// 直接從 express 呼叫 body-parser
app.use(express.urlencoded({ extended: true }))

// methodOverride 處理每條需求
app.use(methodOverride('_method'))

// routes
app.use(routes)

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})