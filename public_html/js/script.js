/* ============================================================
   MAAC GHAZIABAD — Scripts
   ------------------------------------------------------------
   Plain vanilla JavaScript. No frameworks, no build step.
   Handles:
     1. Sticky navbar state on scroll
     2. Mobile menu toggle
     3. Scroll-reveal animations (IntersectionObserver)
     4. Animated number counters
     5. Hero rotating word
     6. Enquiry form -> opens WhatsApp with details
     7. Footer year
   ============================================================ */

/* ---- Your contact details (edit here if they ever change) ---- */
var WHATSAPP_NUMBER = "919773819545"; // country code + number, no symbols

document.addEventListener("DOMContentLoaded", function () {

  /* ============================================================
     0. HERO BACKGROUND ROTATION
     Cycles through the supplied banner images every 3 seconds.
     Preloads the images first so the transition stays smooth.
     ============================================================ */
 var heroBanner = document.getElementById("heroBanner");
if (heroBanner) {
  var heroImages = [
    "https://www.maacindia.com/images/home/young-learners-with-laptop.jpg", 
    "https://www.maacindia.com/assets/c3-DDaN8G1C.webp", 
    "https://www.maacindia.com/assets/c6-C0xjQx6H.webp"
  ];
  var loadedHeroImages = [];
  
  heroImages.forEach(function (src) {
    var image = new Image();
    image.src = src;
    loadedHeroImages.push(src);
  });

  var heroIndex = 0;
  
  function setHeroImage(src) {
    // Added a linear-gradient overlay before the image URL
    heroBanner.style.backgroundImage = "linear-gradient(rgba(165, 163, 163, 0.4), rgba(165, 163, 163, 0.4)), url('" + src + "')";
  }

  setHeroImage(loadedHeroImages[heroIndex]);
  
  setInterval(function () {
    heroIndex = (heroIndex + 1) % loadedHeroImages.length;
    setHeroImage(loadedHeroImages[heroIndex]);
  }, 3000);
} /* ============================================================
     1. STICKY NAVBAR
     ============================================================ */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 30) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();


  /* ============================================================
     2. MOBILE MENU TOGGLE
     ============================================================ */
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }
  // Close the menu when any nav link is tapped
  var navLinks = document.querySelectorAll(".nav__links a");
  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("open");
    });
  });


  /* ============================================================
     3. SCROLL-REVEAL ANIMATIONS
     Adds the class "in-view" to any .reveal element once it
     scrolls into view, which triggers its CSS transition.
     ============================================================ */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback for very old browsers: just show everything
    revealEls.forEach(function (el) { el.classList.add("in-view"); });
  }


  /* ============================================================
     4. ANIMATED NUMBER COUNTERS
     Any element with data-count="123" counts up when seen.
     Optional: data-suffix="+" appends text after the number.
     ============================================================ */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1600;
    var start = 0;
    var startTime = null;

    function step(now) {
      if (!startTime) startTime = now;
      var progress = Math.min((now - startTime) / duration, 1);
      // ease-out
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.floor(eased * (target - start) + start);
      el.textContent = value.toLocaleString("en-IN") + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("en-IN") + suffix;
    }
    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || "");
    });
  }


  /* ============================================================
     5. HERO ROTATING WORD
     Cycles through the disciplines MAAC teaches.
     ============================================================ */
  var rotator = document.getElementById("rotator");
  if (rotator) {
    var words = ["VFX", "3D Animation", "Game Design", "UI/UX", "Graphic Design", "Video Editing"];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % words.length;
      rotator.style.opacity = "0";
      rotator.style.transform = "translateY(10px)";
      setTimeout(function () {
        rotator.textContent = words[i];
        rotator.style.opacity = "1";
        rotator.style.transform = "translateY(0)";
      }, 280);
    }, 2400);
    rotator.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    rotator.style.display = "inline-block";
  }


  /* ============================================================
     6. ENQUIRY FORM -> WHATSAPP
     Builds a tidy message from the form fields and opens
     WhatsApp chat (no backend / server needed).
     ============================================================ */
  var form = document.getElementById("enquiryForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name   = form.elements["name"].value.trim();
      var phone  = form.elements["phone"].value.trim();
      var email  = form.elements["email"].value.trim();
      var course = form.elements["course"].value;
      var msg    = form.elements["message"].value.trim();

      // Compose a readable WhatsApp message
      var text =
        "Hello MAAC Ghaziabad! I'd like to enquire about admissions.\n\n" +
        "*Name:* " + name + "\n" +
        "*Phone:* " + phone + "\n" +
        (email ? "*Email:* " + email + "\n" : "") +
        "*Course of Interest:* " + course + "\n" +
        (msg ? "*Message:* " + msg : "");

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);

      // Open WhatsApp in a new tab
      window.open(url, "_blank");

      // Show a small confirmation toast
      showToast("Opening WhatsApp… please tap send to reach us!");
      form.reset();
    });
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(function () { toast.classList.remove("show"); }, 4000);
  }


  /* ============================================================
     7. FOOTER YEAR
     ============================================================ */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ============================================================
     8. COURSE "VIEW DETAILS" TOGGLES
     Expands/collapses the detailed info inside each course card.
     ============================================================ */
  var courseToggles = document.querySelectorAll(".course__toggle");
  courseToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".course");
      var isOpen = card.classList.toggle("open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      btn.firstChild.textContent = isOpen ? "Hide Details" : "View Details";
    });
  });

});
