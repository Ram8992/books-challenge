const db = require('../database/models');

const cookieExiste = async (req,res,next) => {
  if(!req.session.userLog && req.cookies.recordame) {
    const user = await db.User.findByPk(req.cookies.recordame)
    delete user.Pass
    req.session.userLog = user
    res.locals.isLoged = true;
    res.locals.userLog = user;
  }
  next()
}

module.exports = cookieExiste