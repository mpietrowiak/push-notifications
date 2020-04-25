console.log('hello from service worker');

self.addEventListener('push', e => {
  const data = e.data.json();
  console.log(data);
  console.log('Push received...');
  self.registration.showNotification(data.title, { body: "Don't worry. This is a test notification." });
});