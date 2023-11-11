import express from 'express'
import mongoose from 'mongoose'

const usersRouter = express.Router()

// User Login Route
usersRouter.get('/login', (req, res) => {
  res.render('users/login')
})

// User Register Route
usersRouter.get('/register', (req, res) => {
  res.render('users/register')
})

export default usersRouter
