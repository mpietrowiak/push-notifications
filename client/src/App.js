import React from 'react';
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
    canSubscribe,
    setSubscriptionIntent,
    isSubscribed,

    notificationText,
    setNotificationText,

    setSendingIntent,
  } = usePushNotifications();

  const sendButtonDisabled = !isSubscribed || !notificationText;

  return (
    <Container>
      <StyledPaper>
        <h1>Push notifications</h1>

        {canSubscribe ? (
          <React.Fragment>
            <StyledButton variant="contained" color="primary" disabled={isSubscribed} onClick={() => setSubscriptionIntent(true)}>Subscribe</StyledButton>
            <StyledButton variant="contained" color="secondary" disabled={!isSubscribed} onClick={() => setSubscriptionIntent(false)}>Unsubscribe</StyledButton>
          
            <h2>Send</h2>

            <div>
              <TextField id="standard-basic" label="Text to display" disabled={!isSubscribed} value={notificationText} onChange={(event) => setNotificationText(event.target.value)}/>
              <StyledButton variant="contained" color="primary" disabled={sendButtonDisabled} onClick={(event) => setSendingIntent(true)}>Send</StyledButton>
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