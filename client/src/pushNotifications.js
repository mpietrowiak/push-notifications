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
  const registration = await navigator.serviceWorker.register('worker.js');
  return registration;
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
  return subscription;
}

export async function unsubscribeFromPush() {
  const registration = await navigator.serviceWorker.getRegistration();
  const subscription = await registration.pushManager.getSubscription();
  if (subscription && subscription.unsubscribe) {
    const successful = await subscription.unsubscribe();
    return successful;
  }
  return false;
}

export async function sendNotification(subscription, notificationText) {
  await fetch('/send', {
    method: 'POST',
    body: JSON.stringify({ subscription, body: notificationText}),
    headers: {
      'content-type': 'application/json'
    }
  });
}