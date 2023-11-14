import { Strategy as LocalStrategy } from 'passport-local'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

// Load user model
const User = mongoose.model('users')

const passportConfig = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email,
      }).then((user) => {
        if (!user) {
          // Function format: done(error, user, messa)
          return done(null, false, { message: 'No User Found' })
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Password Incorrect' })
          }
        })
      })
    })
  )
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })
  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .exec()
      .then((user) => {
        done(null, user)
      })
      .catch((err) => {
        done(err, false, { message: 'Error deserializing user' })
      })
  })
}

export default passportConfig
