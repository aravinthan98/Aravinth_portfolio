/**
 * Portfolio - Mobile menu toggle
 */
function initMobileMenu() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  if (!navToggle || !navbar) return;

  navToggle.addEventListener('click', () => {
    navbar.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navbar.classList.contains('active') ? 'hidden' : '';
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Portfolio - Navbar scroll effect (backdrop blur)
 */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * Portfolio - Scroll-triggered section reveal (Intersection Observer)
 */
function initScrollReveal() {
  const sections = document.querySelectorAll('.section-reveal');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          const workItems = entry.target.querySelectorAll('.work-item');
          workItems.forEach((item) => item.classList.add('visible'));
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * Portfolio - Tab switching (Skills / Experience / Education)
 */
function initTabs() {
  const tabLinks = document.querySelectorAll('.tab-links');
  const tabContents = document.querySelectorAll('.tab-contents');

  tabLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const tabName = link.getAttribute('data-tab');
      if (!tabName) return;

      tabLinks.forEach((l) => l.classList.remove('active-links'));
      tabContents.forEach((c) => c.classList.remove('active-tab'));

      link.classList.add('active-links');
      const target = document.getElementById(tabName);
      if (target) {
        target.classList.add('active-tab');
      }
    });
  });
}

/**
 * Portfolio - Contact form (Formsubmit.co AJAX)
 * Delivers to arularavinth253@gmail.com
 * First submission: check inbox for Formsubmit activation email
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const submitBtn = form?.querySelector('.form-submit-btn');
  const btnText = form?.querySelector('.btn-text');
  const btnLoading = form?.querySelector('.btn-loading');
  const btnSuccess = form?.querySelector('.btn-success');
  const formMessage = document.getElementById('formMessage');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const honey = form.querySelector('input[name="_honey"]');
    if (honey?.value) return;

    const name = form.querySelector('input[name="name"]')?.value?.trim() || '';
    const email = form.querySelector('input[name="email"]')?.value?.trim() || '';
    const message = form.querySelector('textarea[name="message"]')?.value?.trim() || '';

    setFormState('loading');
    formMessage.textContent = '';
    const fallbackEl = document.getElementById('formFallback');
    if (fallbackEl) fallbackEl.style.display = 'none';

    try {
      const res = await fetch('https://formsubmit.co/ajax/arularavinth253@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio Contact from ${name}`,
          _replyto: email,
          _captcha: 'false'
        })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid response');
      }

      if (data.success === 'true' || data.success === true) {
        setFormState('success');
        formMessage.textContent = 'Thanks! Your message has been sent. I\'ll get back soon.';
        formMessage.className = 'form-message form-message-success';
        form.reset();
        setTimeout(() => setFormState('idle'), 3000);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setFormState('idle');
      formMessage.textContent = 'Couldn\'t send via form.';
      formMessage.className = 'form-message form-message-error';
      const fallback = document.getElementById('formFallback');
      const mailtoLink = document.getElementById('mailtoFallback');
      if (fallback && mailtoLink) {
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`From: ${email}\n\n${message}`);
        mailtoLink.href = `mailto:arularavinth253@gmail.com?subject=${subject}&body=${body}`;
        fallback.style.display = 'block';
      }
    }
  });

  function setFormState(state) {
    submitBtn.disabled = state === 'loading';
    btnText.style.display = state === 'idle' ? 'inline' : 'none';
    btnLoading.style.display = state === 'loading' ? 'inline' : 'none';
    btnSuccess.style.display = state === 'success' ? 'inline' : 'none';
    if (state === 'idle') {
      btnSuccess.style.display = 'none';
    }
  }

  submitBtn.disabled = false;
}

/**
 * Portfolio - Typed text effect for hero role
 */
function initTypedText() {
  const typedEl = document.getElementById('typed-text');
  if (!typedEl) return;

  const text = 'Full Stack Developer.';
  let index = 0;

  function type() {
    if (index < text.length) {
      typedEl.textContent += text.charAt(index);
      index++;
      setTimeout(type, 100);
    } else {
      setTimeout(reset, 3000);
    }
  }

  function reset() {
    typedEl.textContent = '';
    index = 0;
    setTimeout(type, 500);
  }

  setTimeout(type, 800);
}

/**
 * Initialize all modules on DOM ready
 */
function init() {
  initTypedText();
  initMobileMenu();
  initNavbarScroll();
  initScrollReveal();
  initTabs();
  initContactForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
