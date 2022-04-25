console.log('Service Worker');
// Functional: PUSH
self.addEventListener('push', event => {
    log('Push ' + event.data.text());
  
    const title = 'My PWA!';
    const options = {
      body: event.data.text()
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });