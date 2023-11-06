import express from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'

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

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
