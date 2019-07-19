(function () {
    const s = document.createElement('script');
    s.setAttribute('src', 'http://localhost:8000/dist/script.js');
    s.setAttribute('async', 'true');
    s.onload = function () {
        loadStyles(loadTemplate)
    };
    document.body.appendChild(s);

    function loadStyles(callback) {
        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', 'http://localhost:8000/dist/css/index.css');
        styles.onload = function () {
            callback();
        };
        document.head.appendChild(styles);
    }

    function loadTemplate() {
        const container = document.createElement('div');
        container.setAttribute('class', 'mesh__container');
        fetch("http://localhost:8000/dist/index.html" /*, options */)
            .then((response) => response.text())
            .then((html) => {
                container.innerHTML += html;
                document.body.appendChild(container);
                new PopupComponent(document.getElementById('mesh-popup-component'))
            })
            .catch((error) => {
                console.warn(error);
            });
    }

})();
