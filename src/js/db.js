(function() {

    window.db = {};

    window.db.get_or_create = function(callback) {
        var request;
        request = indexedDB.open('graph_immutables', 2);
        request.onupgradeneeded = function() {
            /* called whenever the DB changes version. triggers when the DB is created
            */
            var db, store;
            db = request.result;
            store = db.createObjectStore('graph', {
                keyPath: 'id'
            });
            /* initial fake data
            */
            store.put({
                id: 0,
                data: {
                    nodes: [
                        {
                            id: 'A',
                            x: 469,
                            y: 410,
                            type: 'X',
                            editable: false
                        }, {
                            id: 'B',
                            x: 493,
                            y: 364,
                            type: 'X',
                            editable: false
                        }, {
                            id: 'C',
                            x: 442,
                            y: 365,
                            type: 'X',
                            editable: false
                        }, {
                            id: 'D',
                            x: 467,
                            y: 314,
                            type: 'X',
                            editable: false
                        }, {
                            id: 'E',
                            x: 477,
                            y: 248,
                            type: 'Y',
                            editable: true
                        }, {
                            id: 'F',
                            x: 425,
                            y: 207,
                            type: 'Y',
                            editable: false
                        }, {
                            id: 'G',
                            x: 402,
                            y: 155,
                            type: 'Y',
                            editable: false
                        }, {
                            id: 'H',
                            x: 369,
                            y: 196,
                            type: 'Y',
                            editable: false
                        }, {
                            id: 'I',
                            x: 350,
                            y: 148,
                            type: 'Z',
                            editable: false
                        }, {
                            id: 'J',
                            x: 539,
                            y: 222,
                            type: 'Z',
                            editable: false
                        }, {
                            id: 'K',
                            x: 594,
                            y: 235,
                            type: 'Z',
                            editable: false
                        }, {
                            id: 'L',
                            x: 582,
                            y: 185,
                            type: 'Z',
                            editable: false
                        }, {
                            id: 'M',
                            x: 633,
                            y: 200,
                            type: 'Z',
                            editable: false
                        }
                    ],
                    links: [
                        {
                            source: 'A',
                            target: 'B',
                            editable: false
                        }, {
                            source: 'B',
                            target: 'C',
                            editable: true
                        }, {
                            source: 'C',
                            target: 'A',
                            editable: false
                        }, {
                            source: 'B',
                            target: 'D',
                            editable: false
                        }, {
                            source: 'D',
                            target: 'C',
                            editable: false
                        }, {
                            source: 'D',
                            target: 'E',
                            editable: true
                        }, {
                            source: 'E',
                            target: 'F',
                            editable: true
                        }, {
                            source: 'F',
                            target: 'G',
                            editable: false
                        }, {
                            source: 'F',
                            target: 'H',
                            editable: false
                        }, {
                            source: 'G',
                            target: 'H',
                            editable: true
                        }, {
                            source: 'G',
                            target: 'I',
                            editable: false
                        }, {
                            source: 'H',
                            target: 'I',
                            editable: false
                        }, {
                            source: 'J',
                            target: 'E',
                            editable: true
                        }, {
                            source: 'J',
                            target: 'L',
                            editable: false
                        }, {
                            source: 'J',
                            target: 'K',
                            editable: false
                        }, {
                            source: 'K',
                            target: 'L',
                            editable: true
                        }, {
                            source: 'L',
                            target: 'M',
                            editable: false
                        }, {
                            source: 'M',
                            target: 'K',
                            editable: false
                        }
                    ],
                    last_index: 0
                }
            });
            return console.log('Database created or upgraded.');
        };
        return request.onsuccess = function() {
            /* called when the connection with the DB is opened successfully
            */
            var cursorRequest, db, keyRange, store, tx;
            db = request.result;
            console.log('Database connection opened.');
            /* open a transaction
            */
            tx = db.transaction('graph', 'readwrite');
            store = tx.objectStore('graph');
            /* get everything in the store
            */
            keyRange = IDBKeyRange.lowerBound(0);
            cursorRequest = store.openCursor(keyRange);
            cursorRequest.onsuccess = function(e) {
                /* called when the cursor request succeeds
                */
                var result;
                result = e.target.result;
                if (!(result != null)) return;
                /* pass the result to the caller's callback
                */
                callback(result.value.data);
                return result["continue"]();
            };
            tx.oncomplete = function() {
                /* called when the transaction ends
                */        return console.log('Transaction complete.');
            };
            /* close the connection to the DB
            */
            return db.close();
        };
    };

    window.db.store = function(graph) {
        var request;
        request = indexedDB.open('graph_immutables', 2);
        return request.onsuccess = function() {
            /* called when the connection with the DB is opened successfully
            */
            var db, store, tx;
            db = request.result;
            console.log('Database connection opened.');
            /* open a transaction
            */
            tx = db.transaction('graph', 'readwrite');
            store = tx.objectStore('graph');
            /* store the given graph
            */
            store.put({
                id: 0,
                data: graph
            });
            tx.oncomplete = function() {
                /* called when the transaction ends
                */        return console.log('Transaction complete.');
            };
            /* close the connection to the DB
            */
            return db.close();
        };
    };

}).call(this);
