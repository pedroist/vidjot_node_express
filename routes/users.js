import express from 'express'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
//import passport from 'passport'

const usersRouter = express.Router()

// Load User Model
import '../models/User.js'
const User = mongoose.model('users')

// User Login Route
usersRouter.get('/login', (req, res) => {
  res.render('users/login')
})

// User Register Route
usersRouter.get('/register', (req, res) => {
  res.render('users/register')
})

// Register Form POST
usersRouter.post('/register', (req, res) => {
  let errors = []

  if (req.body.password != req.body.password2) {
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
    User.findOne({ email: req.body.email }).then((user) => {
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
                console.log(err)
                return
              })
          })
        })
      }
    })
  }
})

export default usersRouter
