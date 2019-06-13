(function () {

    window.addEventListener('offline', () => {
        const netConnection = document.querySelector('#net-connection');
        netConnection.innerHTML = 'OFF LINE';
        netConnection.classList.add('net-connection--off')
    });

    window.addEventListener('online', () => {
        const netConnection = document.querySelector('#net-connection');
        netConnection.innerHTML = 'ON LINE';
        netConnection.classList.remove('net-connection--off')
    });

    const layoutWidth = 900;
    const layoutHeight = 600;
    const userID = new IDGenerator().generate();

    window.main = (function () {
        /* get data from the DB
        */
        return db.get_graph(function (graph) {
            /* create the SVG
            */
            const svg = d3.select('body').append('svg').attr('width', layoutWidth).attr('height', layoutHeight).attr('class', 'graph-area');
            /* TOOLBAR */
            const toolbar = $(".toolbar");
            const library = $(".library");

            import('./graph.js')
                .then(module => {
                    const dThreeGraph = new module.Graph(graph, userID);
                    dThreeGraph.initLayout(svg, layoutWidth, layoutHeight);
                    dThreeGraph.initToolBar(toolbar, library);
                    dThreeGraph.objectify(dTheeGraph.data)
                    dThreeGraph.update();
                    dThreeGraph.drag.on('dragstart', function (d) {
                        const newGraph = dThreeGraph.serialize();
                        // Specify editable node if user online
                        // if (navigator.onLine) {
                        //     newGraph.nodes = newGraph.nodes.map(node => {
                        //         if (node.id === d.id) {
                        //             node.editableBy = global.userID;
                        //         }
                        //         return node;
                        //     })
                        //     db.store_graph(newGraph, false);
                        // }
                        return d.fixed = true;
                    }).on('dragend', function () {
                        const newGraph = dThreeGraph.serialize();
                        // newGraph.nodes = newGraph.nodes.map(node => {
                        //     if (node.editableBy === global.userID) {
                        //         delete node.editableBy;
                        //     }
                        //     return node;
                        // })
                        return db.store_graph(newGraph);
                    });


                    dThreeGraph.eventsEmitter.subscribe('event:add-node', data => {
                        db.store_graph(dTheeGraph.serialize());
                    });

                    dThreeGraph.eventsEmitter.subscribe('event:add-link', data => {
                        db.store_graph(dTheeGraph.serialize());
                    });

                    d3.select(window).on('keydown', function () {
                        const key = d3.event.keyCode;
                        if (key === 8 || key === 46) {
                            if (dThreeGraph.selection != null) {
                                dThreeGraph.removeItem(dThreeGraph.selection);
                                return db.store_graph(dThreeGraph.serialize());
                            }
                        }
                    });

                    db.on_gun_update((newData) => {
                        dThreeGraph.objectify(newData);
                        dThreeGraph.data.nodes = newData.nodes;
                        dThreeGraph.data.links = newData.links;
                        dThreeGraph.data.last_index = newData.last_index;
                        dThreeGraph.update();
                    })
                })

        });
    });

}).call(this);
