self.addEventListener('push', (event) => {
  const data = event.data.json()
  self.registration.showNotification(data.notification.title, {body: data.notification.body, icon: '/icons/icon-192x192.png'})
})