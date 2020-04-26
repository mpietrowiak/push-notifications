# Push Notifications in React

Push notifications demo as a coding interview project. Includes whole package: frontend and a backend.

## Prerequisites

1. Run `./node_modules/web-push/src/cli.js generate-vapid-keys` to generate a VAPID key pair.
2. Save the newly generated keypair.

## Local development

1. Put the generated variables into `.env` file as `VAPID_PUBLIC_KEY=xxxx` and `VAPID_PRIVATE_KEY=xxxx`, each on separate lines.
2. `yarn` to install server dependencies
2. `cd client; yarn` to install client dependencies
3. Come back to the project root and run `yarn dev`

## Production deployment (Heroku)

1. Create an app in Heroku and set it up so this repository is used.
2. Go to your Heroku dashboard and set the Config Vars in the Settings tab of your app. The variables to set are the ones mentioned in the local development section of this article.

**Note:** `heroku-postbuild` script is added so the client is built automatically after the `start` script is run. So all should work out of the box.

## Demo

See https://matas-push-notifications.herokuapp.com/