## Star history

Display star history for github repositories

### Requirements

* nodejs version >= 12
* npm version >= 6
* Github OAuth App - can be set up in [settings](https://github.com/settings/developers) (needed to authenticate github users)
  * For "Authorization callback URL" field use `http://localhost:3000/auth/github/callback` (for development)

### Install and run

* `npm i`
* set environment variables `GITHUB_APP_ID` and `GITHUB_APP_SECRET` - id and secret for Oauth App

#### Development

* `npm start` - run both client and server
* `npm run start:client` - run client app on [localhost:3000](http://localhost:3000/)
* `npm run start:server` - run server app on [localhost:3001](http://localhost:3001/)

```sh
# Example 
npm i
GITHUB_APP_ID="XXXX" GITHUB_APP_SECRET="XXXX" npm start
```

#### Production
* `npm run build` - build client app
* run `server.js` file with your favourite process management tool

```sh
# Example
npm i
npm run build
PORT="XXXX" GITHUB_APP_ID="XXXX" GITHUB_APP_SECRET="XXXX" pm2 start server.js
```
