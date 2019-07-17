(function () {
    const s = document.createElement('script');
    s.setAttribute('src', 'http://localhost:8000/dependencies/all.js');
    s.setAttribute('async', 'true');
    s.onload = function () {
        loadStyles()
    };
    document.body.appendChild(s);

    function loadStyles() {
        const styles = document.createElement('link');
        styles.setAttribute('rel', 'stylesheet');
        styles.setAttribute('href', 'http://localhost:8000/css/index.css');
        styles.onload = function () {
            const container = document.createElement('div');
            container.setAttribute('class', 'mesh__container');
            container.innerHTML += popupTemplate;
            document.body.appendChild(container)
            init();
        }
        document.head.appendChild(styles)
    }

    function init() {
        $('#mesh__avatar').on('click', function () {
            $('#mesh__popup').toggleClass('mesh__popup--collapsed')
        })
    }


    const popupTemplate = `
    <div id="mesh__popup" class="mesh__popup">
    <div class="mesh__popup-header fluid">
        <h1>
            mesh.
        </h1>
    </div>
    <div class="mesh__popup-main">
    </div>
    <div class="mesh__popup-footer">
        <div id="mesh__avatar" class="mesh__avatar"></div>
    </div>
    </div>
`

})();
