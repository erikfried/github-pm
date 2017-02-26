if (location.href.indexOf('projects') > 0) {
    console.log('PROJECT');
    var hideOpenedBy = function(event) {
        console.log('load');
        const els = document.querySelectorAll('.project-card small');
        console.log('ELS', els);
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
