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
            last_index: 0
        }
    }

    window.db = {};
    const gun = Gun(['http://localhost:8765/gun', 'https://gunjs.herokuapp.com/gun']);
    window.gun = gun;
    const user = gun.user();
    window.user = user;

    user.auth('artyom88', 'artyom88');

    window.db.get_graph = function (callback, update) {

        gun.on('auth', function () {
            const gunData = user.get('graph')
            if (gunData) {
                gunData.once(getDataSuccess)
                return;
            }
            callback(initGraphData.data);
        });

        function getDataSuccess(value) {
            if (value) {
                callback(initGraphData.data);
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
        const gunData = user.get('graph')
        if (gunData) {
            gunData.on(getDataSuccess)
        }
        function getDataSuccess(value) {
            if (value) {
                callback({...value});
            }
        }
    }

    // window.db.get_or_create = function (callback) {
    //     var request;
    //     request = indexedDB.open('graph_immutables', 2);
    //     request.onupgradeneeded = function() {
    //         debugger;
    //         /* called whenever the DB changes version. triggers when the DB is created
    //         */
    //         var db, store;
    //         db = request.result;
    //         store = db.createObjectStore('graph', {
    //             keyPath: 'id'
    //         });
    //         /* initial fake data
    //         */
    //         store.put(initGraphData);
    //         return console.log('Database created or upgraded.');
    //     };
    //     return request.onsuccess = function() {
    //         debugger;
    //         /* called when the connection with the DB is opened successfully
    //         */
    //         var cursorRequest, db, keyRange, store, tx;
    //         db = request.result;
    //         console.log('Database connection opened.');
    //         /* open a transaction
    //         */
    //         tx = db.transaction('graph', 'readwrite');
    //         store = tx.objectStore('graph');
    //         /* get everything in the store
    //         */
    //         keyRange = IDBKeyRange.lowerBound(0);
    //         cursorRequest = store.openCursor(keyRange);
    //         cursorRequest.onsuccess = function(e) {
    //             /* called when the cursor request succeeds
    //             */
    //             var result;
    //             result = e.target.result;
    //             if (!(result != null)) return;
    //             /* pass the result to the caller's callback
    //             */
    //             console.log(222, result.value.data)
    //             callback(result.value.data);
    //             return result["continue"]();
    //         };
    //         tx.oncomplete = function() {
    //             /* called when the transaction ends
    //             */        return console.log('Transaction complete.');
    //         };
    //         /* close the connection to the DB
    //         */
    //         return db.close();
    //     };
    // }

    // window.db.store = function(graph) {
    //     var request;
    //     request = indexedDB.open('graph_immutables', 2);
    //     return request.onsuccess = function() {
    //         /* called when the connection with the DB is opened successfully
    //         */
    //         var db, store, tx;
    //         db = request.result;
    //         console.log('Database connection opened.');
    //         /* open a transaction
    //         */
    //         tx = db.transaction('graph', 'readwrite');
    //         store = tx.objectStore('graph');
    //         /* store the given graph
    //         */
    //         store.put({
    //             id: 0,
    //             data: graph
    //         });
    //         tx.oncomplete = function() {
    //             /* called when the transaction ends
    //             */        return console.log('Transaction complete.');
    //         };
    //         /* close the connection to the DB
    //         */
    //         return db.close();
    //     };
    // };

}).call(this);
