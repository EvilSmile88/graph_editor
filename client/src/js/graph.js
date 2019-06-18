export class Graph {
    vis = null;
    selection = null;
    colorify = d3.scale.category10();
    force = null;
    layout = d3.layout;
    drag = null;
    new_link_source = null;
    drag_link = null;
    tool = 'pointer';
    layoutHeight = 0;
    layoutWidth = 0;
    nodeTypes = ['X', 'Y', 'Z', 'W'];
    eventsEmitter = new EventEmitter();

    constructor(data, userID = 1) {
        this.userID = userID;
        this.data = data;
    }

    getData() {
        return this.data;
    }

    serialize() {
        /* PERSISTENCE - return a copy of the graph, with redundancies (whole nodes in links pointers) removed. also include the last_index property, to persist it also*/
        var l;
        return {
            nodes: this.data.nodes,
            links: (() => {
                var _i, _len, _ref, _results;
                _ref = this.data.links;
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
            last_index: this.data.last_index
        };
    };

    objectify(graph) {
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

    initLayout(container, width, height) {
        this.layoutHeight = height;
        this.layoutWidth = width;
        container.call(d3.behavior.zoom().scaleExtent([0.5, 8]).on('zoom', (() => {
            return this.vis.attr('transform', "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        })));
        this.vis = container.append('g');
        /* create a rectangular overlay to catch events
        */
        /* WARNING rect size is huge but not infinite. this is a dirty hack
        */
        this.vis.append('rect').attr('class', 'overlay').attr('x', -500000).attr('y', -500000).attr('width', 1000000).attr('height', 1000000).on('click', (function (d) {
            /* SELECTION
            */
            d3.selectAll('.node').classed('selected', false)
            return d3.selectAll('.link').classed('selected', false);
        }));

        /* initialize the force layout
        */
        this.force = d3.layout.force().size([width, height]).charge(-400).linkDistance(60).on('tick', (() => {
            /* update nodes and links
            */
            this.vis.selectAll('.node').attr('transform', function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
            return this.vis.selectAll('.link').attr('x1', function (d) {
                return d.source.x;
            }).attr('y1', function (d) {
                return d.source.y;
            }).attr('x2', function (d) {
                return d.target.x;
            }).attr('y2', function (d) {
                return d.target.y;
            });
        }));

        this.drag = this.force.drag();

        this.drag.on('dragstart', (d) => {
            this.eventsEmitter.emit("event:drag-node-start", d);
            return d.fixed = true;
        }).on('dragend', (d) => {
            this.eventsEmitter.emit("event:drag-node-end", d);
        });
    }

    update() {
        /* update the layout
        */
        var links, new_nodes, nodes;
        this.force.nodes(this.data.nodes).links(this.data.links).start();
        /* create nodes and links
        */
        /* (links are drawn with insert to make them appear under the nodes)
        */
        /* also define a drag behavior to drag nodes
        */
        /* dragged nodes become fixed
        */
        nodes = this.vis.selectAll('.node').data(this.data.nodes, function (d) {
            return d.id;
        }).classed('node--disabled', (d) => {
            return (d.editableBy && d.editableBy !== this.userID)
        });

        this.vis.selectAll('.node').data(this.data.nodes, function (d) {
            const svgNode = document.querySelector(`#node_${d.id}`);
            if (svgNode && d.label) {
                svgNode.querySelector('text').textContent = d.label.length > 6 ? `${d.label.slice(0, 6)}..` : d.label
            }
        });

        new_nodes = nodes.enter().append('g').attr('class', 'node').on('click', ((d) => {
            /* SELECTION
            */
            this.selection = d;
            d3.selectAll('.node').classed('selected', function (d2) {
                return d2 === d;
            });
            return d3.selectAll('.link').classed('selected', false);
        }));

        links = this.vis.selectAll('.link').data(this.data.links, function (d) {
            return "" + d.source.id + "->" + d.target.id;
        });
        links.enter().insert('line', '.node').attr('class', 'link').attr('stroke', function (d) {
            if (d.editable) {
                return 'gray';
            } else {
                return '#B52D0C';
            }
        }).on('click', ((d) => {
            /* SELECTION
            */
            this.selection = d;
            d3.selectAll('.link').classed('selected', function (d2) {
                return d2 === d;
            });
            return d3.selectAll('.node').classed('selected', false);
        }));
        links.exit().remove();
        /* TOOLBAR - add link tool initialization for new nodes
        */
        if (this.tool === 'add_link') {
            new_nodes.call(this.dragAddLink, this);
        } else {
            new_nodes.call(this.drag);
        }
        new_nodes.attr('id', d => `node_${d.id}`)
            .filter((d) => d.editable)
            .append('rect')
            .attr('x', -45)
            .attr('y', -16)
            .attr('width', 90)
            .attr('height', 32)
            .attr('rx', 8)
            .attr('ry', 8)
            .attr('stroke', (d) => {
                return this.colorify(d.type);
            }).attr('fill', (d) => {
            return d3.hcl(this.colorify(d.type)).brighter(3);
        });
        new_nodes
            .attr('id', d => `node_${d.id}`)
            .filter((d) => {
                return !d.editable;
            }).append('rect')
            .attr('x', -45)
            .attr('y', -16)
            .attr('width', 90)
            .attr('height', 32)
            .attr('stroke', (d) => {
                return this.colorify(d.type);
            }).attr('fill', (d) => {
            return d3.hcl(this.colorify(d.type)).brighter(3);
        });
        /* draw the label
        */
        new_nodes
            .append('text').text((d) => {
            if (d.label) {
                if (d.label.length > 6) {
                    return `${d.label.slice(0, 6)}..`
                }
                return d.label;
            }
            return d.id
        })
            .attr('fill', (d) => this.colorify(d.type))
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle');
        return nodes.exit().remove();
    };

    initToolBar(toolbar, library) {

        this.nodeTypes.forEach((type) => {
            var new_btn;
            new_btn = $("<svg width='42' height='42'>\n    <g class='node'>\n        <circle\n            cx='21'\n            cy='21'\n            r='18'\n            stroke='" + (this.colorify(type)) + "'\n            fill='" + (d3.hcl(this.colorify(type)).brighter(3)) + "'\n        />\n    </g>\n</svg>");
            new_btn.bind('click', () => {
                this.addNode(type);
                this.update();
            });
            library.append(new_btn);
            return library.hide();
        });

        this.vis.on('mousemove.add_link', ((d) => {
            /* check if there is a new link in creation
            */
            var p;
            if (this.new_link_source != null) {
                /* update the draggable link representation
                */
                p = d3.mouse(this.vis.node());
                return this.drag_link.attr('x1', this.new_link_source.x).attr('y1', this.new_link_source.y).attr('x2', p[0]).attr('y2', p[1]);
            }
        })).on('mouseup.add_link', ((d) => {
            this.new_link_source = null;
            /* remove the draggable link representation, if exists
            */
            if (this.drag_link != null) return this.drag_link.remove();
        }));
        const global = this;
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
                nodes.call(global.dragAddLink, global);
            } else if (new_tool !== 'add_link' && global.tool === 'add_link') {
                /* remove drag handlers for the add_link tool
                */
                nodes.on('mousedown.add_link', null).on('mouseup.add_link', null);
                /* add drag behavior to nodes
                */
                nodes.call(global.drag);
            }
            if (new_tool === 'edit') {
                nodes.on('mouseup', () => {
                    setTimeout(() => {
                        if (global.selection.editable) {
                            global.eventsEmitter.emit("event:start-edit-node-label", global.selection)
                        }
                    }, 200)
                })
            } else {
                nodes.on('mouseup', null)
            }
            if (new_tool === 'add_node') {
                library.show();
            } else {
                library.hide();
            }
            return global.tool = new_tool;
        });
    }

    addNode(type) {
        const id = this.data.last_index++;
        const n = {
            id: id,
            label: `${id}`,
            x: this.layoutWidth / 2,
            y: this.layoutHeight / 2,
            type: type,
            editable: true
        };
        this.data.nodes.push(n);
        this.eventsEmitter.emit("event:add-node", n);
        return n;
    };


    removeItem(condemned) {
        if (this.selection && condemned.editable) {
            /* remove the given node or link from the graph, also deleting dangling links if a node is removed
         */
            let removedLinks = [];
            let removedNodes = [];
            if (this.data.nodes.find(item => item.id === condemned.id)) {
                this.data.nodes = this.data.nodes.filter((n) => {
                    const isRemoved = n.id === condemned.id;
                    if (isRemoved) {
                        removedNodes.push(n);
                    }
                    return n.id !== condemned.id;
                });
                this.data.links = this.data.links.filter((l) => {
                    const isRemoved = (l.source.id === condemned.id) || (l.target.id === condemned.id);
                    if (isRemoved) {
                        removedLinks.push(l);
                    }
                    return l.source.id !== condemned.id && l.target.id !== condemned.id;
                });
                this.eventsEmitter.emit("event:remove-nodes", {removedNodes, removedLinks});
                return this.data.links;
            } else if (Array.prototype.indexOf.call(this.data.links, condemned) >= 0) {
                this.data.links = this.data.links.filter((l) => {
                    const isRemoved = l.source.id === condemned.source.id && l.target.id === condemned.target.id;
                    if (isRemoved) {
                        removedLinks.push(l);
                    }
                    return (l.source.id !== condemned.source.id) || (l.target.id !== condemned.target.id);
                });
                this.eventsEmitter.emit("event:remove-links", removedLinks);
                return this.data.links;
            }
            this.selection = null;
            this.update();
        }
    };

    addLink(source, target) {
        /* avoid links to self
        */
        var l, link, _i, _len, _ref;
        if (source === target) return null;
        /* avoid link duplicates
        */
        _ref = this.data.links;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            link = _ref[_i];
            if (link.source === source && link.target === target) return null;
        }
        l = {
            source: source,
            target: target,
            editable: true
        };
        this.data.links.push(l);
        return l;
    };

    updateNodeLabel(updatedNode) {
        this.data.nodes = this.data.nodes.map(node => {
            if (node.id === updatedNode.id) {
                let label = updatedNode.label;
                return updatedNode;
            }
            return node;
        });
        this.update();
        this.eventsEmitter.emit('event:end-edit-node-label', updatedNode);
        return updatedNode;
    };

    dragAddLink(selection, that) {
        return selection.on('mousedown.add_link', ((d) => {
            var p;
            that.new_link_source = d;
            /* create the draggable link representation
            */
            p = d3.mouse(that.vis.node());
            that.drag_link = that.vis.insert('line', '.node').attr('class', 'drag_link').attr('x1', d.x).attr('y1', d.y).attr('x2', p[0]).attr('y2', p[1]);
            /* prevent pan activation
            */
            d3.event.stopPropagation();
            /* prevent text selection
            */
            return d3.event.preventDefault();
        })).on('mouseup.add_link', ((d) => {
            /* add link and update, but only if a link is actually added
            */
            if (that.addLink(that.new_link_source, d) != null) {
                that.update();
                that.eventsEmitter.emit('event:add-link', {
                    editable: true,
                    source: that.new_link_source.id,
                    target: d.id
                });
                return d3.event.preventDefault();
            }
        }));
    };

}

