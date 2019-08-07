import * as d3 from "d3";

class GraphService {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.scale = 1;
    this.updateNode = selection => {
      selection.attr("style", d => {
        const sacelIndex = this.scale;
        const elementSize = d3
          .selectAll(`#node_${d.id}`)
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
    selection.selectAll(".node").call(that.updateNode);
    selection.selectAll(".link").call(that.updateLink);
  }

  drag(selection) {
    let startX;
    let startY;
    const dragStarted = d => {
      if (!d3.event.active) {
        this.force.alphaTarget(0.3).restart();
      }
      const node = d;
      startX = d3.event.x;
      startY = d3.event.y;
      node.fx = startX;
      node.fy = startY;
    };

    const dragging = d => {
      const node = d;
      node.fx = startX + (d3.event.x - startX) / this.scale;
      node.fy = startY + (d3.event.y - startY) / this.scale;
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
      .selectAll(".node")
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
        .selectAll(".links_container")
        .attr("transform", `translate(${x},${y}) scale(${k})`);
      selection
        .selectAll(".nodes_container")
        .attr("style", `transform: translate(${x}px,${y}px) scale(${k})`);
    };
    this.d3Zoom = d3
      .zoom()
      .scaleExtent([0.7, 2])
      .on("zoom", () => zoomed(this));

    selection.call(this.d3Zoom);
  }

  tick(container) {
    const d3Graph = d3.select(container);
    this.force.on("tick", () => {
      d3Graph.call(GraphService.updateGraph, this);
    });
  }
}

export default GraphService;
