// Watches all [data-animate] elements and reveals them once they enter the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // fire once, not every scroll
    }
  });
}, { threshold: 0 });

// Splits an element's text into individual words, each wrapped in a span
// so animation attributes (data-animate) can be applied per word from CSS/JS
// Splits a headline's text into per-word spans for animation, while preserving
// any existing styled elements (e.g. a premade <span> for color emphasis)
function splitIntoWordSpans(selector) {
  const elements = document.querySelectorAll(selector);

  if (elements.length === 0) {
    console.error(`splitIntoWordSpans: no elements found for selector "${selector}"`);
    return;
  }

  elements.forEach((el) => {
    const originalNodes = Array.from(el.childNodes); // snapshot before we clear anything
    el.innerHTML = '';

    originalNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // plain text: split into word-spans as before
        const words = node.textContent.trim().split(/\s+/).filter(Boolean);
        words.forEach((word, index) => {
          const span = document.createElement('span');
          span.textContent = word;
          span.setAttribute('data-animate', 'reveal-up');
          el.appendChild(span);
          if (index < words.length - 1) el.appendChild(document.createTextNode(' '));
        });
      } else {
        // existing element (e.g. your premade styled span): keep it untouched,
        // but still make it animate as its own "word" unit
        node.setAttribute('data-animate', 'reveal-up');
        el.appendChild(node);
      }
      el.appendChild(document.createTextNode(' ')); // spacing between nodes
    });
  });
}

// Run it on your hero heading once the DOM is ready
splitIntoWordSpans('.section-headline'); // replace with your actual selector

// Applies a staggered animation-delay to each word based on its position
document.querySelectorAll('.section-headline [data-animate]').forEach((el, index) => {
  el.style.animationDelay = `${index * 25}ms`;
});

document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));

// Cycles through .about-icon-item elements based on scroll position within their wrapper
const iconWrapper = document.querySelector('.about-icon-wrapper');
const iconItems = document.querySelectorAll('.about-icon-item');

const dots = document.querySelectorAll('.about-dot');

function updateActiveIconItem() {
  if (!iconWrapper) return;

  const rect = iconWrapper.getBoundingClientRect();
  const wrapperHeight = iconWrapper.offsetHeight;
  const viewportHeight = window.innerHeight;

  const scrolled = -rect.top;
  const maxScroll = wrapperHeight - viewportHeight;
  const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

  // divide progress into equal steps, one per item
  const activeIndex = Math.min(
    Math.floor(progress * iconItems.length),
    iconItems.length - 1
  );

  iconItems.forEach((item, index) => {
    if (index === activeIndex) {
      item.classList.add('is-visible');
    } else {
      item.classList.remove('is-visible');
    }
  });
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === activeIndex);
  });
}

window.addEventListener('scroll', updateActiveIconItem, { passive: true });
updateActiveIconItem(); // run once on load in case about is already in view