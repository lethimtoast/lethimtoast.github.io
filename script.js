/**
 * SAATVIK GUPTA - PORTFOLIO INTERACTION LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. Mobile Drawer Navigation
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. Scroll Spy Navigation
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  // 4. Resume Modal
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');
  const closeResumeFooterBtn = document.getElementById('close-resume-footer-btn');
  const resumeOverlay = document.getElementById('resume-modal-overlay');

  const openModal = () => {
    if (resumeModal) {
      resumeModal.classList.add('active');
      resumeModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (resumeModal) {
      resumeModal.classList.remove('active');
      resumeModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (openResumeBtn) openResumeBtn.addEventListener('click', openModal);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeModal);
  if (closeResumeFooterBtn) closeResumeFooterBtn.addEventListener('click', closeModal);
  if (resumeOverlay) resumeOverlay.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
      closeModal();
    }
  });

  // 5. Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const sendBtn = document.getElementById('send-btn');
  const formAlert = document.getElementById('form-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill out all required fields.');
        return;
      }

      sendBtn.disabled = true;
      sendBtn.textContent = 'Sending...';

      setTimeout(() => {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Message';
        contactForm.reset();

        formAlert.className = 'form-alert-box success';
        formAlert.textContent = '✓ Thank you! Your message has been sent to Saatvik.';
        formAlert.removeAttribute('hidden');

        showToast('Message sent successfully!');

        setTimeout(() => {
          formAlert.setAttribute('hidden', 'true');
        }, 5000);
      }, 800);
    });
  }

  // 6. Toast Notification Helper
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});
