import express from 'express'
import mongoose from 'mongoose'

const ideasRouter = express.Router()

// Load Idea Model
import '../models/Idea.js'
const Idea = mongoose.model('ideas')

// Idea Index Page
ideasRouter.get('/', (req, res) => {
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
ideasRouter.get('/add', (req, res) => {
  res.render('ideas/add')
})

// Edit Idea Form
ideasRouter.get('/edit/:id', (req, res) => {
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
ideasRouter.post('/', (req, res) => {
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
ideasRouter.put('/:id', (req, res) => {
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
ideasRouter.delete('/:id', (req, res) => {
  Idea.findByIdAndDelete(req.params.id).then((idea) => {
    req.flash('success_msg', 'Video idea removed')
    res.redirect('/ideas')
  })
})

export default ideasRouter
