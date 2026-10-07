/* =========================================================
   CHDS DIGITAL TOOLS
   QuickQuote
========================================================= */

const items = [];

const $ = (id) =>
  document.getElementById(id);


/* =========================================================
   MONEY FORMAT
========================================================= */

function money(value) {

  return "R " +
    Number(value || 0).toLocaleString(
      "en-ZA",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


/* =========================================================
   TOTAL
========================================================= */

function calculateTotal() {

  return items.reduce(
    (sum, item) =>
      sum +
      Number(item.qty) *
      Number(item.price),
    0
  );

}


/* =========================================================
   RENDER CURRENT QUOTE
========================================================= */

function render() {

  const box = $("items");

  if (!box) {
    return;
  }

  box.innerHTML = "";


  /* ==============================================
     EMPTY STATE
  ============================================== */

  if (!items.length) {

    box.innerHTML = `
      <div class="empty">

        <div class="empty-icon">
          +
        </div>

        <strong>
          No items yet
        </strong>

        <p>
          Add your first service or product to start
          building the quote.
        </p>

      </div>
    `;

  }


  /* ==============================================
     ITEMS
  ============================================== */

  items.forEach((item, index) => {

    const row =
      document.createElement("div");

    row.className = "item";

    row.innerHTML = `
      <div>

        <b>
          ${escapeHTML(item.name)}
        </b>

        <small>
          ${item.qty} × ${money(item.price)}
        </small>

      </div>

      <div>

        <strong>
          ${money(item.qty * item.price)}
        </strong>

        <button
          class="remove"
          data-i="${index}"
          aria-label="Remove ${escapeHTML(item.name)}"
          type="button"
        >
          Remove
        </button>

      </div>
    `;

    box.appendChild(row);

  });


  /* ==============================================
     TOTALS
  ============================================== */

  const total =
    calculateTotal();

  const totalElement =
    $("total");

  if (totalElement) {
    totalElement.textContent =
      money(total);
  }


  const subtotalElement =
    $("subtotal");

  if (subtotalElement) {
    subtotalElement.textContent =
      money(total);
  }


  /* ==============================================
     REMOVE BUTTONS
  ============================================== */

  document
    .querySelectorAll(".remove")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          const index =
            Number(button.dataset.i);

          items.splice(index, 1);

          render();

        }
      );

    });

}


/* =========================================================
   ADD ITEM
========================================================= */

const itemForm =
  $("itemForm");

if (itemForm) {

  itemForm.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      const name =
        $("name").value.trim();

      const qty =
        Number($("qty").value);

      const price =
        Number($("price").value);


      if (!name) {

        alert(
          "Please enter a service or product."
        );

        return;

      }


      if (
        !Number.isFinite(qty) ||
        qty < 1
      ) {

        alert(
          "Please enter a valid quantity."
        );

        return;

      }


      if (
        !Number.isFinite(price) ||
        price < 0
      ) {

        alert(
          "Please enter a valid price."
        );

        return;

      }


      items.push({
        name,
        qty,
        price
      });


      itemForm.reset();

      $("qty").value = 1;

      render();

      $("name").focus();

    }
  );

}


/* =========================================================
   QUOTE NUMBER
========================================================= */

function generateQuoteNumber() {

  const saved =
    getSavedQuotes();

  const nextNumber =
    saved.length + 1;

  return String(nextNumber)
    .padStart(4, "0");

}


/* =========================================================
   SAVE QUOTE
========================================================= */

const saveButton =
  $("save");

if (saveButton) {

  saveButton.addEventListener(
    "click",
    () => {

      if (!items.length) {

        alert(
          "Add at least one item before saving the quote."
        );

        return;

      }


      const saved =
        getSavedQuotes();


      const quote = {

        quoteNumber:
          generateQuoteNumber(),

        date:
          new Date().toLocaleString(
            "en-ZA"
          ),

        items:
          [...items],

        total:
          calculateTotal()

      };


      saved.unshift(quote);


      localStorage.setItem(
        "qq-history",
        JSON.stringify(
          saved.slice(0, 10)
        )
      );


      items.splice(0);

      render();

      renderHistory();


      alert(
        `Quote #${quote.quoteNumber} has been saved on this device.`
      );

    }
  );

}


/* =========================================================
   GET SAVED QUOTES
========================================================= */

function getSavedQuotes() {

  try {

    const saved =
      JSON.parse(
        localStorage.getItem(
          "qq-history"
        ) || "[]"
      );

    return Array.isArray(saved)
      ? saved
      : [];

  } catch {

    return [];

  }

}


/* =========================================================
   HISTORY
========================================================= */

function renderHistory() {

  const history =
    $("history");

  if (!history) {
    return;
  }


  const saved =
    getSavedQuotes();


  if (!saved.length) {

    history.innerHTML = `
      <div class="empty">

        <div class="empty-icon">
          ✦
        </div>

        <strong>
          No saved quotes yet
        </strong>

        <p>
          Quotes you save will appear here for quick access.
        </p>

      </div>
    `;

    return;

  }


  history.innerHTML =
    saved
      .slice(0, 10)
      .map(
        (quote) => `
          <div class="history-item">

            <b>
              Quote #${escapeHTML(
                quote.quoteNumber || "0000"
              )}
              ·
              ${money(quote.total)}
            </b>

            <small>
              ${escapeHTML(
                quote.date || ""
              )}
              ·
              ${quote.items?.length || 0}
              item(s)
            </small>

          </div>
        `
      )
      .join("");

}


/* =========================================================
   CLEAR CURRENT QUOTE
========================================================= */

const clearButton =
  $("clearQuote");

if (clearButton) {

  clearButton.addEventListener(
    "click",
    () => {

      if (!items.length) {
        return;
      }


      const confirmed =
        confirm(
          "Clear all items from this quote?"
        );


      if (!confirmed) {
        return;
      }


      items.splice(0);

      render();

    }
  );

}


/* =========================================================
   SHARE QUOTE
========================================================= */

const shareButton =
  $("shareQuote");

if (shareButton) {

  shareButton.addEventListener(
    "click",
    async () => {

      if (!items.length) {

        alert(
          "Add at least one item before sharing the quote."
        );

        return;

      }


      const total =
        calculateTotal();


      const quoteText = [
        "QUICKQUOTE",
        "",
        ...items.map(
          (item) =>
            `${item.name} — ${item.qty} × ${money(item.price)} = ${money(item.qty * item.price)}`
        ),
        "",
        `Total: ${money(total)}`
      ].join("\n");


      /* ==============================================
         NATIVE SHARING
      ============================================== */

      if (
        navigator.share
      ) {

        try {

          await navigator.share({
            title: "QuickQuote",
            text: quoteText
          });

          return;

        } catch (error) {

          /*
           * User cancelled sharing.
           */

          if (
            error?.name ===
            "AbortError"
          ) {
            return;
          }

        }

      }


      /* ==============================================
         CLIPBOARD FALLBACK
      ============================================== */

      try {

        await navigator.clipboard.writeText(
          quoteText
        );

        alert(
          "Quote copied to your clipboard."
        );

      } catch {

        alert(
          quoteText
        );

      }

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
    .replaceAll("'", "&#039;");

}


/* =========================================================
   PWA INSTALL
========================================================= */

let deferredPrompt = null;

window.addEventListener(
  "beforeinstallprompt",
  (event) => {

    event.preventDefault();

    deferredPrompt = event;

    const installButton =
      $("install");

    if (installButton) {
      installButton.hidden = false;
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

      deferredPrompt = null;

      installButton.hidden = true;

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
         * Register the service worker relative to this
         * QuickQuote folder.
         */

        const registration =
          await navigator.serviceWorker.register(
            "./sw.js",
            {
              updateViaCache: "none"
            }
          );


        /*
         * Tell the browser to check immediately
         * for a newer service worker.
         */

        await registration.update();


        /*
         * If a new service worker is waiting,
         * activate it immediately.
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
   * Reload the page when a new service worker
   * takes control.
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

render();
renderHistory();