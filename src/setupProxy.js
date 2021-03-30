const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/auth/github',
		createProxyMiddleware({
			target: 'http://localhost:3001/',
		})
	);
	app.use(
		'/auth/github/callback',
		createProxyMiddleware({
			target: 'http://localhost:3001/',
		})
	);
	app.use(
		'/logout',
		createProxyMiddleware({
			target: 'http://localhost:3001/',
		})
	);
};
