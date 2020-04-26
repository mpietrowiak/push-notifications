import { useState, useEffect } from 'react';
import * as pushNotifications from './pushNotifications';

function usePushNotifications() {
  const [vapidPubKey, setVapidPubKey] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [notificationText, setNotificationText] = useState('');
  const [subscriptionIntent, setSubscriptionIntent] = useState(false);  
  const [subscription, setSubscription] = useState(null);
  const [sendingIntent, setSendingIntent] = useState(null);

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

  useEffect(() => {
    async function switchSubscription() {
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
  }, [subscriptionIntent, vapidPubKey]);

  useEffect(() => {
    async function processSendingIntent() {
      if (sendingIntent && notificationText && notificationText.length) {

        await fetch('/send', {
          method: 'POST',
          body: JSON.stringify({ subscription, title: notificationText}),
          headers: {
            'content-type': 'application/json'
          }
        });
       setSendingIntent(null);
       setNotificationText('');
      }
    }

    processSendingIntent();
  }, [sendingIntent, notificationText, subscription]);

  const canSubscribe = Boolean(registration && vapidPubKey);
  const isSubscribed = Boolean(subscription && subscription.endpoint);

  return {
    canSubscribe,
    setSubscriptionIntent,
    isSubscribed,

    notificationText,
    setNotificationText,

    setSendingIntent
  }
}

export default usePushNotifications;