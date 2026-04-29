const overlay = document.createElement('div');
overlay.classList.add('overlay');
const overlayImg = document.createElement('img');
overlay.appendChild(overlayImg);
document.body.appendChild(overlay);

document.querySelectorAll('.img').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
        overlayImg.src = img.src;
        overlay.classList.add('active');
    });
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
    }
});