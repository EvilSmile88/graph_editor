(function () {

    const initGraphData = {
        id: 0,
        data: {
            nodes: [
                {
                    id: '1',
                    x: 493,
                    y: 364,
                    type: 'X',
                    editable: true
                }, {
                    id: '2',
                    x: 442,
                    y: 365,
                    type: 'X',
                    editable: false
                }, {
                    id: '3',
                    x: 467,
                    y: 314,
                    type: 'X',
                    editable: false
                },
            ],
            links: [
                {
                    source: '1',
                    target: '2',
                    editable: true
                }, {
                    source: '1',
                    target: '3',
                    editable: false
                }
            ],
            last_index: 4
        }
    }

    window.db = {};
    const gun = Gun(['http://localhost:8765/gun', 'https://gunjs.herokuapp.com/gun']);
    const user = gun.user();

    user.auth('artyom88', 'artyom88');

    window.db.get_graph = function (callback, update) {

        gun.on('auth', function () {
            const gunData = user.get('graph');
            if (gunData) {
                gunData.once(getDataSuccess);
                return;
            }
            callback(initGraphData.data);
        });

        function getDataSuccess(value) {
            if (value) {
                callback({...value});
                return;
            }
            callback(initGraphData.data);
        }
    };

    window.db.store_graph = function (graph) {
        if (!user.is) {
            return
        }
        user.get('graph').put(JSON.stringify(graph));
    }

    window.db.on_gun_update = function (callback) {
        const gunData = user.get('graph');
        if (gunData) {
            gunData.on(getDataSuccess)
        }
        function getDataSuccess(value) {
            if (value) {
                callback({...value});
            }
        }
    }

}).call(this);
