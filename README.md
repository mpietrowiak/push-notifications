# Push Notifications in React

Push notifications demo as a coding interview project. Includes the whole package: frontend and a backend.

## What is supported

**Desktop**: Google Chrome, Firefox, MS Edge.
**Android**: Google Chrome

## What is not supported

Safari is not supported as it requires a non standard implementation and also having an Apple Developer account which I don't have. I might implement a solution in the future.

Chrome for iOS is also not supported as it doesn't support service workers for now.

You must use HTTPS for service workers to work, unless you are developing on localhost.

## Prerequisites
1. `yarn` to install server dependencies
2. `cd client; yarn` to install client dependencies
3. Run `./node_modules/web-push/src/cli.js generate-vapid-keys` to generate a VAPID key pair.
4. Save the newly generated keypair.

## Local development
1. Put the generated variables into `.env` file as `VAPID_PUBLIC_KEY=xxxx` and `VAPID_PRIVATE_KEY=xxxx`, each on separate lines.
2. Run `yarn dev` in the project root

## Production deployment (Heroku)
1. Create an app in Heroku and set it up so this repository is used.
2. Go to your Heroku dashboard and set the Config Vars in the Settings tab of your app. The variables to set are the ones mentioned in the local development section of this article.

**Note:** `heroku-postbuild` script is added so the client is built automatically after the `start` script is run. So all should work out of the box.

## Demo

See https://matas-push-notifications.herokuapp.com/
