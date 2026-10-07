/* =========================================================
   CHRISTAL HAINES DIGITAL SOLUTIONS
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


      // Close other FAQ items when one is opened
      faqItems.forEach((otherItem) => {

        if (otherItem !== item) {
          otherItem.removeAttribute("open");
        }

      });

    });

  });


  /* =======================================================
     PORTFOLIO / PROJECT NAVIGATION
     
     Remembers exactly where the visitor was on the
     portfolio before opening a project or demo.
  ======================================================= */

  const PORTFOLIO_SCROLL_KEY =
    "christalPortfolioScrollPosition";

  const PORTFOLIO_RETURN_KEY =
    "christalPortfolioReturn";


  /*
     Save the visitor's current position on the portfolio.
  */

  function savePortfolioPosition() {

    sessionStorage.setItem(
      PORTFOLIO_SCROLL_KEY,
      String(window.scrollY)
    );

  }


  /*
     Mark that the visitor is leaving the portfolio
     for an internal project/demo page.
  */

  function prepareProjectNavigation() {

    savePortfolioPosition();

    sessionStorage.setItem(
      PORTFOLIO_RETURN_KEY,
      "true"
    );

  }


  /*
     Identify internal project/demo links.
     
     These are the projects that live inside the portfolio
     folder structure.

     External links such as GitHub, WhatsApp, LinkedIn,
     email, etc. are deliberately ignored.
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
     RESTORE PORTFOLIO POSITION
  ======================================================= */

  function restorePortfolioPosition() {

    const shouldRestore =
      sessionStorage.getItem(
        PORTFOLIO_RETURN_KEY
      );


    const savedPosition =
      sessionStorage.getItem(
        PORTFOLIO_SCROLL_KEY
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
        PORTFOLIO_RETURN_KEY
      );

      return;

    }


    /*
       Remove the return flag immediately.

       This means a normal page refresh will NOT keep
       jumping the visitor back to the old position.
    */

    sessionStorage.removeItem(
      PORTFOLIO_RETURN_KEY
    );


    /*
       Wait for the page layout to be ready before restoring
       the scroll position.

       Two animation frames give the browser enough time to
       calculate the full page height.
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
     Restore position after the portfolio loads.
  */

  restorePortfolioPosition();


  /* =======================================================
     BROWSER BACK / FORWARD SUPPORT
  ======================================================= */

  window.addEventListener("pageshow", (event) => {

    /*
       If the browser restores the portfolio from its
       back-forward cache, make sure the saved position
       is still applied.
    */

    if (!event.persisted) return;


    const savedPosition =
      sessionStorage.getItem(
        PORTFOLIO_SCROLL_KEY
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
     
     This is used on individual project/demo pages.
     
     Example:
     
     <a
       href="../index.html"
       class="back-to-portfolio"
     >
       ← Back to Portfolio
     </a>
     
     If the visitor came from the portfolio, the browser's
     history is used instead of opening a fresh portfolio page.
  ======================================================= */

  const backToPortfolio =
    document.querySelector(".back-to-portfolio");


  backToPortfolio?.addEventListener(
    "click",
    (event) => {

      /*
         If there is a previous page in browser history,
         go back to it.

         This preserves the exact portfolio page position.
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
         Account for the sticky header so the section
         heading does not sit underneath it.
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
     YEAR
     
     If the footer contains an element with:
     class="current-year"
     
     it will automatically show the current year.
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
     
     Adds a subtle reveal effect to major sections/cards.
     CSS controls the actual animation.
  ======================================================= */

  const revealElements =
    document.querySelectorAll(
      ".service-card, .project-card, .process-step, .price-card, .evidence, .about-card"
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

  // Keep the mobile menu state correct if JavaScript is active

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