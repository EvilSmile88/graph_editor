(function () {

    window.addEventListener('offline', () => {
        const netConnection = document.querySelector('#net-connection');
        netConnection.innerHTML = 'OFF LINE';
        netConnection.classList.add('net-connection--off')
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
                    dThreeGraph.objectify(dThreeGraph.data)
                    dThreeGraph.update();
                    db.api_graph_force_update(dThreeGraph.serialize())
                        .then(function (response) {
                            console.log(333, response)
                        })
                        .catch(error => {
                            console.log(error)
                        });

                    window.addEventListener('online', () => {
                        const netConnection = document.querySelector('#net-connection');
                        netConnection.innerHTML = 'ON LINE';
                        netConnection.classList.remove('net-connection--off');
                        db.api_graph_force_update(dThreeGraph.serialize())
                            .then(function (response) {
                                console.log(333, response)
                            })
                            .catch(error => {
                                console.log(error)
                            });
                    });

                    // dThreeGraph.drag.on('dragstart', function (d) {
                    //     const newGraph = dThreeGraph.serialize();
                    //     // Specify editable node if user online
                    //     // if (navigator.onLine) {
                    //     //     newGraph.nodes = newGraph.nodes.map(node => {
                    //     //         if (node.id === d.id) {
                    //     //             node.editableBy = global.userID;
                    //     //         }
                    //     //         return node;
                    //     //     })
                    //     //     db.store_graph(newGraph, false);
                    //     // }
                    //     return d.fixed = true;
                    // }).on('dragend', function () {
                    //     const newGraph = dThreeGraph.serialize();
                    //     // newGraph.nodes = newGraph.nodes.map(node => {
                    //     //     if (node.editableBy === global.userID) {
                    //     //         delete node.editableBy;
                    //     //     }
                    //     //     return node;
                    //     // })
                    //     return db.store_graph(newGraph);
                    // });

                    dThreeGraph.eventsEmitter.subscribe('event:drag-node-end', node => {
                        db.store_graph(dThreeGraph.serialize());
                        if (navigator.onLine) {
                            db.api_update_node(node)
                                .then(function (response) {
                                    console.log(333, response)
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    });

                    dThreeGraph.eventsEmitter.subscribe('event:add-node', node => {
                        db.store_graph(dThreeGraph.serialize());
                        if (navigator.onLine) {
                            db.api_add_node(node)
                                .then(function (response) {
                                    console.log(response)
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    });

                    dThreeGraph.eventsEmitter.subscribe('event:add-link', link => {
                        db.store_graph(dThreeGraph.serialize());
                        if (navigator.onLine) {
                            db.api_add_link(link)
                                .then(function (response) {
                                    console.log(response)
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    });

                    dThreeGraph.eventsEmitter.subscribe('event:start-edit-node-label', editNode => {
                        const modal = $("#edit-node-modal");
                        const input = modal.find("#node-label");
                        modal.css('display', 'flex');
                        input.val(editNode.label || editNode.id);

                        const onEscape = function (event) {
                            if ((event.code && event.code.toLowerCase() === 'escape') || event.keyCode === 27) {
                                input.val('');
                                modal.css('display', 'none');
                                removeEventListener("keydown", onEscape)
                            }
                        };

                        const onFormSubmit = function (event) {
                            event.preventDefault();
                            const updatedNode = {
                                ...dThreeGraph.selection,
                                label: event.target.elements['node-label'].value
                            }
                            dThreeGraph.updateNodeLabel(updatedNode);
                            modal.css('display', 'none');
                            return;
                        };

                        window.addEventListener("keydown", onEscape);
                        modal.find('form').on("submit", onFormSubmit);
                        return;
                    });


                    dThreeGraph.eventsEmitter.subscribe('event:end-edit-node-label', node => {
                        db.store_graph(dThreeGraph.serialize());
                        if (navigator.onLine) {
                            db.api_update_node(node)
                                .then(function (response) {
                                    console.log(333, response)
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    });

                    d3.select(window).on('keydown', function () {
                        const key = d3.event.keyCode;
                        if (key === 8 || key === 46) {
                            if (dThreeGraph.selection != null && dThreeGraph.tool === 'pointer') {
                                dThreeGraph.removeItem(dThreeGraph.selection);
                                return;
                            }
                        }
                    });

                    dThreeGraph.eventsEmitter.subscribe('event:remove-nodes', (data) => {
                        db.store_graph(dThreeGraph.serialize());
                        if (navigator.onLine) {
                            db.api_delete_nodes(data.removedNodes)
                                .then(function (response) {
                                    console.log(response)
                                })
                                .catch(error => {
                                    console.log(error)
                                });
                        }
                    });

                    dThreeGraph.eventsEmitter.subscribe('event:remove-links', removedLinks => {
                        db.store_graph(dThreeGraph.serialize());
                        removedLinks = removedLinks.map(item => {
                            item.source = item.source.id;
                            item.target = item.target.id;
                            return item;
                        })
                        if (navigator.onLine) {
                            db.api_delete_links(removedLinks)
                                .then(function (response) {
                                    console.log(response)
                                })
                                .catch(error => {
                                    console.log(error)
                                });
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
