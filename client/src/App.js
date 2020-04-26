import React, { Component, useState, useEffect } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';
import * as pushNotifications from './pushNotifications';

const StyledPaper = styled(Paper)({
  padding: '20px'
});

const StyledButton = styled(Button)({
  marginTop: '0px',
  marginRight: '10px',
  marginBottom: '10px'
});

const App = () => {
  const [vapidPubKey, setVapidPubKey] = useState(null);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
     async function getVapidPubKey() {
       const response = await fetch('/pubkey');
       const json = await response.json();
       setVapidPubKey(json.key);
     }

    async function registerSW() {
      const registration = await pushNotifications.registerSW();
      setRegistration(registration);
    }

    registerSW();
    getVapidPubKey();
  }, []);

  const [subscriptionIntent, setSubscriptionIntent] = useState(false);  
  const [subscription, setSubscription] = useState(null);
  const [notificationToSend, setNotificationToSend] = useState(null);


  useEffect(() => {
    async function switchSubscription() {
      console.log('switching subscription....');
      if (subscriptionIntent) {
        const subscription = await pushNotifications.subscribePush(vapidPubKey);
        setSubscription(subscription);
      } else {
        const unsubscriptionSuccess = await pushNotifications.unsubscribePush();
        console.log(unsubscriptionSuccess);
        if (unsubscriptionSuccess) {
          setSubscription(null);
        }      
      }
    }

    switchSubscription();
  }, [subscriptionIntent]);

  useEffect(() => {
    async function processNotification() {
      if (notificationToSend && notificationToSend.length) {

        await fetch('/send', {
          method: 'POST',
          body: JSON.stringify({ subscription, title: notificationToSend}),
          headers: {
            'content-type': 'application/json'
          }
        });
       setNotificationToSend(null);
       setNotificationText('');
      }
    }

    processNotification();
  }, [notificationToSend]);

  const [notificationText, setNotificationText] = useState('');

  const canSubscribe = Boolean(registration && vapidPubKey);
  const isSubscription = Boolean(subscription && subscription.endpoint);
  const sendButtonDisabled = !isSubscription || !notificationText;

  return (
    <Container>
      <StyledPaper>
        <h1>Push notifications</h1>

        {canSubscribe ? (
          <React.Fragment>
            <StyledButton variant="contained" color="primary" disabled={isSubscription} onClick={() => setSubscriptionIntent(true)}>Subscribe</StyledButton>
            <StyledButton variant="contained" color="secondary" disabled={!isSubscription} onClick={() => setSubscriptionIntent(false)}>Unsubscribe</StyledButton>
          
            <h2>Send</h2>

            <div>
              <TextField id="standard-basic" label="Text to display" disabled={!isSubscription} value={notificationText} onChange={(event) => setNotificationText(event.target.value)}/>
              <StyledButton variant="contained" color="primary" disabled={sendButtonDisabled} onClick={(event) => setNotificationToSend(notificationText)}>Send</StyledButton>
            </div>
          </React.Fragment>
          ) : (
            <div>Service worker is not registered yet. Please wait.</div>
        )}
      </StyledPaper>
    </Container>
  )
};

export default App;