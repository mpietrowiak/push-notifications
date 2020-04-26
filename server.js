require('dotenv').config();

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  console.log('Please specify VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY variables!');
  return;
}

const webpush = require('web-push');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

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

app.post('/send', (req, res) => {
  const { subscription, title } = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title });
  webpush.sendNotification(subscription, payload).catch(err => console.error(err));
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