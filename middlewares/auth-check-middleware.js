function checkAuthStatus(req,res,next) {
	const uid = req.session.uid;

	if (!uid) {
		return next();
	}

	res.locals.uid = uid;
	res.locals.isAuth = true;
	res.locals.isAdmin = req.session.isAdmin; //sets in Util folder when login
	next();
}

module.exports = checkAuthStatus;