import { useState, useEffect } from 'react';
import * as pushNotifications from './pushNotifications';

function usePushNotifications() {
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

  return {
    registration,
    vapidPubKey,
    subscription,
    notificationText,
    setSubscriptionIntent,
    setNotificationText,
    setNotificationToSend
  }
}

export default usePushNotifications;