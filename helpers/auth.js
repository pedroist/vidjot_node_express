export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // from passport.js
    return next()
  }
  req.flash('error_msg', 'Not Authorized')
  res.redirect('/users/login')
}
