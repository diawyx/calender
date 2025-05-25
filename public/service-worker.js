self.addEventListener('push', function(event) {
  const data = event.data.json();
  const title = data.title;
  const options = {
    body: data.body,
    icon: 'icon.png', // optional, bisa taruh di /public/
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
