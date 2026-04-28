const panel = document.querySelector('.panel');
const header = document.querySelector('header');
const downArrow = document.getElementById('downArrow');
const mainNav = document.querySelector('.mainNav');
const navName = document.querySelector('.navName');

const headerNaturalBottom = header.getBoundingClientRect().bottom;
const navHeight = mainNav.getBoundingClientRect().height;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const vh = window.innerHeight;
  const panelTop = panel.getBoundingClientRect().top;

  downArrow.style.opacity = Math.max(0, 1 - scrollY / vh);

  const fadeEnd = vh - navHeight;
  const fadeStart = fadeEnd * 0.7;
  const fadeProgress = Math.min(1, Math.max(0, (scrollY - fadeStart) / (fadeEnd - fadeStart)));
  mainNav.style.background = `rgba(0,0,0,${fadeProgress})`;
  navName.style.opacity = fadeProgress;

  if (panelTop <= headerNaturalBottom + 65) {
    const overlap = (headerNaturalBottom + 65) - panelTop;
    header.style.transform = `translateY(-${overlap}px)`;
  } else {
    header.style.transform = '';
  }
});


