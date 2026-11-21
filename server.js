import express from 'express';
import cookieParser from 'cookie-parser';
import http from 'node:http';
import path from 'node:path';
import crypto from 'node:crypto';
import { getWebFlowAuthorizationUrl, exchangeWebFlowCode, checkToken } from '@octokit/oauth-methods';

const buildDir = path.join(import.meta.dirname, 'build');

const cookieName = 'gh_data';
const stateCookieName = 'gh_oauth_state';
const oneYear = 1000 * 60 * 60 * 24 * 365;
const tenMinutes = 1000 * 60 * 10;

const clientId = process.env.GITHUB_APP_ID;
const clientSecret = process.env.GITHUB_APP_SECRET;
const clientType = 'oauth-app';

const app = express();

app.set('port', process.env.PORT || 3001);
app.use(cookieParser());

// index.html is served by the catch-all route below, after the token check
app.use(express.static(buildDir, { index: false }));

// OAuth web flow: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow
// The callback URL is the one configured in the OAuth App settings.
app.get('/auth/github', (req, res) => {
	const state = crypto.randomBytes(16).toString('hex');
	res.cookie(stateCookieName, state, stateCookieOptions(req));
	const { url } = getWebFlowAuthorizationUrl({ clientType, clientId, state });
	res.redirect(url);
});

app.get('/auth/github/callback', async (req, res) => {
	const { code, state } = req.query;
	const expectedState = req.cookies[stateCookieName];
	res.clearCookie(stateCookieName, stateCookieOptions(req));

	if (!code || !state || !expectedState || !safeEqual(state, expectedState)) {
		console.warn('Github auth callback rejected: missing code or state mismatch');
		return res.redirect('/');
	}

	try {
		const { authentication } = await exchangeWebFlowCode({ clientType, clientId, clientSecret, code });
		const { data } = await checkToken({ clientType, clientId, clientSecret, token: authentication.token });
		const githubData = {
			accessToken: authentication.token,
			username: data.user.login
		};
		res.cookie(cookieName, JSON.stringify(githubData), { expires: new Date(Date.now() + oneYear) });
	} catch (err) {
		console.warn('Github auth callback failed', err);
	}
	res.redirect('/');
});

app.get('/logout', (req, res) => {
	res.clearCookie(cookieName);
	res.redirect('/');
});

app.get('/{*splat}',
	checkAccessToken,
	(req, res) => res.sendFile(path.join(buildDir, 'index.html'))
);

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

async function checkAccessToken (req, res, next) {
	const accessToken = getAccessToken(req.cookies[cookieName]);

	if (accessToken) {
		try {
			await checkToken({ clientType, clientId, clientSecret, token: accessToken });
			next();
		} catch (err) {
			console.warn('Github auth failed', err);
			res.clearCookie(cookieName);
			next();
		}
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
	} catch {
		return null;
	}
}

function stateCookieOptions(req) {
	return { httpOnly: true, sameSite: 'lax', secure: req.secure, maxAge: tenMinutes, path: '/auth/github' };
}

function safeEqual(a, b) {
	const bufA = Buffer.from(String(a));
	const bufB = Buffer.from(String(b));
	return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}
