import * as d3 from "d3";

class GraphService {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.updateNode = selection => {
      selection
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .attr("cx", d => {
          const node = d;
          node.x = Math.max(30, Math.min(this.width - 30, node.x));
          return node;
        })
        .attr("cy", d => {
          const node = d;
          node.y = Math.max(30, Math.min(this.height - 30, node.y));
          return node;
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
      .force("center", d3.forceCenter(this.width / 2, this.height / 2))
      .force("collide", d3.forceCollide(30).strength(0.5));
  }

  static updateGraph(selection, that) {
    selection.selectAll(".node").call(that.updateNode);
    selection.selectAll(".link").call(that.updateLink);
  }

  drag(selection) {
    const dragStarted = d => {
      if (!d3.event.active) {
        this.force.alphaTarget(0.3).restart();
      }
      const node = d;
      node.fx = d3.x;
      node.fy = d3.y;
    };

    const dragging = d => {
      const node = d;
      node.fx = d3.event.x;
      node.fy = d3.event.y;
    };

    const dragEnded = d => {
      if (!d3.event.active) {
        this.force.alphaTarget(0);
      }
      const node = d;
      node.fx = null;
      node.fy = null;
    };

    return d3
      .select(selection)
      .selectAll("g.node")
      .call(
        d3
          .drag()
          .on("start", dragStarted)
          .on("drag", dragging)
          .on("end", dragEnded),
      );
  }

  // eslint-disable-next-line class-methods-use-this
  zoom(container, content) {
    const selection = d3.select(container);
    const zoomed = () => {
      const { k, x, y } = d3.event.transform;
      const contentSelection = d3.select(content);
      const graphBox = contentSelection.node().getBBox();
      const margin = 300;
      const worldTopLeft = [graphBox.x - margin, graphBox.y - margin];
      const worldBottomRight = [
        graphBox.x + graphBox.width + margin,
        graphBox.y + graphBox.height + margin,
      ];
      this.d3Zoom.translateExtent([worldTopLeft, worldBottomRight]);
      contentSelection.attr("transform", `translate(${x},${y}) scale(${k})`);
    };
    this.d3Zoom = d3
      .zoom()
      .scaleExtent([0.7, 2])
      .on("zoom", zoomed);

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
