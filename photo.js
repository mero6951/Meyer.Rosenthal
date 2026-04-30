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

function buildMasonry(grid) {
    setTimeout(() => {
        const imgs = Array.from(grid.querySelectorAll('.img'));
        const gridWidth = grid.offsetWidth;
        if (!gridWidth) return;

        const COLS = parseInt(grid.dataset.cols) || 3;

        grid.style.columns = 'unset';
        grid.style.display = 'block';

        const colWidth = (gridWidth - GAP * (COLS - 1)) / COLS;
        const colHeights = Array(COLS).fill(0);
        const colLastImg = Array(COLS).fill(null);

        grid.style.position = 'relative';

        function shortestCol() {
            return colHeights.indexOf(Math.min(...colHeights));
        }

        function placeWide(img, span) {
            const natural = img.naturalWidth / img.naturalHeight;
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

            img.style.position = 'absolute';
            img.style.width = width + 'px';
            img.style.height = height + 'px';
            img.style.left = left + 'px';
            img.style.top = top + 'px';
            img.style.borderRadius = '4px';
            img.style.cursor = 'pointer';

            affectedCols.forEach(c => {
                colHeights[c] = top + height + GAP;
                colLastImg[c] = img;
            });
        }

        function placeImage(img) {
            const natural = img.naturalWidth / img.naturalHeight;

            // forced spans via id
            if (img.id === 'a') return placeWide(img, 2);
            if (img.id === 'b') return placeWide(img, 3);

            // natural panoramic
            if (natural >= WIDE_RATIO && COLS > 1) return placeWide(img, 2);

            // standard single column
            const col = shortestCol();
            const top = colHeights[col];
            const left = col * (colWidth + GAP);
            const height = colWidth / natural;

            img.style.position = 'absolute';
            img.style.width = colWidth + 'px';
            img.style.height = height + 'px';
            img.style.left = left + 'px';
            img.style.top = top + 'px';
            img.style.borderRadius = '4px';
            img.style.cursor = 'pointer';

            colHeights[col] = top + height + GAP;
            colLastImg[col] = img;
        }

        function equalizeBottoms() {
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
            colHeights.fill(0);
            colLastImg.fill(null);
            imgs.forEach(placeImage);
            equalizeBottoms();
            grid.style.height = Math.max(...colHeights) + 'px';
        }

        let loaded = 0;
        imgs.forEach(img => {
            if (img.complete && img.naturalWidth) {
                loaded++;
                if (loaded === imgs.length) run();
            } else {
                img.addEventListener('load', () => {
                    loaded++;
                    if (loaded === imgs.length) run();
                });
            }
        });

        imgs.forEach(img => {
            img.addEventListener('click', () => {
                overlayImg.src = img.src;
                overlay.classList.add('active');
            });
        });

    }, 100);
}

document.querySelectorAll('.photos').forEach(buildMasonry);

window.addEventListener('resize', () => {
    document.querySelectorAll('.photos').forEach(buildMasonry);
});