// Hazratnavoi.uz — Service Worker v1
// Handles push notifications for prayer time reminders

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()))

self.addEventListener('push', function (event) {
  let data = {}
  try { data = event.data ? event.data.json() : {} } catch (_) {}

  const title   = data.title   || '🕌 Намоз эслатмаси'
  const options = {
    body:             data.body    || 'Намоз вақти яқинлашмоқда',
    icon:             '/images/mosque-logo.png',
    badge:            '/icon-dark-32x32.png',
    tag:              data.tag     || 'prayer-reminder',
    renotify:         true,
    requireInteraction: true,
    vibrate:          [300, 150, 300, 150, 600],
    data:             { url: data.url || '/' },
    actions: [
      { action: 'open',    title: '🕌 Очиш'   },
      { action: 'dismiss', title: '✕ Ёпиш'  },
    ],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function (event) {
  event.notification.close()
  if (event.action === 'dismiss') return
  const url = event.notification.data?.url || '/'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client)
          return client.focus()
      }
      return self.clients.openWindow(url)
    })
  )
})
