import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import flash from 'connect-flash'

const app = express()

// Load Idea Model
import './models/Idea.js'
const Idea = mongoose.model('ideas')

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

// Idea Index Page
app.get('/ideas', (req, res) => {
  Idea.find({})
    .lean() // converts into json from mongoose objects. Without this it gives errors
    .sort({ date: 'desc' })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas: ideas,
      })
    })
})

// Add Idea Form
app.get('/ideas/add', (req, res) => {
  res.render('ideas/add')
})

// Edit Idea Form
app.get('/ideas/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  })
    .lean()
    .then((idea) => {
      res.render('ideas/edit', {
        idea: idea,
      })
    })
})

// Process Form
app.post('/ideas', (req, res) => {
  let errors = []

  if (!req.body.title) {
    errors.push({ text: 'Please add a title' })
  }
  if (!req.body.details) {
    errors.push({ text: 'Please add some details' })
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details,
    })
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
    }
    new Idea(newUser).save().then((idea) => {
      req.flash('success_msg', 'Video idea added')
      res.redirect('/ideas')
    })
  }
})

// Edit Form Process
app.put('/ideas/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    // new values
    idea.title = req.body.title
    idea.details = req.body.details

    idea.save().then((idea) => {
      req.flash('success_msg', 'Video idea updated')
      res.redirect('/ideas')
    })
  })
})

// Delete Idea
app.delete('/ideas/:id', (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then((idea) => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
  })
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
