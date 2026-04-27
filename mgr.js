const panel = document.querySelector('.panel');
const header = document.querySelector('header');
const downArrow = document.getElementById('downArrow');

// Capture header's natural bottom position once, before any scrolling
const headerNaturalBottom = header.getBoundingClientRect().bottom;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const panelTop = panel.getBoundingClientRect().top;

  downArrow.style.opacity = Math.max(0, 1 - scrollY / vh);

  if (panelTop <= headerNaturalBottom + 50) {
    const overlap = (headerNaturalBottom + 50) - panelTop;
    header.style.transform = `translateY(-${overlap}px)`;
  } else {
    header.style.transform = '';
  }
});