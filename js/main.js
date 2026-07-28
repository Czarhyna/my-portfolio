// Watches all [data-animate] elements and reveals them once they enter the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target); // fire once, not every scroll
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('[data-animate]').forEach((el) => observer.observe(el));