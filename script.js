/**
 * SAATVIK'S PROFILE WEBPAGE - CLIENT INTERACTIONS & LOGIC
 * Features: Theme Toggling, Mobile Navigation, Scroll Spy, Skills Filtering,
 *           Tab Navigation, Copy Clipboard, Form Validation, Live Clock.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Elements Selection
  const htmlElement = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileToggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileNavDrawer = document.getElementById('mobile-nav');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('header');
  const backToTopBtn = document.getElementById('back-to-top');
  const liveTimeTicker = document.getElementById('live-time-ticker');
  const currentYearSpan = document.getElementById('current-year');
  const toastContainer = document.getElementById('toast-container');

  // Set current year dynamically
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('theme-preference');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const applyTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme-preference', theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  // Initialize Theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme.toUpperCase()} mode ✨`);
    });
  }

  // Listen to OS theme changes if user has no explicit preference
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const toggleMobileNav = (open) => {
    const isOpen = open !== undefined ? open : !mobileNavDrawer.classList.contains('open');
    mobileNavDrawer.classList.toggle('open', isOpen);
    mobileToggleBtn.setAttribute('aria-expanded', isOpen.toString());
    mobileNavDrawer.setAttribute('aria-hidden', (!isOpen).toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (mobileToggleBtn && mobileNavDrawer) {
    mobileToggleBtn.addEventListener('click', () => toggleMobileNav());

    // Close when clicking any mobile link
    const mobileLinks = mobileNavDrawer.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileNav(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        toggleMobileNav(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Scroll Tracking (Progress Bar & Header Effect)
  // --------------------------------------------------------------------------
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // --------------------------------------------------------------------------
  // 5. Scroll-Spy Navigation Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links .nav-link');

  const highlightNavOnScroll = () => {
    const scrollPos = window.scrollY + 180;

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
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --------------------------------------------------------------------------
  // 6. Journey Tabs (Experience / Education / Certifications)
  // --------------------------------------------------------------------------
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('aria-controls');

      // Update button states
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Update tab pane visibility
      tabPanes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
          pane.removeAttribute('hidden');
        } else {
          pane.classList.remove('active');
          pane.setAttribute('hidden', 'true');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. Skills Category Filter
  // --------------------------------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      // Toggle active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter cards
      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 8. Copy to Clipboard
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('.copy-email-btn, .copy-icon-btn');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const emailToCopy = btn.getAttribute('data-email') || 'saatvik.dev@example.com';
      try {
        await navigator.clipboard.writeText(emailToCopy);
        const label = btn.querySelector('.btn-copy-label');
        if (label) {
          const originalText = label.textContent;
          label.textContent = 'Copied!';
          setTimeout(() => { label.textContent = originalText; }, 2000);
        }
        showToast(`Email (${emailToCopy}) copied to clipboard! 📋`);
      } catch (err) {
        showToast(`Email: ${emailToCopy}`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 9. Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message, duration = 3000) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('hide');
      toast.addEventListener('animationend', () => toast.remove());
    }, duration);
  }

  // --------------------------------------------------------------------------
  // 10. Live IST Time Ticker in Footer
  // --------------------------------------------------------------------------
  const updateLiveClock = () => {
    if (!liveTimeTicker) return;
    const now = new Date();
    // Format in Indian Standard Time (IST)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    liveTimeTicker.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  };

  updateLiveClock();
  setInterval(updateLiveClock, 1000);

  // --------------------------------------------------------------------------
  // 11. Interactive Contact Form Validation & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const messageInput = document.getElementById('form-message');
  const charCounter = document.getElementById('char-counter');
  const submitButton = document.getElementById('submit-button');
  const formStatusAlert = document.getElementById('form-status');

  // Character Counter
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const count = messageInput.value.length;
      charCounter.textContent = `${count} / 800`;
    });
  }

  // Validate Field Helper
  const validateField = (field, errorElementId, validatorFn) => {
    const parent = field.closest('.form-group');
    const isValid = validatorFn(field.value.trim());

    if (!isValid) {
      parent.classList.add('has-error');
    } else {
      parent.classList.remove('has-error');
    }
    return isValid;
  };

  if (contactForm) {
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');

    // Real-time blur validation
    if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, 'name-error', val => val.length >= 2));
    if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, 'email-error', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)));
    if (subjectInput) subjectInput.addEventListener('change', () => validateField(subjectInput, 'subject-error', val => val.length > 0));
    if (messageInput) messageInput.addEventListener('blur', () => validateField(messageInput, 'message-error', val => val.length >= 10));

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, 'name-error', val => val.length >= 2);
      const isEmailValid = validateField(emailInput, 'email-error', val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val));
      const isSubjectValid = validateField(subjectInput, 'subject-error', val => val.length > 0);
      const isMessageValid = validateField(messageInput, 'message-error', val => val.length >= 10);

      if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        showToast('⚠️ Please fix the highlighted fields in the form.');
        return;
      }

      // Simulate form submission
      submitButton.classList.add('loading');
      submitButton.disabled = true;

      setTimeout(() => {
        submitButton.classList.remove('loading');
        submitButton.disabled = false;

        // Reset form & show success
        contactForm.reset();
        if (charCounter) charCounter.textContent = '0 / 800';

        formStatusAlert.className = 'form-status-alert success';
        formStatusAlert.textContent = '🎉 Thank you! Your message has been sent successfully. Saatvik will get back to you shortly.';
        formStatusAlert.removeAttribute('hidden');

        showToast('Message sent successfully! 🚀');

        setTimeout(() => {
          formStatusAlert.setAttribute('hidden', 'true');
        }, 6000);
      }, 1200);
    });
  }

  // --------------------------------------------------------------------------
  // 12. Back to Top Button
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 13. Interactive 3D Card Hover Tilt Effect
  // --------------------------------------------------------------------------
  const profileCard = document.getElementById('profile-card');
  if (profileCard) {
    profileCard.addEventListener('mousemove', (e) => {
      const rect = profileCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      profileCard.style.transform = `perspective(1000px) rotateY(${x * 0.04}deg) rotateX(${-y * 0.04}deg)`;
    });

    profileCard.addEventListener('mouseleave', () => {
      profileCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
      profileCard.style.transition = 'transform 0.5s ease';
    });

    profileCard.addEventListener('mouseenter', () => {
      profileCard.style.transition = 'none';
    });
  }
});
