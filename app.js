import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

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

// Add Idea Form
app.get('/add', (req, res) => {
  res.render('ideas/add')
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
      res.redirect('/ideas')
    })
  }
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
