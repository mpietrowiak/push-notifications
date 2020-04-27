require('dotenv').config();

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log('Please specify VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY variables!');
  return;
}

const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();

const subscriptionsFilePath = path.join(__dirname, 'subscriptions.json');

function readSubscriptions() {
  let subscriptions = [];
  try {
    subscriptions = JSON.parse(fs.readFileSync(subscriptionsFilePath, 'utf-8'));
  } catch (error) {
    console.error('Falling back to an empty subscriptions list due to a file read error: ', error);
    subscriptions = [];
  }
  return subscriptions;
}

function saveSubscriptions() {
  fs.writeFileSync(subscriptionsFilePath, JSON.stringify(subscriptions), 'utf-8');
}

let subscriptions = readSubscriptions();

const port = process.env.PORT || 5000;
app.use(bodyParser.json());

webpush.setVapidDetails(
  'mailto:test@test.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

app.get('/pubkey', (req, res) => {
  res.status(200).json({ key: process.env.VAPID_PUBLIC_KEY });
});

app.post('/subscribe', (req, res) => {
  const { subscription } = req.body;

  // add a new subscription only if there is no existing subscription with the same endpoint
  if (!subscriptions.some((existingSubscription) => existingSubscription.endpoint === subscription.endpoint)) {
    subscriptions.push(subscription);
  }
  saveSubscriptions();
  res.status(200).json({});
});

app.post('/unsubscribe', (req, res) => {
  const { subscription } = req.body;
  if (subscriptions) {
    subscriptions = subscriptions.filter((existingSubscription) => existingSubscription.endpoint !== subscription.endpoint);
  }
  saveSubscriptions();
  res.status(200).json({});
});

app.post('/send', (req, res) => {
  const { body } = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ body });
  subscriptions.forEach((subscription) => {
    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
  });
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
    
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));