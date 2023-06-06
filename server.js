if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const ideaRouter = require('./routes/ideas')
const templateRouter = require('./routes/templates')
const learnRouter = require('./routes/learn')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(express.static('public'))


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/ideas', ideaRouter)
app.use('/templates', templateRouter)
app.use('/learn', learnRouter)


app.listen(process.env.PORT || 3000)