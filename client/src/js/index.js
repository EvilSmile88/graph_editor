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


    var drag_add_link, global, height, update, width,
        __indexOf = Array.prototype.indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    width = 900;

    height = 600;

    window.global = global;
    /* SELECTION - store the selected node
    */

    /* EDITING - store the drag mode (either 'drag' or 'add_link')
    */

    global = {
        selection: null,
        userID: new IDGenerator().generate()
    };

    window.main = (function () {
        /* get data from the DB
        */
        return db.get_graph(function (graph) {
            var container, library, svg, toolbar;
            global.graph = graph;

            global.graph.serialize = function () {
                /* PERSISTENCE - return a copy of the graph, with redundancies (whole nodes in links pointers) removed. also include the last_index property, to persist it also
                */
                var l;
                return {
                    nodes: global.graph.nodes,
                    links: (function () {
                        var _i, _len, _ref, _results;
                        _ref = graph.links;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            l = _ref[_i];
                            _results.push({
                                source: l.source.id,
                                target: l.target.id,
                                editable: l.editable
                            });
                        }
                        return _results;
                    })(),
                    last_index: global.graph.last_index
                };
            };

            global.graph.objectify = function (graph) {
                /* resolve node IDs (not optimized at all!)
                */
                var l, n, _i, _len, _ref, _results;
                _ref = graph.links;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    l = _ref[_i];
                    _results.push((function () {
                        var _j, _len2, _ref2, _results2;
                        _ref2 = graph.nodes;
                        _results2 = [];
                        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
                            n = _ref2[_j];
                            if (l.source === n.id) {
                                l.source = n;
                                continue;
                            }
                            if (l.target === n.id) {
                                l.target = n;
                                continue;
                            } else {
                                _results2.push(void 0);
                            }
                        }
                        return _results2;
                    })());
                }
                return _results;
            };


            /* create the SVG
            */
            svg = d3.select('body').append('svg').attr('width', width).attr('height', height).attr('class', 'graph-area');
            /* ZOOM and PAN
            */
            /* create container elements
            */
            container = svg.append('g');

            container.call(d3.behavior.zoom().scaleExtent([0.5, 8]).on('zoom', (function () {
                return global.vis.attr('transform', "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            })));
            global.vis = container.append('g');
            /* create a rectangular overlay to catch events
            */
            /* WARNING rect size is huge but not infinite. this is a dirty hack
            */
            global.vis.append('rect').attr('class', 'overlay').attr('x', -500000).attr('y', -500000).attr('width', 1000000).attr('height', 1000000).on('click', (function (d) {
                /* SELECTION
                */
                global.selection = null;
                d3.selectAll('.node').classed('selected', false);
                return d3.selectAll('.link').classed('selected', false);
            }));
            /* END ZOOM and PAN
            */
            global.colorify = d3.scale.category10();
            /* initialize the force layout
            */
            global.force = d3.layout.force().size([width, height]).charge(-400).linkDistance(60).on('tick', (function () {
                /* update nodes and links
                */
                global.vis.selectAll('.node').attr('transform', function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
                return global.vis.selectAll('.link').attr('x1', function (d) {
                    return d.source.x;
                }).attr('y1', function (d) {
                    return d.source.y;
                }).attr('x2', function (d) {
                    return d.target.x;
                }).attr('y2', function (d) {
                    return d.target.y;
                });
            }));
            /* DRAG
            */
            global.drag = global.force.drag().on('dragstart', function (d) {
                const newGraph = global.graph.serialize();
                // Specify editable node if user online
                if (navigator.onLine) {
                    newGraph.nodes = newGraph.nodes.map(node => {
                        if (node.id === d.id) {
                            node.editableBy = global.userID;
                        }
                        return node;
                    })
                    db.store_graph(newGraph, false);
                }
                return d.fixed = true;
            }).on('dragend', function () {
                const newGraph = global.graph.serialize();
                newGraph.nodes = newGraph.nodes.map(node => {
                    if (node.editableBy === global.userID) {
                        delete node.editableBy;
                    }
                    return node;
                })
                return db.store_graph(newGraph);
            });

            global.graph.objectify(global.graph);
            update();

            db.on_gun_update(rerender)

            function rerender(graph) {
                const editingNode = graph.nodes.find(node => node.editableBy);
                if (!editingNode || (editingNode && editingNode.editableBy !== global.userID)) {
                    global.graph.objectify(graph);
                    global.graph.nodes = graph.nodes;
                    global.graph.links = graph.links;
                    global.graph.last_index = graph.last_index;
                    update();
                }
            }


            /* DELETION - pressing DEL deletes the selection
    */
            d3.select(window).on('keydown', function () {
                const key = d3.event.keyCode;
                if (key === 8 || key === 46) {
                    if (global.selection != null) {
                        global.graph.remove(global.selection);
                        global.selection = null;
                        update();
                        return db.store_graph(global.graph.serialize());
                    }
                }
            });


            global.graph.remove = function (condemned) {
                if (!condemned.editable) return;
                /* remove the given node or link from the graph, also deleting dangling links if a node is removed
                */
                if (global.graph.nodes.find(item => item.id === condemned.id)) {
                    global.graph.nodes = global.graph.nodes.filter(function (n) {
                        return n.id !== condemned.id;
                    });
                    return global.graph.links = global.graph.links.filter(function (l) {
                        return l.source.id !== condemned.id && l.target.id !== condemned.id;
                    });
                } else if (__indexOf.call(global.graph.links, condemned) >= 0) {
                    return global.graph.links = global.graph.links.filter(function (l) {
                        return l !== condemned;
                    });
                }
            };

            global.graph.add_node = function (type) {
                const n = {
                    id: global.graph.last_index++,
                    x: width / 2,
                    y: height / 2,
                    type: type,
                    editable: true
                };
                global.graph.nodes.push(n);
                return n;
            };

            global.graph.add_link = function (source, target) {
                /* avoid links to self
                */
                var l, link, _i, _len, _ref;
                if (source === target) return null;
                /* avoid link duplicates
                */
                _ref = global.graph.links;
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    link = _ref[_i];
                    if (link.source === source && link.target === target) return null;
                }
                l = {
                    source: source,
                    target: target,
                    editable: true
                };
                global.graph.links.push(l);
                return l;
            };


            /* TOOLBAR
            */
            toolbar = $(".toolbar");
            library = $(".library");
            ['X', 'Y', 'Z', 'W'].forEach(function (type) {
                var new_btn;
                new_btn = $("<svg width='42' height='42'>\n    <g class='node'>\n        <circle\n            cx='21'\n            cy='21'\n            r='18'\n            stroke='" + (global.colorify(type)) + "'\n            fill='" + (d3.hcl(global.colorify(type)).brighter(3)) + "'\n        />\n    </g>\n</svg>");
                new_btn.bind('click', function () {
                    global.graph.add_node(type);
                    update();
                    return db.store_graph(global.graph.serialize());
                });
                library.append(new_btn);
                return library.hide();
            });
            global.tool = 'pointer';
            global.new_link_source = null;
            global.vis.on('mousemove.add_link', (function (d) {
                /* check if there is a new link in creation
                */
                var p;
                if (global.new_link_source != null) {
                    /* update the draggable link representation
                    */
                    p = d3.mouse(global.vis.node());
                    return global.drag_link.attr('x1', global.new_link_source.x).attr('y1', global.new_link_source.y).attr('x2', p[0]).attr('y2', p[1]);
                }
            })).on('mouseup.add_link', (function (d) {
                global.new_link_source = null;
                /* remove the draggable link representation, if exists
                */
                if (global.drag_link != null) return global.drag_link.remove();
            }));
            d3.selectAll('.tool').on('click', function () {
                var new_tool, nodes;
                d3.selectAll('.tool').classed('active', false);
                d3.select(this).classed('active', true);
                new_tool = $(this).data('tool');
                nodes = global.vis.selectAll('.node');
                if (new_tool === 'add_link' && global.tool !== 'add_link') {
                    /* remove drag handlers from nodes
                    */
                    nodes.on('mousedown.drag', null).on('touchstart.drag', null);
                    /* add drag handlers for the add_link tool
                    */
                    nodes.call(drag_add_link);
                } else if (new_tool !== 'add_link' && global.tool === 'add_link') {
                    /* remove drag handlers for the add_link tool
                    */
                    nodes.on('mousedown.add_link', null).on('mouseup.add_link', null);
                    /* add drag behavior to nodes
                    */
                    nodes.call(global.drag);
                }
                if (new_tool === 'add_node') {
                    library.show();
                } else {
                    library.hide();
                }
                return global.tool = new_tool;
            });
            /* PERSISTENCE - store the graph every second, to avoid missing the force layout updates on nodes' position
            */
            // return setInterval((function () {
            //     return db.store_graph(global.graph.serialize());
            // }), 2000);
        });
    });

    update = function () {
        /* update the layout
        */
        var links, new_nodes, nodes;
        global.force.nodes(global.graph.nodes).links(global.graph.links).start();
        /* create nodes and links
        */
        /* (links are drawn with insert to make them appear under the nodes)
        */
        /* also define a drag behavior to drag nodes
        */
        /* dragged nodes become fixed
        */
        nodes = global.vis.selectAll('.node').data(global.graph.nodes, function (d) {
            return d.id;
        }).classed( 'node--disabled', function (d) {
            return (d.editableBy && d.editableBy !== global.userID)
        });

        new_nodes = nodes.enter().append('g').attr('class', 'node').on('click', (function (d) {
            /* SELECTION
            */
            global.selection = d;
            d3.selectAll('.node').classed('selected', function (d2) {
                return d2 === d;
            });
            return d3.selectAll('.link').classed('selected', false);
        }));
        links = global.vis.selectAll('.link').data(global.graph.links, function (d) {
            return "" + d.source.id + "->" + d.target.id;
        });
        links.enter().insert('line', '.node').attr('class', 'link').attr('stroke', function (d) {
            if (d.editable) {
                return 'gray';
            } else {
                return '#B52D0C';
            }
        }).on('click', (function (d) {
            /* SELECTION
            */
            global.selection = d;
            d3.selectAll('.link').classed('selected', function (d2) {
                return d2 === d;
            });
            return d3.selectAll('.node').classed('selected', false);
        }));
        links.exit().remove();
        /* TOOLBAR - add link tool initialization for new nodes
        */
        if (global.tool === 'add_link') {
            new_nodes.call(drag_add_link);
        } else {
            new_nodes.call(global.drag);
        }
        new_nodes.filter(function (d) {
            return d.editable;
        }).append('circle').attr('r', 18).attr('stroke', function (d) {
            return global.colorify(d.type);
        }).attr('fill', function (d) {
            return d3.hcl(global.colorify(d.type)).brighter(3);
        });
        new_nodes.filter(function (d) {
            return !d.editable;
        }).append('rect').attr('x', -16).attr('y', -16).attr('width', 32).attr('height', 32).attr('stroke', function (d) {
            return global.colorify(d.type);
        }).attr('fill', function (d) {
            return d3.hcl(global.colorify(d.type)).brighter(3);
        });
        /* draw the label
        */
        new_nodes.append('text').text(function (d) {
            return d.id;
        }).attr('dy', '0.35em').attr('fill', function (d) {
            return global.colorify(d.type);
        });
        return nodes.exit().remove();
    };

    drag_add_link = function (selection) {
        return selection.on('mousedown.add_link', (function (d) {
            var p;
            global.new_link_source = d;
            /* create the draggable link representation
            */
            p = d3.mouse(global.vis.node());
            global.drag_link = global.vis.insert('line', '.node').attr('class', 'drag_link').attr('x1', d.x).attr('y1', d.y).attr('x2', p[0]).attr('y2', p[1]);
            /* prevent pan activation
            */
            d3.event.stopPropagation();
            /* prevent text selection
            */
            return d3.event.preventDefault();
        })).on('mouseup.add_link', (function (d) {
            /* add link and update, but only if a link is actually added
            */
            if (global.graph.add_link(global.new_link_source, d) != null) {
                update();
                return db.store_graph(global.graph.serialize());
            }
        }));
    };

}).call(this);
