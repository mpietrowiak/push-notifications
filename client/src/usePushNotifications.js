import { useState, useEffect } from 'react';
import * as pushNotifications from './pushNotifications';
import { useSnackbar } from 'notistack';

function usePushNotifications() {
  const { enqueueSnackbar } = useSnackbar();
  const [notificationsPermission, setNotificationsPermission] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [notificationText, setNotificationText] = useState('');
  const [subscriptionIntent, setSubscriptionIntent] = useState(null);  
  const [subscription, setSubscription] = useState(null);
  const [sendingIntent, setSendingIntent] = useState(null);

  useEffect(() => {
    async function initialize() {
      const registration = await pushNotifications.registerSW();
      setRegistration(registration);
      if (!registration) {
        return;
      }
      const permission = await pushNotifications.askPermission();
      setNotificationsPermission(permission);

      // get and set existing subscription
      const subscription = await pushNotifications.getSubscription(registration);
      if (!subscription) {
        return;
      }
      setSubscription(subscription);
    }

    initialize();
  }, []);

  useEffect(() => {
    async function switchSubscription() {
      if (subscriptionIntent === true) {
        if (notificationsPermission === 'granted') {
          const subscription = await pushNotifications.subscribeToPush();
          if (subscription) {
            enqueueSnackbar('Subscribed successfully. You can now send push notifications.');
            setSubscription(subscription);
          }
        }
      } else if (subscriptionIntent === false) {
        const unsubscriptionSuccess = await pushNotifications.unsubscribeFromPush();
        if (unsubscriptionSuccess) {
          enqueueSnackbar('Unsubscribed successfully. You can resubscribe again.');
          setSubscription(null);
        }      
      }
    }

    switchSubscription();
  }, [subscriptionIntent, notificationsPermission, enqueueSnackbar]);

  useEffect(() => {
    async function processSendingIntent() {
      if (sendingIntent && notificationText && notificationText.length) {
        enqueueSnackbar('Sending push request to the backend...');
        await pushNotifications.sendNotification(notificationText);
        setSendingIntent(null);
        setNotificationText('');
      }
    }

    processSendingIntent();
  }, [sendingIntent, notificationText, subscription, enqueueSnackbar]);

  const isSubscribed = Boolean(subscription && subscription.endpoint);

  return {
    notificationsPermission,

    registration,
    setSubscriptionIntent,
    isSubscribed,

    notificationText,
    setNotificationText,

    setSendingIntent,
  }
}

export default usePushNotifications;