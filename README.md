## Star history

Display star history for github repositories

### Requirements

* nodejs version >= 8
* npm version >= 5
* Github OAuth App - can be set up in [settings](https://github.com/settings/developers) (needed to authenticate github users)

### Install and run

* `npm i`
* set environment variables `GITHUB_APP_ID` and `GITHUB_APP_SECRET` - id and secret for Oauth App

#### Development

* `npm start` - run both client and server
* `npm run start:client` - run client app on [localhost:3000](http://localhost:3000/)
* `npm run start:server` - run server app on [localhost:3001](http://localhost:3001/)

```sh
# Example 
GITHUB_APP_ID="XXXX" GITHUB_APP_SECRET="XXXX" npm start
```

#### Production
* `npm rub build` - build client app
* run `server.js` file with your favourite process management tool

```sh
# Example
PORT="XXXX" GITHUB_APP_ID="XXXX" GITHUB_APP_SECRET="XXXX" pm2 start server.js
```
