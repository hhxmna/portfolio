// Custom gradient cursor - replaces default cursor
const cursor = document.getElementById('custom-cursor');
if (cursor) {
  let visible = false;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    if (!visible) {
      cursor.style.opacity = '1';
      visible = true;
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    visible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (visible) cursor.style.opacity = '1';
  });

  cursor.style.opacity = '0';

  const cursorLabel = cursor.querySelector('.custom-cursor__label');

  // View project cursor on hover over work project cards
  const projectCards = document.querySelectorAll('.project-card[data-project]');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursorLabel.textContent = 'VIEW PROJECT';
      cursor.classList.add('custom-cursor--view-project');
    });
    card.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--view-project'));
  });

  // Try it out cursor on hover over playground project cards
  const playgroundCards = document.querySelectorAll('.project-card[data-cursor-label]');
  playgroundCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      cursorLabel.textContent = card.getAttribute('data-cursor-label') || 'TRY IT OUT';
      cursor.classList.add('custom-cursor--view-project');
    });
    card.addEventListener('mouseleave', () => cursor.classList.remove('custom-cursor--view-project'));
  });
}

// Page switching (work / playground / about)
const navLinks = document.querySelectorAll('.nav-link');
const pageViews = document.querySelectorAll('.page-view');
const aboutIntro = document.querySelector('.about-intro');
const aboutIntroDefault = aboutIntro ? aboutIntro.innerHTML : '';

function switchPage(pageId) {
  pageViews.forEach(view => {
    view.classList.toggle('page-view--active', view.getAttribute('data-page') === pageId);
  });
  navLinks.forEach(link => {
    link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${pageId}`);
  });
  document.body.removeAttribute('class');
  document.body.classList.add(`page-${pageId}`);

   // Update header intro copy based on current page
  if (aboutIntro) {
    if (pageId === 'playground') {
      aboutIntro.textContent = 'This is where my vibe-coded side projects, in-progress ideas, and small web experiments live while they find their shape.';
    } else if (pageId === 'about') {
      aboutIntro.textContent = '';
    } else {
      aboutIntro.innerHTML = aboutIntroDefault;
    }
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const pageId = href.slice(1);
    
    if (pageId === 'work' || pageId === 'playground' || pageId === 'about') {
      switchPage(pageId);
      history.replaceState(null, '', href);
    }
  });
});

// Initial page from URL hash
const hash = window.location.hash.slice(1);
if (hash === 'playground') {
  switchPage('playground');
} else if (hash === 'about') {
  switchPage('about');
} else {
  switchPage('work');
}

// Case study modals
document.addEventListener('DOMContentLoaded', () => {
  const modals = {
    'evidence-bundles': document.getElementById('case-study-modal'),
    'incident-report': document.getElementById('incident-report-modal'),
    'shop-provincial': document.getElementById('shop-provincial-modal')
  };

  const projectCards = document.querySelectorAll('.project-card[data-project]');

  function openModal(modal) {
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal(modal) {
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  }

  projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const project = card.getAttribute('data-project');
      const modal = modals[project];
      if (modal) openModal(modal);
    });
  });

  // Close handlers for each modal
  document.querySelectorAll('.modal').forEach(modal => {
    const backBtns = modal.querySelectorAll('.modal__back-btn');
    const backdrop = modal.querySelector('.modal__backdrop');
    const modalWindow = modal.querySelector('.modal__window');

    backBtns.forEach(btn => btn.addEventListener('click', () => closeModal(modal)));
    if (backdrop) backdrop.addEventListener('click', () => closeModal(modal));
    if (modalWindow) modalWindow.addEventListener('click', (e) => e.stopPropagation());
  });

  // Evidence Bundles: password gate
  const evidenceBundlesModal = document.getElementById('case-study-modal');
  const passwordForm = document.getElementById('evidence-bundles-password-form');
  const passwordInput = document.getElementById('evidence-bundles-password-input');
  const passwordError = document.getElementById('evidence-bundles-password-error');
  const EVIDENCE_BUNDLES_PASSWORD = 'letmein';

  if (evidenceBundlesModal && passwordForm && passwordInput && passwordError) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = passwordInput.value.trim();
      passwordError.textContent = '';
      if (value === EVIDENCE_BUNDLES_PASSWORD) {
        evidenceBundlesModal.classList.add('is-unlocked');
        passwordInput.value = '';
        passwordInput.blur();
        if (evidenceBundlesModal._updateNavFromScroll) {
          evidenceBundlesModal._updateNavFromScroll();
        }
      } else {
        passwordError.textContent = 'Incorrect password. Please try again.';
      }
    });
  }

  // "Want to read more?" cards — close current modal and open target project
  document.querySelectorAll('.case-study__more-card[data-project]').forEach(card => {
    const handleOpen = () => {
      const targetProject = card.getAttribute('data-project');
      const targetModal = modals[targetProject];
      const currentModal = document.querySelector('.modal.is-open');
      if (currentModal) closeModal(currentModal);
      if (targetModal) openModal(targetModal);
    };
    card.addEventListener('click', (e) => {
      e.preventDefault();
      handleOpen();
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  // Modal nav: scroll to section and update active state (per modal)
  const sectionMaps = {
    'evidence-bundles': { intro: 'intro', challenge: 'challenge', solution: 'solution', research: 'research', impact: 'impact' },
    'incident-report': { intro: 'intro-incident', challenge: 'challenge-incident', solution: 'solution-incident', research: 'research-incident', impact: 'impact-incident' },
    'shop-provincial': { intro: 'intro-shop', challenge: 'challenge-shop', solution: 'solution-shop', research: 'research-shop', impact: 'impact-shop' }
  };

  document.querySelectorAll('.modal').forEach(modal => {
    const navBtns = modal.querySelectorAll('.modal__nav-btn');
    const modalWindow = modal.querySelector('.modal__window');
    const modalType = modal.getAttribute('data-modal');
    const sectionMap = sectionMaps[modalType];

    if (!sectionMap || !modalWindow) return;

    // Map section id -> button label (e.g. 'intro-incident' -> 'intro', 'research' -> 'research')
    const sectionIdToLabel = {};
    Object.entries(sectionMap).forEach(([label, sectionId]) => {
      sectionIdToLabel[sectionId] = label;
    });

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sectionId = sectionMap[btn.textContent.trim().toLowerCase()];
        const section = sectionId ? document.getElementById(sectionId) : null;

        navBtns.forEach(b => b.classList.remove('modal__nav-btn--active'));
        btn.classList.add('modal__nav-btn--active');

        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Update active nav based on scroll position
    const labels = ['intro', 'challenge', 'solution', 'research', 'impact'];
    const sections = labels.map(l => ({ label: l, id: sectionMap[l], el: document.getElementById(sectionMap[l]) })).filter(s => s.el);

    function updateActiveFromScroll() {
      if (!modal.classList.contains('is-open')) return;
      const containerRect = modalWindow.getBoundingClientRect();
      const triggerOffset = 120;
      let activeLabel = labels[0];
      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].el.getBoundingClientRect();
        const topFromVisible = rect.top - containerRect.top;
        if (topFromVisible <= triggerOffset) {
          activeLabel = sections[i].label;
          break;
        }
      }
      navBtns.forEach(b => {
        const isActive = b.textContent.trim().toLowerCase() === activeLabel;
        b.classList.toggle('modal__nav-btn--active', isActive);
      });
    }

    let scrollTimeout;
    modalWindow.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveFromScroll, 50);
    }, { passive: true });

    modal._updateNavFromScroll = updateActiveFromScroll;
  });

  const openModalObserver = new MutationObserver((mutations) => {
    mutations.forEach(m => {
      if (m.target.classList.contains('is-open') && m.target._updateNavFromScroll) {
        setTimeout(() => m.target._updateNavFromScroll(), 100);
      }
    });
  });
  document.querySelectorAll('.modal').forEach(m => {
    openModalObserver.observe(m, { attributes: true, attributeFilter: ['class'] });
  });

  // About page: single portrait image (hover handled in CSS)
});
