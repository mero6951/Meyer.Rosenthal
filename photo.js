// ── OVERLAY ──────────────────────────────────────────────────────────
const overlay = document.createElement('div');
overlay.classList.add('overlay');
const overlayImg = document.createElement('img');
overlay.appendChild(overlayImg);
document.body.appendChild(overlay);

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
});

// ── MASONRY ──────────────────────────────────────────────────────────
const GAP = 15;
const WIDE_RATIO = 2.2;
const LOAD_TIMEOUT = 4000;

function buildMasonry(grid) {
    const imgs = Array.from(grid.querySelectorAll('.img'));
    if (!imgs.length) return;

    grid.style.columns = 'unset';
    grid.style.display = 'block';
    grid.style.position = 'relative';

    const COLS = parseInt(grid.dataset.cols) || 3;

    imgs.forEach(img => {
        img.style.position = 'absolute';
        img.style.width = '1px';
        img.style.height = '1px';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });

    function shortestCol(colHeights) {
        return colHeights.indexOf(Math.min(...colHeights));
    }

    function placeWide(img, span, colWidth, colHeights, colLastImg) {
        const natural = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 1.5;
        const capped = Math.min(span, COLS);

        let bestLeft;
        if (capped >= COLS) {
            bestLeft = 0;
        } else {
            const leftScore = Math.max(colHeights[0], colHeights[1]);
            const rightScore = COLS === 3
                ? Math.max(colHeights[1], colHeights[2])
                : leftScore;
            bestLeft = (rightScore < leftScore - 50) ? (COLS === 3 ? 1 : 0) : 0;
        }

        const affectedCols = Array.from({ length: capped }, (_, i) => bestLeft + i);
        const top = Math.max(...affectedCols.map(c => colHeights[c]));
        const left = bestLeft * (colWidth + GAP);
        const width = colWidth * capped + GAP * (capped - 1);
        const height = width / natural;

        img.style.width = width + 'px';
        img.style.height = height + 'px';
        img.style.left = left + 'px';
        img.style.top = top + 'px';
        img.style.borderRadius = '4px';
        img.style.cursor = 'pointer';
        img.style.opacity = '1';

        affectedCols.forEach(c => {
            colHeights[c] = top + height + GAP;
            colLastImg[c] = img;
        });
    }

    function placeImage(img, colWidth, colHeights, colLastImg) {
        const natural = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 1.5;

        if (img.id === 'a') return placeWide(img, 2, colWidth, colHeights, colLastImg);
        if (img.id === 'b') return placeWide(img, 3, colWidth, colHeights, colLastImg);
        if (natural >= WIDE_RATIO && COLS > 1) return placeWide(img, 2, colWidth, colHeights, colLastImg);

        const col = shortestCol(colHeights);
        const top = colHeights[col];
        const left = col * (colWidth + GAP);
        const height = colWidth / natural;

        img.style.width = colWidth + 'px';
        img.style.height = height + 'px';
        img.style.left = left + 'px';
        img.style.top = top + 'px';
        img.style.borderRadius = '4px';
        img.style.cursor = 'pointer';
        img.style.opacity = '1';

        colHeights[col] = top + height + GAP;
        colLastImg[col] = img;
    }

    function equalizeBottoms(colHeights, colLastImg) {
        const maxHeight = Math.max(...colHeights);
        colLastImg.forEach((img, col) => {
            if (!img) return;
            const diff = maxHeight - colHeights[col];
            if (diff > 0 && diff < 200) {
                const currentH = parseFloat(img.style.height);
                img.style.height = (currentH + diff) + 'px';
                img.style.objectFit = 'cover';
                colHeights[col] = maxHeight;
            }
        });
    }

    function run() {
        const gridWidth = grid.offsetWidth;
        if (!gridWidth) return;
        const colWidth = (gridWidth - GAP * (COLS - 1)) / COLS;
        const colHeights = Array(COLS).fill(0);
        const colLastImg = Array(COLS).fill(null);

        imgs.forEach(img => placeImage(img, colWidth, colHeights, colLastImg));
        equalizeBottoms(colHeights, colLastImg);
        grid.style.height = Math.max(...colHeights) + 'px';
    }

    grid._masonryRun = run;

    let settled = 0;
    let ran = false;

    function onImgSettled() {
        settled++;
        if (settled === imgs.length && !ran) {
            ran = true;
            run();
        }
    }

    imgs.forEach(img => {
        if (img.complete && img.naturalWidth) {
            onImgSettled();
        } else {
            img.addEventListener('load', onImgSettled, { once: true });
            img.addEventListener('error', onImgSettled, { once: true });
        }
    });

    setTimeout(() => {
        if (!ran) {
            ran = true;
            run();
        }
    }, LOAD_TIMEOUT);

    imgs.forEach(img => {
        img.addEventListener('click', () => {
            overlayImg.src = img.src;
            overlay.classList.add('active');
        });
    });
}

const gridObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            buildMasonry(entry.target);
            obs.unobserve(entry.target);
        }
    });
}, { rootMargin: '800px 0px' });

document.querySelectorAll('.photos').forEach(grid => gridObserver.observe(grid));

window.addEventListener('resize', () => {
    document.querySelectorAll('.photos').forEach(grid => {
        if (grid._masonryRun) grid._masonryRun();
    });
});