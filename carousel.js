const overlay = document.createElement('div');
overlay.classList.add('overlay');
const overlayImg = document.createElement('img');
const overlayPrev = document.createElement('button');
overlayPrev.classList.add('prev', 'overlayNav');
overlayPrev.innerHTML = '&#8592;';
const overlayNext = document.createElement('button');
overlayNext.classList.add('next', 'overlayNav');
overlayNext.innerHTML = '&#8594;';
overlay.appendChild(overlayPrev);
overlay.appendChild(overlayImg);
overlay.appendChild(overlayNext);
document.body.appendChild(overlay);

let activeGroup = null;

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('active');
        activeGroup = null;
    }
});

document.querySelectorAll('.projectPhoto').forEach(photo => {
    const imgs = photo.querySelectorAll('.projImg');
    const group = { imgs, current: 0 };

    imgs.forEach((img, i) => img.style.display = i === 0 ? 'block' : 'none');

    function show(index) {
        imgs[group.current].style.display = 'none';
        group.current = (index + imgs.length) % imgs.length;
        imgs[group.current].style.display = 'block';
        if (activeGroup === group) {
            overlayImg.src = imgs[group.current].src;
        }
    }

    photo.querySelector('.prev')?.addEventListener('click', () => {
        show(group.current - 1);
    });

    photo.querySelector('.next')?.addEventListener('click', () => {
        show(group.current + 1);
    });

    imgs.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            activeGroup = group;
            overlayImg.src = img.src;
            overlay.classList.add('active');
        });
    });
});

overlayPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeGroup) {
        activeGroup.current = (activeGroup.current - 1 + activeGroup.imgs.length) % activeGroup.imgs.length;
        activeGroup.imgs.forEach((img, i) => img.style.display = i === activeGroup.current ? 'block' : 'none');
        overlayImg.src = activeGroup.imgs[activeGroup.current].src;
    }
});

overlayNext.addEventListener('click', (e) => {
    e.stopPropagation();
    if (activeGroup) {
        activeGroup.current = (activeGroup.current + 1) % activeGroup.imgs.length;
        activeGroup.imgs.forEach((img, i) => img.style.display = i === activeGroup.current ? 'block' : 'none');
        overlayImg.src = activeGroup.imgs[activeGroup.current].src;
    }
});