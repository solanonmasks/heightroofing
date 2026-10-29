/* =========================================================
   Height Roofing — site behaviour (plain JavaScript, no libraries)
   ========================================================= */

/*
  FORM_ENDPOINT: where the contact form is sent.
  Paste the URL from your form service here, for example a Formspree form:
    const FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
  While it is empty (''), the form just shows the thank-you message
  and nothing is sent anywhere.
*/
const FORM_ENDPOINT = '';

document.addEventListener('DOMContentLoaded', function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setUpServiceTabs();
  setUpChips();
  setUpContactForm();
  if (!reduceMotion) setUpScrollReveal();
});


/* ---------- Service tabs (Commercial / Residential / Torch-on) ---------- */
function setUpServiceTabs() {
  const tabs = Array.from(document.querySelectorAll('.svc-tab'));
  if (!tabs.length) return;

  function select(index, moveFocus) {
    tabs.forEach(function (tab, i) {
      const active = i === index;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1; // only the active tab is in the Tab order
      panel.hidden = !active;          // showing a panel restarts its fade-in animation
    });
    if (moveFocus) tabs[index].focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { select(i, false); });

    // Arrow keys / Home / End move between tabs (standard keyboard pattern)
    tab.addEventListener('keydown', function (e) {
      let next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabs.length - 1;
      if (next !== null) { e.preventDefault(); select(next, true); }
    });
  });

  select(0, false); // start on "Commercial"
}


/* ---------- Service chips in the form ---------- */
function setUpChips() {
  const chips = Array.from(document.querySelectorAll('.chip'));
  const hiddenField = document.getElementById('services-field');

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      const on = chip.getAttribute('aria-pressed') !== 'true';
      chip.setAttribute('aria-pressed', on ? 'true' : 'false');

      // Save the chosen services in the hidden field, e.g. "Commercial, Torch-on"
      hiddenField.value = chips
        .filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
        .map(function (c) { return c.textContent.trim(); })
        .join(', ');
    });
  });
}


/* ---------- Contact form ---------- */
function setUpContactForm() {
  const form = document.getElementById('contact-form');
  const thanks = document.getElementById('form-thanks');
  const error = document.getElementById('form-error');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showThanks() {
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); // stay on the page
    error.hidden = true;

    if (!FORM_ENDPOINT) {
      console.warn('Height Roofing: no FORM_ENDPOINT is set in script.js, so this message was not sent anywhere.');
      showThanks();
      return;
    }

    submitBtn.disabled = true;
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Server replied ' + response.status);
        showThanks();
      })
      .catch(function (err) {
        console.error('Height Roofing: the form could not be sent.', err);
        error.hidden = false;
      })
      .finally(function () {
        submitBtn.disabled = false;
      });
  });
}


/* ---------- Scroll reveal ----------
   Anything marked data-reveal fades and rises into view as you scroll to it.
   Things already on screen when the page loads are left alone.
   After 3.5 seconds everything is shown anyway, just in case. */
function setUpScrollReveal() {
  const items = Array.from(document.querySelectorAll('[data-reveal]'));

  function show(el, i) {
    if (el.dataset.shown) return;
    el.dataset.shown = '1';
    el.style.transitionDelay = (i * 0.08) + 's'; // small stagger between items
    el.classList.add('reveal-in');
    el.classList.remove('reveal-hidden');
  }

  // Hide only the items that start below the bottom of the screen
  items.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.dataset.shown = '1';
    } else {
      el.classList.add('reveal-hidden');
    }
  });

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      const limit = window.innerHeight * 0.92;
      let i = 0;
      items.forEach(function (el) {
        if (!el.dataset.shown && el.getBoundingClientRect().top < limit) show(el, i++);
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // Safety net: reveal everything after 3.5 seconds
  setTimeout(function () {
    items.forEach(function (el) { show(el, 0); });
  }, 3500);
}
