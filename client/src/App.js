import React, { Component } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import { styled } from '@material-ui/core/styles';

const StyledPaper = styled(Paper)({
  padding: '20px'
});

const StyledButton = styled(Button)({
  marginRight: '10px',
  marginBottom: '10px'
});


const publicVapidKey = 'BHf1bzlOSSbU8lI5zmqAkOY4nBHG9kdQAB6oy1aYWk-kZ_xtpn2EjQcnhVx71ItDiWeXlW3bOLuDy9QWqjiEdJA';

if ('serviceWorker' in navigator) {
  send().catch(err => console.error(err));
}

// register the SW, register the push, send notification
async function send() {
  console.log('Registering service worker...');
  const register = await navigator.serviceWorker.register('/worker.js', {
    scope: '/'
  });
  console.log('Service worker Registered...');

  // Register push
  console.log('Registering push...');
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log('Push registered');

  // Send push notification
  console.log('Sending push....');
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'content-type': 'application/json'
    }
  });
  console.log('Push sent...');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
 
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
 

const App = () => {
  return (
    <Container>
      <StyledPaper>
        <h1>Push notifications</h1>
        <StyledButton variant="contained" color="primary">Subscribe</StyledButton>
        <StyledButton variant="contained" color="secondary">Unsubscribe</StyledButton>
      </StyledPaper>
    </Container>
  )
};

export default App;