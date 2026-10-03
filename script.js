/* =========================================================
   KASHISH PORTFOLIO — script.js
   1. Role switcher   (MERN STACK / FRONTEND / DATA ANALYST)
   2. Project filter  (ALL / MERN STACK / FRONTEND / DATA ANALYST)
   3. Contact form    (validation + send)
   4. Mobile menu closes after tapping a link
   ========================================================= */

(function () {
  'use strict';

  /* ---------------- SETTINGS (edit these) ---------------- */

  // Text shown under your name BEFORE any role is chosen (also shown again
  // when the visitor clicks the active role button a second time)
  var GENERAL_TAGLINE = 'I create modern digital experiences by combining MERN Stack development, frontend engineering, and data-driven solutions.';

  // Text shown under your name for each role
  var ROLE_TAGLINES = {
    mern:     'I develop MERN Stack applications with REST APIs, JWT authentication, database integration and responsive React interfaces.',
    frontend: 'I craft responsive, user-friendly interfaces with HTML, CSS, Bootstrap, JavaScript and React.',
    data:     'I turn raw data into insights with Python, Pandas, Matplotlib and Power BI dashboards.'
  };

  // One CV link per role. Paste your Google Drive share links between the quotes.
  // Leave a role as '' to use the default CV link written in index.html.
  // (The default CV is also what shows before any role is chosen.)
  var CV_LINKS = {
    mern: 'https://drive.google.com/file/d/1l9SiDyBN3jgge9_LpoOSi2_O55jbDpHB/view?usp=sharing',      // e.g. 'https://drive.google.com/file/d/XXXX/view?usp=sharing'
    frontend: 'https://drive.google.com/file/d/1Qp72C_dq3Pd-E4rKqzdcONdq_n5Rvfvs/view?usp=sharing',
    data: 'https://drive.google.com/file/d/1tLa4L3548Qrl3ROuNHkJaZK_-WcW1uJo/view?usp=sharing'
  };

  // true  = clicking a role button also filters the projects to that role
  // false = role button only changes colour, text and skills (projects stay on ALL)
  var SYNC_FILTER_WITH_ROLE = false;

  // Contact form:
  //  - '' (empty)  -> opens the visitor's email app with the message filled in
  //  - Formspree / similar endpoint URL (https://formspree.io/f/xxxx) -> sends the form directly
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'kashishsrivastava276@gmail.com';

  /* ---------------- helpers ---------------- */

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function fadeIn(el) {
    if (reduceMotion || !el.animate) return;
    el.animate(
      [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 280, easing: 'ease-out' }
    );
  }

  /* ---------------- 1. ROLE SWITCHER ---------------- */

  var roleButtons = $$('.role-btn');
  var heroTag = $('#heroTag');
  var cvBtn = $('#cvBtn');
  var defaultCv = cvBtn ? cvBtn.getAttribute('href') : '';
  var currentRole = null; // null = no role chosen yet (general view)

  // role = 'mern' | 'frontend' | 'data' | null (general)
  function setRole(role, silent) {
    currentRole = role;

    // 'general' has no colour rule in CSS, so the default cobalt theme is used
    document.body.setAttribute('data-role', role || 'general');

    roleButtons.forEach(function (btn) {
      var on = role !== null && btn.getAttribute('data-role') === role;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    if (heroTag) {
      heroTag.textContent = role ? ROLE_TAGLINES[role] : GENERAL_TAGLINE;
      if (!silent) fadeIn(heroTag);
    }

    if (cvBtn) cvBtn.setAttribute('href', (role && CV_LINKS[role]) || defaultCv);

    if (SYNC_FILTER_WITH_ROLE && !silent) setFilter(role || 'all');
  }

  roleButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var role = btn.getAttribute('data-role');
      // clicking the active role again goes back to the general view
      setRole(currentRole === role ? null : role);
    });
  });

  // start in the general view: general tagline, no role selected
  setRole(null, true);

  /* ---------------- 2. PROJECT FILTER ---------------- */

  var filterButtons = $$('.filter-btn');
  var projectCards = $$('#projects [data-role]'); // featured card + grid items

  function setFilter(filter) {
    filterButtons.forEach(function (btn) {
      var on = btn.getAttribute('data-filter') === filter;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });

    projectCards.forEach(function (card) {
      var show = filter === 'all' || card.getAttribute('data-role') === filter;
      var wasHidden = card.classList.contains('is-hidden');
      card.classList.toggle('is-hidden', !show);
      if (show && wasHidden) fadeIn(card);
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setFilter(btn.getAttribute('data-filter'));
    });
  });

  setFilter('all');

  /* ---------------- 3. CONTACT FORM ---------------- */

  var form = $('#contactForm');
  var statusEl = $('#formStatus');

  function showStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('ok', 'err');
    if (type) statusEl.classList.add(type);
  }

  function validate(fields) {
    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.value.trim());
    if (fields.name.value.trim().length < 2) return { el: fields.name, msg: 'Please enter your name.' };
    if (!emailOk) return { el: fields.email, msg: 'Please enter a valid email address.' };
    if (fields.msg.value.trim().length < 10) return { el: fields.msg, msg: 'Your message should be at least 10 characters.' };
    return null;
  }

  if (form) {
    var fields = { name: $('#cName'), email: $('#cEmail'), msg: $('#cMsg') };
    var submitBtn = $('button[type="submit"]', form);

    // clear the error state while typing
    Object.keys(fields).forEach(function (k) {
      fields[k].addEventListener('input', function () {
        fields[k].removeAttribute('aria-invalid');
        showStatus('', '');
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var problem = validate(fields);
      Object.keys(fields).forEach(function (k) { fields[k].removeAttribute('aria-invalid'); });
      if (problem) {
        problem.el.setAttribute('aria-invalid', 'true');
        problem.el.focus();
        showStatus(problem.msg, 'err');
        return;
      }

      var data = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        message: fields.msg.value.trim()
      };

      // Option A: no endpoint -> open the visitor's email app
      if (!FORM_ENDPOINT) {
        var subject = encodeURIComponent('Portfolio message from ' + data.name);
        var body = encodeURIComponent(data.message + '\n\n— ' + data.name + ' (' + data.email + ')');
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
        showStatus('Opening your email app… if nothing opens, write to ' + CONTACT_EMAIL, 'ok');
        return;
      }

      // Option B: send to the form endpoint (Formspree etc.)
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      showStatus('', '');

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed');
          form.reset();
          showStatus('Thanks! Your message has been sent.', 'ok');
        })
        .catch(function () {
          showStatus('Could not send right now. Please email me at ' + CONTACT_EMAIL, 'err');
        })
        .then(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Send message'; }
        });
    });
  }

  /* ---------------- 4. CLOSE MOBILE MENU ON LINK CLICK ---------------- */

  var navMenu = $('#navMenu');
  if (navMenu) {
    $$('a', navMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        if (navMenu.classList.contains('show') && window.bootstrap && window.bootstrap.Collapse) {
          window.bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
        }
      });
    });
  }
})();
