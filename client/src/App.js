import React, { Component } from 'react';
import './App.css';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { styled } from '@material-ui/core/styles';
import usePushNotifications from './usePushNotifications';

const StyledPaper = styled(Paper)({
  padding: '20px'
});

const StyledButton = styled(Button)({
  marginTop: '0px',
  marginRight: '10px',
  marginBottom: '10px'
});

const App = () => {
  const {
    registration,
    vapidPubKey,
    subscription,
    notificationText,
    setSubscriptionIntent,
    setNotificationText,
    setNotificationToSend
  } = usePushNotifications();

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