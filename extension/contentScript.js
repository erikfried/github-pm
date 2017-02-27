if (location.href.indexOf('projects') > 0) {
    var hideOpenedBy = function(event) {
        const els = document.querySelectorAll('.project-card small');
        console.log('hiding elements', els);
        els.forEach(el => {
            el.classList.remove('d-block');
            el.style.display = 'none';
        });
    };
    const to = window.setTimeout(hideOpenedBy, 500);
    document.addEventListener("load", () => {
        window.clearTimeout(to);
        hideOpenedBy
    });

}
