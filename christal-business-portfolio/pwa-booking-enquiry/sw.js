/* =========================================================
   CHDS DIGITAL TOOLS
   Booking & Enquiry
   Service Worker
========================================================= */

const CACHE_NAME =
  "booking-v2";


const ASSETS = [

  "./",

  "./index.html",

  "./css/style.css",

  "./js/app.js",

  "./manifest.webmanifest",

  "./icons/icon.svg"

];


/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
  "install",
  (event) => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then((cache) =>
          cache.addAll(ASSETS)
        )

    );


    /*
     * Activate the new version immediately.
     */

    self.skipWaiting();

  }
);


/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
  "activate",
  (event) => {

    event.waitUntil(

      caches
        .keys()
        .then((cacheNames) =>

          Promise.all(

            cacheNames
              .filter(
                (cacheName) =>
                  cacheName !== CACHE_NAME
              )
              .map(
                (cacheName) =>
                  caches.delete(cacheName)
              )

          )

        )
        .then(() =>
          self.clients.claim()
        )

    );

  }
);


/* =========================================================
   MESSAGE
========================================================= */

self.addEventListener(
  "message",
  (event) => {

    if (
      event.data &&
      event.data.type ===
        "SKIP_WAITING"
    ) {

      self.skipWaiting();

    }

  }
);


/* =========================================================
   FETCH
========================================================= */

self.addEventListener(
  "fetch",
  (event) => {

    /*
     * Only intercept GET requests.
     */

    if (
      event.request.method !== "GET"
    ) {

      return;

    }


    event.respondWith(

      fetch(event.request)

        .then((response) => {

          /*
           * Cache successful same-origin
           * responses so the PWA can still
           * work offline.
           */

          if (
            response &&
            response.status === 200 &&
            event.request.url.startsWith(
              self.location.origin
            )
          ) {

            const responseClone =
              response.clone();


            caches
              .open(CACHE_NAME)
              .then((cache) => {

                cache.put(
                  event.request,
                  responseClone
                );

              });

          }


          return response;

        })

        .catch(() => {

          /*
           * Offline fallback.
           */

          return caches.match(
            event.request
          );

        })

    );

  }
);