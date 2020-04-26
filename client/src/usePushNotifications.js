import { useState, useEffect } from 'react';
import * as pushNotifications from './pushNotifications';

function usePushNotifications() {
  const [notificationsPermission, setNotificationsPermission] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [notificationText, setNotificationText] = useState('');
  const [subscriptionIntent, setSubscriptionIntent] = useState(false);  
  const [subscription, setSubscription] = useState(null);
  const [sendingIntent, setSendingIntent] = useState(null);

  useEffect(() => {
    async function registerSW() {
      const registration = await pushNotifications.registerSW();
      setRegistration(registration);
    }
    
    async function askPermission() {
      const permission = await pushNotifications.askPermission();
      setNotificationsPermission(permission);
    };

    registerSW();
    askPermission();
  }, []);

  useEffect(() => {
    async function switchSubscription() {
      if (subscriptionIntent) {
        if (notificationsPermission === 'granted') {
          const subscription = await pushNotifications.subscribeToPush();
          setSubscription(subscription);
        }
      } else {
        const unsubscriptionSuccess = await pushNotifications.unsubscribeFromPush();
        if (unsubscriptionSuccess) {
          setSubscription(null);
        }      
      }
    }

    switchSubscription();
  }, [subscriptionIntent, notificationsPermission]);

  useEffect(() => {
    async function processSendingIntent() {
      if (sendingIntent && notificationText && notificationText.length) {
        await pushNotifications.sendNotification(subscription, notificationText);
        setSendingIntent(null);
        setNotificationText('');
      }
    }

    processSendingIntent();
  }, [sendingIntent, notificationText, subscription]);

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