import express from 'express'
import { engine } from 'express-handlebars'

const app = express()

// Handlebars Middleware
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

const port = 5000

// Index Route
app.get('/', (req, res) => {
  res.render('index')
})

// About Route
app.get('/about', (req, res) => {
  res.render('about')
})

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
