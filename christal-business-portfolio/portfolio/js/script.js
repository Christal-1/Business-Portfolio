/* =========================================================
   HAIVEXA
   Technology & Digital Solutions
   Main JavaScript
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =======================================================
     MOBILE NAVIGATION
  ======================================================= */

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");


  // Toggle mobile menu
  toggle?.addEventListener("click", (event) => {

    event.stopPropagation();

    const open = nav?.classList.toggle("open");

    toggle.setAttribute(
      "aria-expanded",
      String(Boolean(open))
    );

    toggle.setAttribute(
      "aria-label",
      open
        ? "Close navigation menu"
        : "Open navigation menu"
    );

  });


  // Close mobile menu when a navigation link is clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {

    link.addEventListener("click", () => {

      nav?.classList.remove("open");

      toggle?.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle?.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    });

  });


  // Close mobile menu when clicking outside
  document.addEventListener("click", (event) => {

    if (!nav || !toggle) return;

    if (
      nav.classList.contains("open") &&
      !nav.contains(event.target) &&
      !toggle.contains(event.target)
    ) {

      nav.classList.remove("open");

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    }

  });


  // Close mobile menu when pressing Escape
  document.addEventListener("keydown", (event) => {

    if (
      event.key === "Escape" &&
      nav?.classList.contains("open")
    ) {

      nav.classList.remove("open");

      toggle?.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle?.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

      toggle?.focus();

    }

  });


  /* =======================================================
     RESET MOBILE MENU WHEN RESIZING
  ======================================================= */

  window.addEventListener("resize", () => {

    if (window.innerWidth > 900) {

      nav?.classList.remove("open");

      toggle?.setAttribute(
        "aria-expanded",
        "false"
      );

      toggle?.setAttribute(
        "aria-label",
        "Open navigation menu"
      );

    }

  });


  /* =======================================================
     FAQ
  ======================================================= */

  const faqItems =
    document.querySelectorAll(".faq-list details");


  faqItems.forEach((item) => {

    item.addEventListener("toggle", () => {

      if (!item.open) return;


      // Keep only one FAQ item open at a time
      faqItems.forEach((otherItem) => {

        if (otherItem !== item) {
          otherItem.removeAttribute("open");
        }

      });

    });

  });


  /* =======================================================
     HAIVEXA PROJECT NAVIGATION

     Remembers exactly where the visitor was on the
     HAIVEXA website before opening a working demo.
  ======================================================= */

  const HAIVEXA_SCROLL_KEY =
    "haivexaScrollPosition";

  const HAIVEXA_RETURN_KEY =
    "haivexaReturn";


  /*
     Save the visitor's current position.
  */

  function savePortfolioPosition() {

    sessionStorage.setItem(
      HAIVEXA_SCROLL_KEY,
      String(window.scrollY)
    );

  }


  /*
     Mark that the visitor is leaving HAIVEXA
     for an internal project/demo page.
  */

  function prepareProjectNavigation() {

    savePortfolioPosition();

    sessionStorage.setItem(
      HAIVEXA_RETURN_KEY,
      "true"
    );

  }


  /*
     Identify internal project/demo links.

     External links such as GitHub, WhatsApp,
     LinkedIn and email are deliberately ignored.
  */

  const projectLinks = document.querySelectorAll(
    ".project-card a[href], .evidence a[href]"
  );


  projectLinks.forEach((link) => {

    const href =
      link.getAttribute("href");


    if (!href) return;


    const isInternalProject =
      href.includes("pwa-business-quickquote") ||
      href.includes("pwa-booking-enquiry");


    if (!isInternalProject) return;


    link.addEventListener("click", () => {

      prepareProjectNavigation();

    });

  });


  /* =======================================================
     RESTORE HAIVEXA PAGE POSITION
  ======================================================= */

  function restorePortfolioPosition() {

    const shouldRestore =
      sessionStorage.getItem(
        HAIVEXA_RETURN_KEY
      );


    const savedPosition =
      sessionStorage.getItem(
        HAIVEXA_SCROLL_KEY
      );


    /*
       Nothing to restore.
    */

    if (
      shouldRestore !== "true" ||
      savedPosition === null
    ) {

      return;

    }


    const position =
      Number.parseInt(
        savedPosition,
        10
      );


    if (Number.isNaN(position)) {

      sessionStorage.removeItem(
        HAIVEXA_RETURN_KEY
      );

      return;

    }


    /*
       Remove the return flag immediately.

       This prevents a normal page refresh from
       jumping back to the previous position.
    */

    sessionStorage.removeItem(
      HAIVEXA_RETURN_KEY
    );


    /*
       Wait for the page layout to be ready.
    */

    requestAnimationFrame(() => {

      requestAnimationFrame(() => {

        window.scrollTo({
          top: position,
          left: 0,
          behavior: "instant"
        });

      });

    });

  }


  /*
     Restore position after HAIVEXA loads.
  */

  restorePortfolioPosition();


  /* =======================================================
     BROWSER BACK / FORWARD SUPPORT
  ======================================================= */

  window.addEventListener("pageshow", (event) => {

    /*
       If the browser restores the page from its
       back-forward cache, reapply the saved position.
    */

    if (!event.persisted) return;


    const savedPosition =
      sessionStorage.getItem(
        HAIVEXA_SCROLL_KEY
      );


    if (savedPosition === null) return;


    const position =
      Number.parseInt(
        savedPosition,
        10
      );


    if (Number.isNaN(position)) return;


    requestAnimationFrame(() => {

      window.scrollTo({
        top: position,
        left: 0,
        behavior: "instant"
      });

    });

  });


  /* =======================================================
     BACK TO PORTFOLIO
     
     Used on individual project/demo pages.
  ======================================================= */

  const backToPortfolio =
    document.querySelector(".back-to-portfolio");


  backToPortfolio?.addEventListener(
    "click",
    (event) => {

      /*
         If there is a previous page in browser history,
         use it so the visitor returns to the same position.
      */

      if (window.history.length > 1) {

        event.preventDefault();

        window.history.back();

      }

    }
  );


  /* =======================================================
     SMOOTH ANCHOR NAVIGATION
  ======================================================= */

  document.querySelectorAll(
    'a[href^="#"]'
  ).forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");


      if (
        !targetId ||
        targetId === "#"
      ) {

        return;

      }


      const target =
        document.querySelector(targetId);


      if (!target) return;


      event.preventDefault();


      /*
         Account for the sticky header.
      */

      const header =
        document.querySelector(".site-header");


      const headerHeight =
        header
          ? header.offsetHeight
          : 0;


      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        18;


      /*
         Update the URL without jumping.
      */

      window.history.pushState(
        null,
        "",
        targetId
      );


      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth"
      });

    });

  });


  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const backToTop =
    document.querySelector(".back-to-top");


  backToTop?.addEventListener(
    "click",
    (event) => {

      event.preventDefault();


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );


  /* =======================================================
     SERVICE / PROJECT CARD MICRO-INTERACTION
  ======================================================= */

  const interactiveCards =
    document.querySelectorAll(
      ".service-card, .project-card, .price-card, .process-step, .evidence"
    );


  interactiveCards.forEach((card) => {

    card.addEventListener(
      "mouseenter",
      () => {

        card.classList.add("is-hovered");

      }
    );


    card.addEventListener(
      "mouseleave",
      () => {

        card.classList.remove("is-hovered");

      }
    );

  });


  /* =======================================================
     CURRENT YEAR
     
     Any element with:
     
     class="current-year"
     
     will automatically display the current year.
  ======================================================= */

  const yearElements =
    document.querySelectorAll(
      ".current-year"
    );


  yearElements.forEach((element) => {

    element.textContent =
      new Date().getFullYear();

  });


  /* =======================================================
     SCROLL REVEAL

     Includes the new HAIVEXA founder photo card.
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      [
        ".service-card",
        ".project-card",
        ".process-step",
        ".price-card",
        ".evidence",
        ".founder-photo-card",
        ".about-highlights > div"
      ].join(", ")
    );


  if (
    "IntersectionObserver" in window
  ) {

    const revealObserver =
      new IntersectionObserver(
        (entries, observer) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }


            entry.target.classList.add(
              "revealed"
            );


            observer.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach((element) => {

      element.classList.add(
        "reveal"
      );


      revealObserver.observe(
        element
      );

    });

  } else {

    revealElements.forEach((element) => {

      element.classList.add(
        "revealed"
      );

    });

  }


  /* =======================================================
     ACCESSIBILITY
  ======================================================= */

  // Keep the mobile menu state correct when JavaScript is active.

  if (toggle && nav) {

    const isOpen =
      nav.classList.contains("open");


    toggle.setAttribute(
      "aria-expanded",
      isOpen
        ? "true"
        : "false"
    );


    toggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );

  }

});