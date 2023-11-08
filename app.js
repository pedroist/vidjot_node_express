import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import flash from 'connect-flash'

const app = express()

// Load routes
import ideasRouter from './routes/ideas.js'

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

// User Login Route
app.get('/users/login', (req, res) => {
  res.send('Login')
})

// User Register Route
app.get('/users/register', (req, res) => {
  res.send('Register')
})

// Use routes
app.use('/ideas', ideasRouter)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
