

(function () {
  'use strict';

  
  function initFooterYear() {
    const targets = document.querySelectorAll('.js-year');
    const year = String(new Date().getFullYear());
    targets.forEach(function (el) { el.textContent = year; });
  }

  
  function setAnswerHeight(item, open) {
    const answer = item.querySelector('.faq-answer');
    const btn = item.querySelector('.faq-question');
    if (!answer || !btn) return;

    if (open) {
      item.classList.add('is-open');
      answer.style.height = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    } else {
      item.classList.remove('is-open');
      answer.style.height = '0px';
      btn.setAttribute('aria-expanded', 'false');
    }
  }

  function initFaq() {
    const lists = document.querySelectorAll('.faq-list');
    if (!lists.length) return;

    lists.forEach(function (list) {
      const items = list.querySelectorAll('.faq-item');

      items.forEach(function (item) {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;

        btn.addEventListener('click', function () {
          const isOpen = item.classList.contains('is-open');

          items.forEach(function (other) {
            if (other !== item) setAnswerHeight(other, false);
          });

          setAnswerHeight(item, !isOpen);
        });
      });
    });
    let resizeScheduled = false;
    window.addEventListener('resize', function () {
      if (resizeScheduled) return;
      resizeScheduled = true;
      requestAnimationFrame(function () {
        document.querySelectorAll('.faq-item.is-open').forEach(function (item) {
          const answer = item.querySelector('.faq-answer');
          if (answer) answer.style.height = answer.scrollHeight + 'px';
        });
        resizeScheduled = false;
      });
    });
  }

  
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    const status = document.getElementById('formStatus');
    const errorStatus = document.getElementById('formStatusError');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      const sendingLabel = document.documentElement.lang === 'ar' ? 'جارٍ الإرسال…' : 'Sending…';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = sendingLabel;
      }
      if (status) status.classList.remove('is-visible');
      if (errorStatus) errorStatus.classList.remove('is-visible');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            if (status) status.classList.add('is-visible');
            form.reset();
          } else {
            return response.json().then(function () {
              if (errorStatus) errorStatus.classList.add('is-visible');
            });
          }
        })
        .catch(function () {
          if (errorStatus) errorStatus.classList.add('is-visible');
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
        });
    });
  }

  
  function safeGetLang() {
    try {
      return localStorage.getItem('siteLang') || 'en';
    } catch (e) {
      return 'en';
    }
  }

  function safeSetLang(lang) {
    try {
      localStorage.setItem('siteLang', lang);
    } catch (e) {
      
    }
  }

  
  function initLanguageSwitcher() {
    const btn = document.getElementById('langToggle');
    if (!btn) return;
    let currentLang = safeGetLang();

    function setLang(lang) {
      const html = document.documentElement;
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      btn.textContent = lang === 'ar' ? 'EN' : 'AR';
      btn.setAttribute('aria-label', lang === 'ar' ? 'Switch language to English' : 'Switch language to Arabic');
      safeSetLang(lang);
      document.querySelectorAll('[data-en][data-ar]').forEach(function (el) {
        el.textContent = el.getAttribute('data-' + lang);
      });
      html.classList.remove('i18n-pending');
      window.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
    }
    setLang(currentLang);
    btn.addEventListener('click', function () {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      setLang(currentLang);
    });
  }

  
  function initTextRotator() {
    const wordsEn = ["brand worlds.", "brand identity.", "new visions.", "UI systems."];
    const wordsAr = ["علامات جريئة.", "هوية بصرية.", "رؤى مبتكرة.", "واجهات استخدام."];

    let currentIndex = 0;
    const textEl = document.getElementById("rotatingText");
    if (!textEl) return;
    let currentWords = document.documentElement.lang === 'ar' ? wordsAr : wordsEn;
    window.addEventListener('langChanged', function (e) {
      currentWords = e.detail === 'ar' ? wordsAr : wordsEn;
      textEl.textContent = currentWords[currentIndex];
    });

    function rotate() {
      textEl.classList.add("slide-out");
      setTimeout(function () {
        currentIndex = (currentIndex + 1) % currentWords.length;
        textEl.textContent = currentWords[currentIndex];

        textEl.classList.remove("slide-out");
        textEl.classList.add("slide-in");

        setTimeout(function () {
          textEl.classList.remove("slide-in");
        }, 550);
      }, 400);
    }
    let intervalId = setInterval(rotate, 3800);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(rotate, 3800);
      }
    });
  }

  
  function initPageLoader() {
    const loader = document.getElementById('pageLoader');
    if (!loader) return;

    const SEEN_KEY = 'chSplashSeen';
    let alreadySeen = false;
    try {
      alreadySeen = document.documentElement.classList.contains('loader-seen');
    } catch (e) {}

    
    if (alreadySeen) {
      window.dispatchEvent(new CustomEvent('pageLoaderDone'));
      return;
    }

    const counterEl = document.getElementById('pageLoaderCounter');
    
    const MIN_VISIBLE_MS = 2000;
    document.body.classList.add('is-loading');
    let hidden = false;
    let creepRafId = null;

    function setCount(n) {
      if (counterEl) counterEl.textContent = String(Math.round(n));
    }

    
    function creepProgress() {
      const elapsed = performance.now();
      const t = Math.min(elapsed / MIN_VISIBLE_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      setCount(Math.min(eased * 92, 92));
      if (!hidden) creepRafId = requestAnimationFrame(creepProgress);
    }

    function finishProgress(done) {
      if (creepRafId) cancelAnimationFrame(creepRafId);
      const from = (counterEl && parseFloat(counterEl.textContent)) || 92;
      const start = performance.now();
      const duration = 260;
      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        setCount(from + (100 - from) * t);
        if (t < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(100);
          done();
        }
      }
      requestAnimationFrame(step);
    }

    function hideLoader() {
      if (hidden) return;
      hidden = true;
      finishProgress(function () {
        document.body.classList.remove('is-loading');
        loader.classList.add('is-hidden');
        loader.setAttribute('aria-hidden', 'true');
        try {
          sessionStorage.setItem(SEEN_KEY, '1');
        } catch (e) {}
        window.dispatchEvent(new CustomEvent('pageLoaderDone'));
      });
    }

    function armHide() {
      const elapsed = performance.now();
      const remaining = Math.max(MIN_VISIBLE_MS - elapsed, 0);
      setTimeout(hideLoader, remaining);
    }

    
    let windowReady = document.readyState === 'complete';

    function maybeArmHide() {
      if (windowReady) armHide();
    }

    if (windowReady) {
    } else {
      window.addEventListener('load', function () {
        windowReady = true;
        maybeArmHide();
      });
    }

    creepRafId = requestAnimationFrame(creepProgress);
    maybeArmHide();
    setTimeout(hideLoader, 8000);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();
    initFooterYear();
    initFaq();
    initContactForm();
    initLanguageSwitcher();
    initTextRotator();
  });
})();