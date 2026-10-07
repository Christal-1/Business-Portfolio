/* =========================================================
   CHDS DIGITAL TOOLS
   Booking & Enquiry
========================================================= */

const services = [
  ["Beauty / Personal Care", "R350+"],
  ["Photography", "R900+"],
  ["Cleaning", "R500+"],
  ["Tutoring", "R250+"],
  ["Consultation", "R400+"],
  ["Other service", "Quote"]
];

const $ = (id) => document.getElementById(id);

let selected = "";


/* =========================================================
   SERVICE SELECTION
========================================================= */

const servicesContainer = $("services");

if (servicesContainer) {

  servicesContainer.innerHTML = services
    .map(
      (service, index) => `
        <div
          class="service"
          data-i="${index}"
          role="button"
          tabindex="0"
          aria-pressed="false"
        >
          <b>${escapeHTML(service[0])}</b>
          <small>From ${escapeHTML(service[1])}</small>
        </div>
      `
    )
    .join("");

  const serviceCards =
    document.querySelectorAll(".service");

  function selectService(card) {

    serviceCards.forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });

    card.classList.add("selected");
    card.setAttribute("aria-pressed", "true");

    selected =
      services[Number(card.dataset.i)][0];

    updateProgress();
  }

  serviceCards.forEach((card) => {

    card.addEventListener(
      "click",
      () => {
        selectService(card);
      }
    );

    card.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key === "Enter" ||
          event.key === " "
        ) {

          event.preventDefault();

          selectService(card);

        }

      }
    );

  });

}


/* =========================================================
   DATE SETUP
========================================================= */

const dateInput = $("date");

if (dateInput) {

  const today =
    new Date().toISOString().split("T")[0];

  dateInput.min = today;

  dateInput.addEventListener(
    "change",
    updateProgress
  );

}


/* =========================================================
   TIME SETUP
========================================================= */

const timeInput = $("time");

if (timeInput) {

  timeInput.addEventListener(
    "change",
    updateProgress
  );

}


/* =========================================================
   CUSTOMER DETAILS
========================================================= */

[
  "customer",
  "phone",
  "notes"
].forEach((id) => {

  const field = $(id);

  if (field) {

    field.addEventListener(
      "input",
      updateProgress
    );

  }

});


/* =========================================================
   PROGRESS
========================================================= */

function updateProgress() {

  const steps =
    document.querySelectorAll(
      ".progress-step"
    );

  if (!steps.length) {
    return;
  }

  const hasService =
    Boolean(selected);

  const hasDate =
    Boolean($("date")?.value);

  const hasTime =
    Boolean($("time")?.value);


  steps.forEach((step, index) => {

    step.classList.remove("active");


    if (
      index === 0 &&
      !hasService
    ) {

      step.classList.add("active");

    }


    if (
      index === 1 &&
      hasService &&
      (!hasDate || !hasTime)
    ) {

      step.classList.add("active");

    }


    if (
      index === 2 &&
      hasService &&
      hasDate &&
      hasTime
    ) {

      step.classList.add("active");

    }

  });

}


/* =========================================================
   FORM DATA
========================================================= */

function data() {

  return {

    service:
      selected,

    date:
      $("date")?.value || "",

    time:
      $("time")?.value || "",

    name:
      $("customer")?.value.trim() || "",

    phone:
      $("phone")?.value.trim() || "",

    notes:
      $("notes")?.value.trim() || ""

  };

}


/* =========================================================
   LOCAL STORAGE
========================================================= */

const STORAGE_KEY =
  "booking-drafts";

let saved = [];

try {

  saved =
    JSON.parse(
      localStorage.getItem(
        STORAGE_KEY
      ) || "[]"
    );

  if (!Array.isArray(saved)) {
    saved = [];
  }

} catch {

  saved = [];

}


/* =========================================================
   HISTORY
========================================================= */

function loadHistory() {

  const history =
    $("history");

  if (!history) {
    return;
  }


  if (!saved.length) {

    history.innerHTML = `
      <div class="empty">

        <div class="empty-icon">
          ✦
        </div>

        <strong>
          No saved drafts yet
        </strong>

        <p>
          Your saved booking enquiries will appear here.
        </p>

      </div>
    `;

    return;

  }


  history.innerHTML =
    saved
      .slice(0, 5)
      .map(
        (item) => `
          <div class="history-item">

            <b>
              ${escapeHTML(
                item.service ||
                "Service enquiry"
              )}
            </b>

            <small>
              ${escapeHTML(
                item.date ||
                "No date"
              )}

              ${
                item.time
                  ? ` at ${escapeHTML(item.time)}`
                  : ""
              }

              ·

              ${escapeHTML(
                item.name ||
                "Customer"
              )}

            </small>

          </div>
        `
      )
      .join("");

}


/* =========================================================
   SAVE DRAFT
========================================================= */

const saveDraftButton =
  $("saveDraft");

if (saveDraftButton) {

  saveDraftButton.addEventListener(
    "click",
    () => {

      const draft =
        data();


      if (!draft.service) {

        alert(
          "Please choose a service before saving your draft."
        );

        return;

      }


      saved.unshift({

        ...draft,

        savedAt:
          new Date().toISOString()

      });


      saved =
        saved.slice(0, 10);


      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(saved)
      );


      loadHistory();


      alert(
        "Your booking draft has been saved on this device."
      );

    }
  );

}


/* =========================================================
   WHATSAPP SUBMISSION
========================================================= */

const bookingForm =
  $("bookingForm");

if (bookingForm) {

  bookingForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const details =
        data();


      if (!details.service) {

        alert(
          "Please choose a service first."
        );

        return;

      }


      if (
        !details.date ||
        !details.time ||
        !details.name ||
        !details.phone
      ) {

        alert(
          "Please complete your date, time and contact details."
        );

        return;

      }


      /*
       * CHDS BUSINESS WHATSAPP NUMBER
       *
       * South African international format.
       * Do not include + or spaces.
       */

      const number =
        "27712677342";


      const message = [

        `Hi, I'd like to enquire about ${details.service}.`,

        "",

        `Name: ${details.name}`,

        `Phone: ${details.phone}`,

        `Preferred date: ${details.date}`,

        `Preferred time: ${details.time}`,

        `Notes: ${details.notes || "None"}`

      ].join("\n");


      const whatsappURL =
        `https://wa.me/${number}?text=${encodeURIComponent(message)}`;


      window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

    }
  );

}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   PWA INSTALL
========================================================= */

let deferredPrompt = null;


window.addEventListener(
  "beforeinstallprompt",
  (event) => {

    event.preventDefault();

    deferredPrompt =
      event;


    const installButton =
      $("install");


    if (installButton) {

      installButton.hidden =
        false;

    }

  }
);


const installButton =
  $("install");


if (installButton) {

  installButton.addEventListener(
    "click",
    async () => {

      if (!deferredPrompt) {
        return;
      }


      deferredPrompt.prompt();


      await deferredPrompt.userChoice;


      deferredPrompt =
        null;


      installButton.hidden =
        true;

    }
  );

}


/* =========================================================
   SERVICE WORKER
========================================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener(
    "load",
    async () => {

      try {

        /*
         * Register relative to the Booking & Enquiry
         * application folder.
         */

        const registration =
          await navigator.serviceWorker.register(
            "./sw.js",
            {
              updateViaCache: "none"
            }
          );


        /*
         * Immediately check for a newer
         * service worker.
         */

        await registration.update();


        /*
         * Activate a waiting service worker
         * immediately.
         */

        if (registration.waiting) {

          registration.waiting.postMessage({
            type: "SKIP_WAITING"
          });

        }


        registration.addEventListener(
          "updatefound",
          () => {

            const newWorker =
              registration.installing;


            if (!newWorker) {
              return;
            }


            newWorker.addEventListener(
              "statechange",
              () => {

                if (
                  newWorker.state ===
                    "installed" &&
                  navigator.serviceWorker.controller
                ) {

                  newWorker.postMessage({
                    type: "SKIP_WAITING"
                  });

                }

              }
            );

          }
        );

      } catch (error) {

        console.warn(
          "Service worker registration failed:",
          error
        );

      }

    }
  );


  /*
   * Refresh the page when the new service
   * worker takes control.
   */

  navigator.serviceWorker.addEventListener(
    "controllerchange",
    () => {

      window.location.reload();

    }
  );

}


/* =========================================================
   INITIALISE
========================================================= */

loadHistory();
updateProgress();