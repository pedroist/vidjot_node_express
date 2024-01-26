import express, { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import passport from 'passport'

const usersRouter = express.Router()

// Load User Model
import '../models/User.js'
const User = mongoose.model('users')

// User Login Route
usersRouter.get('/login', (req: Request, res: Response) => {
  res.render('users/login')
})

// Login Form Post
usersRouter.post(
  '/login',
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', {
      successRedirect: '/ideas',
      failureRedirect: '/users/login',
      failureFlash: true,
    })(req, res, next)
  }
)

// User Register Route
usersRouter.get('/register', (req: Request, res: Response) => {
  res.render('users/register')
})

// Register Form POST
usersRouter.post('/register', (req: Request, res: Response) => {
  let errors: { text: string }[] = []

  if (req.body.password !== req.body.password2) {
    errors.push({ text: 'Passwords do not match' })
  }

  if (req.body.password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' })
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2,
    })
  } else {
    // Check if user already exists
    User.findOne({ email: req.body.email }).then((user: any) => {
      if (user) {
        req.flash('error_msg', 'Email already registered')
        res.redirect('/users/register')
      } else {
        // User is new
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err
            newUser.password = hash
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                )
                res.redirect('/users/login')
              })
              .catch((err) => {
                console.error(err)
                return
              })
          })
        })
      }
    })
  }
})

// Logout user
usersRouter.get(
  '/logout',
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) {
        return next(err)
      }
      req.flash('success_msg', 'You are logged out')
      res.redirect('/users/login')
    })
  }
)

export default usersRouter
