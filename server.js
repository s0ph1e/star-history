const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const path = require('path');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const GithubApi = require('@octokit/rest');

const cookieName = 'gh_data';
const oneYear = 1000 * 60 * 60 * 24 * 365;

const clientID = process.env.GITHUB_APP_ID;
const clientSecret = process.env.GITHUB_APP_SECRET;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new GitHubStrategy({clientID, clientSecret},
	(accessToken, refreshToken, profile, done) => {
		process.nextTick(() => done(null, {accessToken, profile}));
	}
));

const app = express();

app.set('port', process.env.PORT || 3001);
app.use(cookieParser());
app.use(passport.initialize());

app.get('/static', app.use(express.static('build')));

app.get('/auth/github', passport.authenticate('github', {}));
app.get('/auth/github/callback',
	passport.authenticate('github', {}),
	(req, res) => {
		const githubData = {
			accessToken: req.user.accessToken,
			username: req.user.profile._json.login
		};
		res.cookie(cookieName, JSON.stringify(githubData), { expires: new Date(Date.now() + oneYear) });
		res.redirect('/');
	}
);

app.get('/logout', (req, res) => {
	res.clearCookie(cookieName);
	res.redirect('/');
});

app.get('*',
	checkAccessToken,
	(req, res) => res.sendFile(path.join(__dirname + '/build/index.html'))
);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

function checkAccessToken (req, res, next) {
	const accessToken = getAccessToken(req.cookies[cookieName]);

	if (accessToken) {
		const github = new GithubApi({});
		github.authenticate({
			type: 'basic',
			username: clientID,
			password: clientSecret
		});
		github.authorization.check({
			client_id: clientID,
			access_token: accessToken
		}).then(() => next()).catch(() => {
			res.clearCookie(cookieName);
			next();
		});
	} else {
		res.clearCookie(cookieName);
		next();
	}
}

function getAccessToken(cookie) {
	if (!cookie) {
		return null;
	}

	try {
		const githubData = JSON.parse(cookie);
		return githubData ? githubData.accessToken : null;
	} catch (e) {
		return null;
	}
}
