document.querySelectorAll('.projectPhoto').forEach(photo => {
    const imgs = photo.querySelectorAll('.projImg');
    let current = 0;

    imgs.forEach((img, i) => img.style.display = i === 0 ? 'block' : 'none');

    photo.querySelector('.prev')?.addEventListener('click', () => {
        imgs[current].style.display = 'none';
        current = (current - 1 + imgs.length) % imgs.length;
        imgs[current].style.display = 'block';
    });

    photo.querySelector('.next')?.addEventListener('click', () => {
        imgs[current].style.display = 'none';
        current = (current + 1) % imgs.length;
        imgs[current].style.display = 'block';
    });
});