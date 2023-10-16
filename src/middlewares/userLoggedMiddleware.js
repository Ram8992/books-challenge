function userLoggedMiddleware (req, res, next) {
    res.locals.isLoged = false;
  
    if( req.session.userLog) {
      res.locals.isLoged = true;
      res.locals.userLog = req.session.userLog;

    }
    
    next();
  }
  
  module.exports = userLoggedMiddleware