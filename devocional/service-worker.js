// service-worker.js
//
// Cacheia o "app shell" (HTML, CSS, JS, ícones) para o site abrir rápido
// e funcionar offline. As chamadas de API (/api/...) e a abibliadigital
// nunca são interceptadas aqui — sempre buscam dados frescos da rede.

const CACHE_NAME = "devocional-cache-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {  const url = new URL(event.request.url);

  // Nunca cachear chamadas de API — precisam sempre de dados frescos
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Só cuidamos de GET dentro do próprio domínio (o "app shell")
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  // Estratégia stale-while-revalidate: responde do cache na hora (se tiver)
  // e atualiza o cache em segundo plano com a versão mais nova da rede.
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const networkFetch = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});

// Ao tocar na notificação, foca uma aba já aberta do app ou abre uma nova.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
