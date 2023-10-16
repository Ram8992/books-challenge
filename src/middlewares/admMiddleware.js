const admMiddleware = (req, res, next) => {

    if (!req.session.userLog || req.session.userLog.Category.Id != 1) {
        return res.redirect('/login')
    } else {
        next();
    }


}


module.exports = admMiddleware;