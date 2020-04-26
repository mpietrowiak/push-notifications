self.addEventListener('push', e => {
  const data = e.data.json();
  console.log(data);
  self.registration.showNotification('Test notification :)', { body: data.body });
});