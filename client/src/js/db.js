(function () {

    window.db = {};
    const gun = Gun(['http://localhost:8765/gun', 'https://gunjs.herokuapp.com/gun']);
    const user = gun.user();
    const gunUserName = 'artyom88';
    // Login to test account;
    user.auth(gunUserName, 'artyom88');

    window.db.get_graph = function (callback, update) {

        gun.on('auth', function () {
            const gunData = user.get('graph');
            if (gunData) {
                gunData.once((value) => {
                    if (value) {
                        callback({...value});
                        return;
                    }
                    callback(initGraphData.data);
                });
                return;
            }
            callback(initGraphData.data);
        });
    };

    window.db.store_graph = function (graph, storeToDB = true) {
        if (!user.is) {
            return
        }
        graph = {...graph, user: gunUserName};
        user.get('graph').put(JSON.stringify(graph));
        if (navigator.onLine && storeToDB) {
            fetch(env.API_URL + 'graph', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(graph)
            })
                .then(function (response) {
                })
                .catch(error => {
                    console.log(error)
                });
        }
    };

    window.db.remove_nodes = function (graph, storeToDB = true, nodes) {
        if (!user.is) {
            return
        }
        graph = {...graph, user: gunUserName};
        user.get('graph').put(JSON.stringify(graph));
        if (navigator.onLine && storeToDB) {
            debugger;
            fetch(env.API_URL + 'graphNodes', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "DELETE",
                body: JSON.stringify(nodes)
            })
                .then(function (response) {
                })
                .catch(error => {
                    console.log(error)
                });
        }
    };

    window.db.on_gun_update = function (callback) {
        const gunData = user.get('graph');
        if (gunData) {
            gunData.on((value) => {
                if (value) {
                    callback({...value});
                }
            })
        }
    }

}).call(this);


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