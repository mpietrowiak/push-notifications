function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function registerSW() {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.register('worker.js');
    return registration;
  }
  return null;
}

export async function askPermission() {
  const permission = await window.Notification.requestPermission();
  console.log(permission);
  return permission;
}

async function getVapidKey() {
  const response = await fetch('/pubkey');
  const json = await response.json();
  return json.key;
}

export async function subscribeToPush() {
  const pubVapidKey = await getVapidKey();
  await navigator.serviceWorker.ready;
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(pubVapidKey),
  });
  console.log(subscription);
  await fetch('/subscribe', {
    method: 'POST',
    body: JSON.stringify({ subscription }),
    headers: {
      'content-type': 'application/json'
    }
  });
  return subscription;
}

export async function getSubscription(registration) {
  const subscription = await registration.pushManager.getSubscription();
  return subscription;
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await getSubscription(registration);
  if (subscription && subscription.unsubscribe) {
    const successful = await subscription.unsubscribe();
    if (successful) {
      await fetch('/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ subscription }),
        headers: {
          'content-type': 'application/json'
        }
      });
    }
    return successful;
  }
  return false;
}

export async function sendNotification(notificationText) {
  await fetch('/send', {
    method: 'POST',
    body: JSON.stringify({ body: notificationText}),
    headers: {
      'content-type': 'application/json'
    }
  });
}