if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const empathizeRouter = require('./routes/empathizes/empathize')
const defineRouter = require('./routes/defines/define')
const ideateRouter = require('./routes/ideates/ideate')
const prototypeRouter = require('./routes/prototypes/prototype')
const testRouter = require('./routes/tests/test')
const ideateNoteRouter = require('./routes/ideates/ideatenotes')
const empathizeNoteRouter = require('./routes/empathizes/empathizenotes')
const empathyMapRouter = require('./routes/empathizes/empathymaps')
const journeyMapRouter = require('./routes/empathizes/journeymaps')
const personaRouter = require('./routes/empathizes/personas')
const abstractionLadderRotuer = require('./routes/defines/abstractionladders')
const povstatementRouter = require('./routes/defines/povstatements')
const rockRouter = require('./routes/defines/rocks')
const postItRouter = require('./routes/ideates/post-its')
const linkRouter = require('./routes/links')
const keywordRouter = require('./routes/ideates/keywords')
const prototypesRouter = require('./routes/prototypes/prototypes')
const typeRouter = require('./routes/prototypes/types')
const testNoteRouter = require('./routes/tests/testnotes')
const ideationTypeRouter = require('./routes/ideates/ideationtypes')
const ideationSessionRouter = require('./routes/ideates/ideationsessions')
const testingRouter = require('./routes/tests/testings')
const dataRouter = require('./routes/tests/datas')
const goalRouter = require('./routes/tests/goals')
// const templateRouter = require('./routes/templates')
const learnRouter = require('./routes/learn')
const createRouter = require('./routes/create')


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
app.use('/empathize', empathizeRouter)
app.use('/define', defineRouter)
app.use('/ideate', ideateRouter)
app.use('/prototype', prototypeRouter)
app.use('/test', testRouter)
// app.use('/templates', templateRouter)
app.use('/learn', learnRouter)
app.use('/create', createRouter)
app.use('/ideatenotes', ideateNoteRouter)
app.use('/empathizenotes', empathizeNoteRouter)
app.use('/empathymaps', empathyMapRouter)
app.use('/journeymaps', journeyMapRouter)
app.use('/personas', personaRouter)
app.use('/abstractionladders', abstractionLadderRotuer)
app.use('/povstatements', povstatementRouter)
app.use('/rocks', rockRouter)
app.use('/post-its', postItRouter)
app.use('/links', linkRouter)
app.use('/keywords', keywordRouter)
app.use('/prototypes', prototypesRouter)
app.use('/types', typeRouter)
app.use('/testnotes', testNoteRouter)
app.use('/ideationtypes', ideationTypeRouter)
app.use('/ideationsessions', ideationSessionRouter)
app.use('/testing', testingRouter)
app.use('/datas', dataRouter)
app.use('/goals', goalRouter)

app.listen(process.env.PORT || 3000)