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
  
  const sendButtonDisabled = !isSubscribed || !notificationText;
  const isPermissionDenied = notificationsPermission && notificationsPermission !== 'granted';
  const isPermissionGranted = notificationsPermission === 'granted';

  return registration ? (
    <React.Fragment>
      {isPermissionDenied ? <React.Fragment>
        <StyledAlert variant="filled" severity="error">
          Notifications permission is denied. Please allow notifications in your browser.
        </StyledAlert>
      </React.Fragment> : null}

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
    
      <h2>Send</h2>
  
      <div>
        <TextField 
          id="standard-basic" 
          label="Text to display" 
          disabled={!isSubscribed} 
          value={notificationText} 
          onChange={(event) => setNotificationText(event.target.value)}/>

        <StyledButton 
          variant="contained" 
          color="primary" 
          disabled={sendButtonDisabled} 
          onClick={(event) => setSendingIntent(true)}>Send</StyledButton>
      </div>
    </React.Fragment>
    ) : (
      <div>Service worker is not registered yet. Please wait.</div>
  )
};

export default PushNotificationsDemo;