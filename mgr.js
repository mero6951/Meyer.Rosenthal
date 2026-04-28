document.addEventListener('DOMContentLoaded', () => {

    // ── NAV / ARROW ──────────────────────────────────────────────────────
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

    // ── CAROUSEL ─────────────────────────────────────────────────────────
    const photoStrip = document.querySelector('.photoStrip');
    const photoTrack = document.querySelector('.photoTrack');
    let trackX = 0;
    let pinnedY = null;
    let horizontalDone = false;

    function getTrigger() {
        return window.scrollY + photoStrip.getBoundingClientRect().top - window.innerHeight + photoStrip.offsetHeight;
    }

    window.addEventListener('wheel', (e) => {
        const maxScroll = photoTrack.scrollWidth - photoStrip.offsetWidth;
        const scrollingDown = e.deltaY > 0;
        const TRIGGER = getTrigger();

        const enterDown = scrollingDown && window.scrollY >= TRIGGER && trackX <= 0 && !horizontalDone;
        const enterUp = !scrollingDown && Math.abs(window.scrollY - TRIGGER) < 50 && trackX >= maxScroll && horizontalDone;

        if (pinnedY !== null || enterDown || enterUp) {
            if (pinnedY === null) pinnedY = window.scrollY;
            e.preventDefault();
            window.scrollTo(0, pinnedY);
            trackX = Math.min(maxScroll, Math.max(0, trackX + e.deltaY));
            photoTrack.style.transform = `translateX(-${trackX}px)`;

            if (trackX >= maxScroll && scrollingDown) {
                horizontalDone = true;
                pinnedY = null;
            }
            if (trackX <= 0 && !scrollingDown) {
                horizontalDone = false;
                pinnedY = null;
            }
        }
    }, { passive: false });

});