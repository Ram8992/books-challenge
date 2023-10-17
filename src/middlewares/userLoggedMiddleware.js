function userLoggedMiddleware (req, res, next) {
  res.locals.isLoged = false;
  res.locals.isAdmin = false;

  if(req.session.userLog) {
    res.locals.isLoged = true;
    res.locals.userLog = req.session.userLog;

    if(req.session.userLog.CategoryId == 1) {
      res.locals.isAdmin = true;
    }
  }
  next();
}

module.exports = userLoggedMiddleware