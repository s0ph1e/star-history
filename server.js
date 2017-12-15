const express = require('express');
const http = require('http');
const path = require('path');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const cookieName = 'gh_data';

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_APP_ID,
		clientSecret: process.env.GITHUB_APP_SECRET
	},
	(accessToken, refreshToken, profile, done) => {
		process.nextTick(() => done(null, {accessToken, profile}));
	}
));

const app = express();

app.set('port', process.env.PORT || 3001);
app.use(passport.initialize());
app.use(express.static('build'));

app.get('/auth/github', passport.authenticate('github', {}));

app.get('/auth/github/callback',
	passport.authenticate('github', {}),
	(req, res) => {
		const githubData = {
			accessToken: req.user.accessToken,
			username: req.user.profile._json.login
		};
		res.cookie(cookieName, JSON.stringify(githubData));
		res.redirect('/');
	}
);

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/build/index.html'));
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
