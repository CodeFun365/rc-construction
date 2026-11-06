// RC Construction: mobile menu, lead source, the three-step estimate form and form sending. No framework, no tracking.
(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.menu-toggle');
  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) {
        header.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  // Remember where the visitor first came from (Google ad, Google Maps, search, another site), so every
  // estimate request says where the lead came from. Kept for this browser tab only.
  var source = '';
  try {
    source = sessionStorage.getItem('rc_source') || '';
    if (!source) {
      var q = new URLSearchParams(location.search);
      var parts = [];
      if (q.get('gclid')) parts.push('Google Ads');
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { if (q.get(k)) parts.push(k.slice(4) + '=' + q.get(k)); });
      var ref = document.referrer && document.referrer.indexOf(location.host) === -1 ? document.referrer.split('/')[2] : '';
      if (ref) parts.push('from ' + ref);
      parts.push('landed on ' + location.pathname);
      source = parts.join(', ');
      sessionStorage.setItem('rc_source', source);
    }
  } catch (e) { source = 'landed on ' + location.pathname; }

  var forms = document.querySelectorAll('form.lead-form');
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector('.form-status');
    var set = function (name, value) { var el = form.querySelector('input[name="' + name + '"]'); if (el) el.value = value; };
    set('lead_source', source || 'direct');
    set('page', location.pathname);

    // Three steps: show one at a time and check each step before moving on.
    var steps = form.hasAttribute('data-steps') ? form.querySelectorAll('.step') : [];
    var current = 0;
    var bar = form.querySelector('.progress-bar');
    var show = function (i, focus) {
      current = i;
      Array.prototype.forEach.call(steps, function (s, n) { s.classList.toggle('is-current', n === i); });
      if (bar) bar.style.width = Math.round(((i + 1) / steps.length) * 100) + '%';
      if (focus) {
        var first = steps[i].querySelector('input:not([type=hidden]), select, textarea');
        if (first) first.focus({ preventScroll: true });
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    var stepValid = function (i) {
      var fields = steps[i].querySelectorAll('input, select, textarea');
      for (var n = 0; n < fields.length; n++) { if (!fields[n].checkValidity()) { fields[n].reportValidity(); return false; } }
      return true;
    };
    if (steps.length) {
      show(0, false);
      form.addEventListener('click', function (e) {
        if (e.target.closest('[data-next]') && stepValid(current)) show(current + 1, true);
        if (e.target.closest('[data-back]')) show(current - 1, true);
      });
      // Picking an answer on a one-question step moves straight to the next step.
      form.addEventListener('change', function (e) {
        var step = e.target.closest('.step');
        if (e.target.type === 'radio' && step === steps[0] && current === 0) setTimeout(function () { show(1, true); }, 180);
      });
    }

    // Sends through Web3Forms (free). Until an access key is set in config.js,
    // it asks people to call or text instead of failing silently.
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        for (var n = 0; n < steps.length; n++) { if (!stepValid(n)) { show(n, false); stepValid(n); return; } }
        form.reportValidity();
        return;
      }
      var key = form.querySelector('input[name="access_key"]');
      if (!key || !key.value || key.value.indexOf('YOUR_') === 0) {
        status.className = 'form-status err';
        status.textContent = 'Our online form is being set up. Please call or text ' + form.dataset.phone + ' and we will get right back to you.';
        return;
      }
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = 'Sending…';
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          if (!data.success) throw new Error(data.message || 'Something went wrong');
          location.href = '/thank-you/';
        })
        .catch(function () {
          status.className = 'form-status err';
          status.textContent = 'Sorry, that did not send. Please call or text ' + form.dataset.phone + '.';
          button.disabled = false;
          button.textContent = 'Send my request';
        });
    });
  });
})();
