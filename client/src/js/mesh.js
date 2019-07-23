(function () {
    const dependensies = [
        {
            src: 'http://localhost:8000/js/d3.v3.min.js',
            loaded: false,
        },
        {
            src: '//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js',
            loaded: false,
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/gun/gun.js',
            loaded: false,
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/gun/sea.js',
            loaded: false,
        },
        {
            src: 'https://cdn.jsdelivr.net/npm/gun/lib/webrtc.js',
            loaded: false,
        },
        {
            src: 'http://localhost:8000/js/utils.js',
            loaded: false,
        }

    ];

    dependensies.forEach((item, index) => {
        const s = document.createElement('script');
        s.setAttribute('src', item.src);
        s.setAttribute('async', 'true');
        s.onload = function() {
            dependensies[index].loaded = true;
            if (dependensies.filter(d => d.loaded).length === dependensies.length) {
                loadStyles()
            }
        };
        document.body.appendChild(s);
    })

    function loadStyles() {
        const styles = document.createElement('link');
        styles.setAttribute('rel','stylesheet');
        styles.setAttribute('href','http://localhost:8000/css/index.css');
        styles.onload = function () {
            const container = document.createElement('div');
            container.setAttribute('class', 'mesh__container');
            container.innerHTML += '<div class="mesh__popup"><p>Some text that should be appended...</p></div>';
            document.body.appendChild(container)
        }
        document.head.appendChild(styles)
    }
})()