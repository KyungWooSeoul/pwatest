//This is the service worker with the Advanced caching

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const HTML_CACHE = "html";
const JS_CACHE = "javascript";
const STYLE_CACHE = "stylesheets";
const IMAGE_CACHE = "images";
const FONT_CACHE = "fonts";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});




self.addEventListener('push', (event) => {
  // event는 서버에서 payload로 보내준 데이터이다.
  let { title, body, icon, tag } = JSON.parse(event.data && event.data.text());

  // 이외에도 여러 옵션이 있다.
  // 참고: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  event.waitUntil(self.registration.showNotification(title || '', { body, tag, icon }));
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  const urlToOpen = 'http://localhost:1234';

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
        // 현재 서비스워커 클라이언트와 동일한 origin의 클라이언트를 포함시킬지 여부.
        // 요걸 활성화해두지 않으면, 현재 열린 탭이 있더라도 서비스워커를 활성화시킨 탭이 아니면 client에 포함되지 않음
      })
      .then(function (clientList) {
        if (clientList.length > 0) {
          // 이미 열려있는 탭이 있는 경우
          return clientList[0].focus().then((client) => client.navigate(urlToOpen));
        }
        return self.clients.openWindow(urlToOpen);
      }),
  );
});







workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: HTML_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'script',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: JS_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: STYLE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'image',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: IMAGE_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);

workbox.routing.registerRoute(
  ({event}) => event.request.destination === 'font',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: FONT_CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
      }),
    ],
  })
);



