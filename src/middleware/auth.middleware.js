export const requireAuth = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/login');
};

export const requireAuthApi = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.status(401).json({ error: 'Authentication required' });
};
