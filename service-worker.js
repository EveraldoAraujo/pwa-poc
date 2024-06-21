const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Função para atualizar o cache
async function updateCache() {
    console.log("updateCache")

    for (let index = 0; index < urlsToCache.length; index++) {
        const element = urlsToCache[index];
        

        const cache = await caches.open(CACHE_NAME);
    const response = await fetch(element);
    var x = cache.match(response);
    console.log(response);
    console.log(x);
    debugger;
    if (response.ok) {
    await cache.put(element, response.clone());
  }

    }

  
  
}




// Função para buscar do cache e atualizar em segundo plano
async function fetchAndUpdate(request) {
    console.log("fetch e update")

    console.log(request);
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkResponsePromise = fetch(request);

  networkResponsePromise.then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
  });

  return cachedResponse || networkResponsePromise;
}

self.addEventListener('install', (event) => {
    console.log("install")

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log("activate")

  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    console.log("fetch")

  event.respondWith(fetchAndUpdate(event.request));
});

self.addEventListener('message', (event) => {
    console.log("message")
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});


setTimeout( async ()=>{
   await updateCache();
}, 30000)