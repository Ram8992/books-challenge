const admMiddleware = (req, res, next) => {

    if (!req.session.userLog || req.session.userLog.CategoryId != 1) {
        return res.redirect('/users/login')
    } else {
        next();
    }


}


module.exports = admMiddleware;