import * as d3 from "d3";
import CUSTOM_DIAGRAM_EVENTS from "Constants/customDiagramEvents";
import style from "../components/Map/components/Diagram/Diagram.scss";

class GraphService {
  constructor(width, height, vis, visNodes, visLinks) {
    this.width = width;
    this.height = height;
    this.scale = 1;
    this.vis = vis;
    this.visNodes = visNodes;
    this.visLinks = visLinks;
    this.ctrlPressed = false;
    this.newLink = {
      source: null,
      dragLink: null,
    };
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

  drag() {
    let startX;
    let startY;
    const dragStarted = d => {
      startX = d3.event.x;
      startY = d3.event.y;

      if (!d3.event.active) {
        this.force.alphaTarget(0.3).restart();
      }
      const node = d;
      d3.select(this.vis)
        .selectAll(`#mesh__node_${d.id}`)
        .dispatch(CUSTOM_DIAGRAM_EVENTS.dragStart); // Dispatch custom event

      node.fx = startX;
      node.fy = startY;
    };

    const dragging = d => {
      const x = startX + (d3.event.x - startX) / this.scale;
      const y = startY + (d3.event.y - startY) / this.scale;
      const node = d;
      d3.select(this.vis)
        .selectAll(`#mesh__node_${d.id}`)
        .dispatch(CUSTOM_DIAGRAM_EVENTS.dragging); // Dispatch custom event
      node.fx = x;
      node.fy = y;
    };

    const dragEnded = d => {
      if (!d3.event.active) {
        this.force.alphaTarget(0);
      }
      const node = d;
      d3.select(this.vis)
        .selectAll(`#mesh__node_${d.id}`)
        .dispatch(CUSTOM_DIAGRAM_EVENTS.dragEnd); // Dispatch custom event
      node.fixed = true;
    };

    return d3
      .select(this.visNodes)
      .selectAll(".mesh__node")
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragging)
          .on("end", dragEnded),
      );
  }

  enableZoom() {
    const selection = d3.select(this.vis);
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
      d3.select(this.visLinks).attr("transform", d3.event.transform);
      d3.select(this.visNodes).attr(
        "style",
        `transform: translate(${x}px,${y}px) scale(${k})`,
      );
    };
    this.d3Zoom = d3
      .zoom()
      .scaleExtent([0.7, 1.4])
      .on("zoom", () => zoomed(this));

    selection.call(this.d3Zoom, d3.zoomIdentity).on("dblclick.zoom", null);
  }

  disableZoom() {
    d3.select(this.vis).on(".zoom", null);
  }

  tick() {
    const d3Graph = d3.select(this.vis);
    this.force.on("tick", () => {
      d3Graph.call(GraphService.updateGraph, this);
    });
  }

  crtlHandler(onAddLink) {
    const selection = d3.select(this.vis);
    const nodes = selection.selectAll(".mesh__node");
    d3.select("body").on("keydown", () => {
      if (!this.ctrlPressed && d3.event.key.toLowerCase() === "control") {
        this.ctrlPressed = true;
        nodes.on("mousedown.drag", null).on("touchstart.drag", null);
        selection.classed(style.container_drawing, true);
        this.dragAddLink(selection, onAddLink);
      }
    });
    d3.select("body").on("keyup", () => {
      if (this.ctrlPressed && d3.event.key.toLowerCase() === "control") {
        this.ctrlPressed = false;
        this.resetNewLink();
        selection.classed(style.container_drawing, false);
        selection.on("mousemove", null).on("mouseup", null);
        nodes.on("mousedown", null);
        this.drag(this.vis);
      }
    });
  }

  dragAddLink(selection, onAddLink) {
    const dragStart = d => {
      this.newLink.source = d;
      const linksContainer = d3.select(this.visLinks);
      const p = d3.mouse(linksContainer.node());
      this.newLink.dragLink = linksContainer
        .insert("line", ".node")
        .attr("class", "mesh_link")
        .attr("stroke-width", 3)
        .attr("stroke", "#AEAEAE")
        .attr("stroke-dasharray", 5)
        .attr("x1", d.x)
        .attr("y1", d.y)
        .attr("x2", p[0])
        .attr("y2", p[1]);

      selection.dispatch(CUSTOM_DIAGRAM_EVENTS.drawLineStart); // Dispatch custom event
      d3.event.stopPropagation();
      d3.event.preventDefault();
    };

    const dragging = () => {
      if (this.newLink.source) {
        const p = d3.mouse(d3.select(this.visLinks).node());
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
          type: "similar",
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

  popupHandler(onOpen, onClose) {
    const selection = d3.select(this.vis);
    selection
      .on(`${CUSTOM_DIAGRAM_EVENTS.drawLineStart}.popup`, onClose)
      .on("mousedown.popup", onClose);
    selection
      .selectAll(".mesh__node")
      .on(`${CUSTOM_DIAGRAM_EVENTS.dragStart}.popup`, onClose);
    d3.select(this.visLinks)
      .selectAll(".mesh__link")
      .on("click", () => {
        const position = d3.mouse(this.vis);
        onOpen({ left: position[0], top: position[1] });
      });
  }
}

export default GraphService;
