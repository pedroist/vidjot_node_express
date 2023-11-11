import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import flash from 'connect-flash'
import path from 'path'

const app = express()

// Load routes
import ideasRouter from './routes/ideas.js'
import usersRouter from './routes/users.js'

// Connect to mongoose
mongoose
  .connect('mongodb://localhost/vidjot-dev')
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err))

// Handlebars Middleware
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
// app.use(express.static(path.join(__dirname, 'public')))
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))

// Method-override middleware using query value
app.use(methodOverride('_method'))

// Express-session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
)
// Flash middleware
app.use(flash())

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  //res.locals.user = req.user || null;
  next()
})

const port = 5000

// Index Route
app.get('/', (req, res) => {
  const title = 'Welcome!'
  res.render('index', {
    title: title,
  })
})

// About Route
app.get('/about', (req, res) => {
  res.render('about')
})

// Use routes
app.use('/ideas', ideasRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
