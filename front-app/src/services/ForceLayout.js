import * as d3 from "d3";
import LINK_TYPES from "Constants/linkTypes";

class ForceLayout {
  constructor(defaultLinkColor, vis) {
    this.scale = 1;
    this.vis = vis;
    this.defaultLinkColor = defaultLinkColor;
    this.updateNode = this.updateNode.bind(this);
    this.updateLink = this.updateLink.bind(this);
  }

  initForce(nodes, links) {
    this.nodes = links;
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

  updateState(nodes, links) {
    this.nodes = links;
    this.links = links;
    this.force.nodes(nodes);
    this.force.force("link").links(links);
  }

  updateNode(selection) {
    selection.attr("style", d => {
      const elementSize = d3
        .selectAll(`#mesh__node_${d.id}`)
        .node()
        .getBoundingClientRect();
      return `transform: translate(${d.x -
        elementSize.width / 2 / this.scale}px,${d.y -
        elementSize.height / 2 / this.scale}px)`;
    });
  }

  // eslint-disable-next-line class-methods-use-this
  updateLink(selection) {
    selection
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y)
      .attr("stroke", d => LINK_TYPES[d.type].color || this.defaultLinkColor);
  }

  // eslint-disable-next-line class-methods-use-this
  updateGraph(selection, that) {
    selection.selectAll(".mesh__node").call(that.updateNode);
    selection.selectAll(".mesh__link").call(that.updateLink);
  }

  tick(nodes, links) {
    this.updateState(nodes, links);
    const selection = d3.select(this.vis);
    this.force.on("tick", () => {
      selection.call(this.updateGraph, this);
    });
  }
}

export default ForceLayout;
