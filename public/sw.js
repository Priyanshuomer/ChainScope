// Service Worker for ChainScope
const CACHE_NAME = 'chainscope-v1.0.0';
const STATIC_CACHE = 'chainscope-static-v1.0.0';
const DYNAMIC_CACHE = 'chainscope-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_FILES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests (except for chain data APIs)
  if (!url.origin.includes(location.origin) && 
      !url.href.includes('chainid.network') && 
      !url.href.includes('ethereum-lists')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache successful responses
            caches.open(DYNAMIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.destination === 'document') {
              return caches.match('/');
            }
          });
      })
  );
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync analytics data when connection is restored
  try {
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_ANALYTICS'
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
} 