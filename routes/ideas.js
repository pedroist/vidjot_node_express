import express from 'express'
import mongoose from 'mongoose'
import { ensureAuthenticated } from '../helpers/auth.js'

const ideasRouter = express.Router()

// Load Idea Model
import '../models/Idea.js'
const Idea = mongoose.model('ideas')

// Idea Index Page
ideasRouter.get('/', ensureAuthenticated, (req, res) => {
  console.log(req.user)
  Idea.find({ user: req.user.id })
    .lean() // converts into json from mongoose objects. Without this it gives errors
    .sort({ date: 'desc' })
    .then((ideas) => {
      res.render('ideas/index', {
        ideas: ideas,
      })
    })
})

// Add Idea Form
ideasRouter.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add')
})

// Edit Idea Form
ideasRouter.get('/edit/:id', ensureAuthenticated, (req, res) => {
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
ideasRouter.post('/', ensureAuthenticated, (req, res) => {
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
      user: req.user.id,
    }
    new Idea(newUser).save().then((idea) => {
      req.flash('success_msg', 'Video idea added')
      res.redirect('/ideas')
    })
  }
})

// Edit Form Process
ideasRouter.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id,
  }).then((idea) => {
    //Protect other users to use url with id of idea from other user to edit his idea
    if (req.params.id !== req.user.id) {
      req.flash('error_msg', 'Not Authorized')
      req.redirect('/users/login')
    }

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
ideasRouter.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then((idea) => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
  })
})

export default ideasRouter
