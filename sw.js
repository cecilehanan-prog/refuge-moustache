/* Fonctionne sans internet après la première ouverture.
   Le nom du cache dépend de l'adresse de l'appli : plusieurs applis d'élèves
   sur le même compte GitHub ne s'effacent pas les unes les autres.
   Après une grosse mise à jour, on peut augmenter VERSION. */
const VERSION = 'v10';
const PREFIX = 'appli-eleve:' + self.registration.scope + ':';
const CACHE = PREFIX + VERSION;
const SHELL = ['./', './index.html', './css/style.css', './js/profil.js', './js/univers.js', './js/data.js', './js/core.js', './js/animaux.js', './js/contenu.js', './js/moteurs.js',
  './js/game-mots.js', './js/game-tables.js', './js/game-problemes.js', './js/game-route.js', './js/devoirs-data.js', './js/devoirs-archives.js', './js/devoirs.js', './js/main.js',
  './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
/* Réseau d'abord (pour recevoir les mises à jour), sinon le cache */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(r => {
    const copy = r.clone();
    caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./index.html'))));
});
