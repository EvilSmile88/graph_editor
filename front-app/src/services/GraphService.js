import * as d3 from "d3";
import nodeStyle from "Components/Map/components/Node/Node.scss";

class GraphService {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.scale = 1;
    this.ctrlPressed = false;
    this.newLink = {
      source: null,
      dragLink: null,
    };
    this.vis = null;
    this.updateNode = selection => {
      selection.attr("style", d => {
        const sacelIndex = this.scale;
        const elementSize = d3
          .selectAll(`#mesh__node_${d.id}`)
          .node()
          .getBoundingClientRect();
        return `transform: translate(${d.x -
          elementSize.width / 2 / sacelIndex}px,${d.y -
          elementSize.height / 2 / sacelIndex}px)`;
      });
    };

    this.updateLink = selection => {
      selection
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    };
  }

  initForce(nodes, links) {
    this.links = links;
    this.force = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(-50))
      .force(
        "link",
        d3
          .forceLink(links)
          .id(d => d.id)
          .distance(100),
      )
      .force("collide", d3.forceCollide(20).strength(0.5));
  }

  static updateGraph(selection, that) {
    selection.selectAll(".mesh__node").call(that.updateNode);
    selection.selectAll(".mesh__link").call(that.updateLink);
  }

  drag(selection) {
    let startX;
    let startY;
    const dragStarted = d => {
      startX = d3.event.x;
      startY = d3.event.y;

      if (!d3.event.active) {
        this.force.alphaTarget(0.3).restart();
      }
      const node = d;
      d3.select(selection)
        .selectAll(`#mesh__node_${d.id}`)
        .classed(nodeStyle.mesh__node_fixed, true);
      node.fx = startX;
      node.fy = startY;
    };

    const dragging = d => {
      const x = startX + (d3.event.x - startX) / this.scale;
      const y = startY + (d3.event.y - startY) / this.scale;
      const node = d;
      node.fx = x;
      node.fy = y;
    };

    const dragEnded = d => {
      if (!d3.event.active) {
        this.force.alphaTarget(0);
      }
      const node = d;
      node.fixed = true;
    };

    return d3
      .select(selection)
      .selectAll(".mesh__node")
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragging)
          .on("end", dragEnded),
      );
  }

  // eslint-disable-next-line class-methods-use-this
  zoom(container) {
    const selection = d3.select(container);
    const zoomed = () => {
      const { k, x, y } = d3.event.transform;
      // const graphBox = contentSelection.node().getBBox();
      // const margin = 300;
      // const worldTopLeft = [graphBox.x - margin, graphBox.y - margin];
      // const worldBottomRight = [
      //   graphBox.x + graphBox.width + margin,
      //   graphBox.y + graphBox.height + margin,
      // ];
      // this.d3Zoom.translateExtent([worldTopLeft, worldBottomRight]);
      this.scale = k;
      selection
        .selectAll(".mesh__links_container")
        .attr("transform", d3.event.transform);
      selection
        .selectAll(".mesh__nodes_container")
        .attr("style", `transform: translate(${x}px,${y}px) scale(${k})`);
    };
    this.d3Zoom = d3
      .zoom()
      .scaleExtent([0.7, 1.4])
      .on("zoom", () => zoomed(this));

    selection.call(this.d3Zoom, d3.zoomIdentity).on("dblclick.zoom", null);
  }

  tick(container) {
    const d3Graph = d3.select(container);
    this.force.on("tick", () => {
      d3Graph.call(GraphService.updateGraph, this);
    });
  }

  crtlHandler(container, onAddLink) {
    this.vis = container;
    const selection = d3.select(container);
    const nodes = selection.selectAll(".mesh__node");
    d3.select("body").on("keydown", () => {
      if (!this.ctrlPressed && d3.event.key.toLowerCase() === "control") {
        this.ctrlPressed = true;
        nodes.on("mousedown.drag", null).on("touchstart.drag", null);
        this.dragAddLink(selection, onAddLink);
      }
    });
    d3.select("body").on("keyup", () => {
      if (this.ctrlPressed && d3.event.key.toLowerCase() === "control") {
        this.ctrlPressed = false;
        this.resetNewLink();
        selection.on("mousemove", null).on("mouseup", null);
        nodes.on("mousedown", null);
        this.drag(container);
      }
    });
  }

  dragAddLink(selection, onAddLink) {
    const dragStart = d => {
      this.newLink.source = d;
      const p = d3.mouse(selection.selectAll(".mesh__links_container").node());
      this.newLink.dragLink = selection
        .selectAll(".mesh__links_container")
        .insert("line", ".node")
        .attr("class", "mesh_link")
        .attr("stroke-width", 3)
        .attr("stroke", "bisque")
        .attr("x1", d.x)
        .attr("y1", d.y)
        .attr("x2", p[0])
        .attr("y2", p[1]);
      d3.event.stopPropagation();
      d3.event.preventDefault();
    };

    const dragging = () => {
      if (this.newLink.source) {
        const p = d3.mouse(
          selection.selectAll(".mesh__links_container").node(),
        );
        this.newLink.dragLink
          .attr("x1", this.newLink.source.x)
          .attr("y1", this.newLink.source.y)
          .attr("x2", p[0])
          .attr("y2", p[1]);
      }
    };

    const dragEnd = () => {
      this.newLink.source = null;
      /* remove the draggable link representation, if exists */
      if (this.newLink.dragLink) {
        this.newLink.dragLink.remove();
        this.newLink.dragLink = null;
      }
    };

    const addLink = d => {
      if (this.newLink.dragLink && this.checkNewLink(this.newLink.source, d)) {
        const newLink = {
          editable: true,
          value: 1,
          source: this.newLink.source.id,
          target: d.id,
        };
        onAddLink(newLink);
      }
    };

    return selection
      .on("mousemove", dragging)
      .on("mouseup", dragEnd)
      .selectAll(".mesh__node")
      .on("mousedown", dragStart)
      .on("mouseup", addLink);
  }

  resetNewLink() {
    this.newLink.source = null;
    /* remove the draggable link representation, if exists */
    if (this.newLink.dragLink) {
      this.newLink.dragLink.remove();
      this.newLink.dragLink = null;
    }
  }

  checkNewLink(source, target) {
    // avoid links to self */
    if (source === target) return null;
    // avoid link duplicates
    const isDuplicate = !!this.links.find(link => {
      return link.source === source && link.target === target;
    });
    if (isDuplicate) {
      return null;
    }
    // return new link
    return {
      source,
      target,
    };
  }
}

export default GraphService;
