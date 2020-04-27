import React from 'react';
import usePushNotifications from './usePushNotifications';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { styled } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

const StyledButton = styled(Button)({
  marginTop: '0px',
  marginRight: '10px',
  marginBottom: '10px'
});

const StyledAlert = styled(Alert)({
  marginBottom: '20px'
});

const StyledTextField = styled(TextField)({
  marginBottom: '10px'
});

const PushNotificationsDemo = () => {
  const {
    notificationsPermission,
    registration,
    setSubscriptionIntent,
    isSubscribed,
  
    notificationText,
    setNotificationText,
  
    setSendingIntent, 

  } = usePushNotifications();
  
  const sendButtonDisabled = !notificationText;
  const isPermissionDenied = notificationsPermission && notificationsPermission !== 'granted';
  const isPermissionGranted = notificationsPermission === 'granted';

  return registration ? (
    <React.Fragment>
      {isPermissionDenied ? <React.Fragment>
        <StyledAlert variant="filled" severity="error">
          Notifications permission is denied. Please allow notifications in your browser.
        </StyledAlert>
      </React.Fragment> : null}

      <h2>This client's subscription</h2>

      <StyledButton 
        variant="contained" 
        color="primary" 
        disabled={!isPermissionGranted || isSubscribed} 
        onClick={() => setSubscriptionIntent(true)}>Subscribe</StyledButton>

      <StyledButton 
        variant="contained" 
        color="secondary" 
        disabled={!isPermissionGranted || !isSubscribed} 
        onClick={() => setSubscriptionIntent(false)}>Unsubscribe</StyledButton>
    
      <h2>Send to all</h2>
  
      <div>
        <StyledTextField 
          id="standard-basic" 
          label="Message to send" 
          value={notificationText} 
          onChange={(event) => setNotificationText(event.target.value)}/>

        <StyledButton 
          variant="contained" 
          color="primary" 
          disabled={sendButtonDisabled} 
          onClick={(event) => setSendingIntent(true)}>Send to all</StyledButton>
      </div>
    </React.Fragment>
    ) : (
      <div>Service worker is not registered yet or not available.</div>
  )
};

export default PushNotificationsDemo;