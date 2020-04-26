import React from 'react';
import usePushNotifications from './usePushNotifications';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';

const StyledButton = styled(Button)({
  marginTop: '0px',
  marginRight: '10px',
  marginBottom: '10px'
});

const PushNotificationsDemo = () => {
  const {
    canSubscribe,
    setSubscriptionIntent,
    isSubscribed,
  
    notificationText,
    setNotificationText,
  
    setSendingIntent,
  } = usePushNotifications();
  
  const sendButtonDisabled = !isSubscribed || !notificationText;

  return canSubscribe ? (
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
  )
};

export default PushNotificationsDemo;