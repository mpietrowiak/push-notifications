self.addEventListener('push', e => {
  const data = e.data.json();
  self.registration.showNotification('Test notification :)', { body: data.body });
});