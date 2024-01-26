import express, { Application, Request, Response, NextFunction } from 'express'
import { engine } from 'express-handlebars'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'
import session from 'express-session'
import flash from 'connect-flash'
import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import passport from 'passport'

// Load routes
import ideasRouter from './routes/ideas.js'
import usersRouter from './routes/users.js'

// Passport Config
import passportConfig from './config/passport.js'
passportConfig(passport)

const app: Application = express()

// Connect to mongoose
mongoose
  .connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch((err: any) => console.error(err))

// Handlebars Middleware
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Static folder
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

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Flash middleware
app.use(flash())

// Global variables
app.use((req: Request, res: Response, next: NextFunction) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user || null
  next()
})

const port: number = 5000

// Index Route
app.get('/', (req: Request, res: Response) => {
  const title: string = 'Welcome!'
  res.render('index', {
    title: title,
  })
})

// About Route
app.get('/about', (req: Request, res: Response) => {
  res.render('about')
})

// Use routes
app.use('/ideas', ideasRouter)
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
