import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

class Diagram extends React.Component {
  componentDidMount() {
    this.update();
  }

  update() {
    const { data } = this.props;
    const diagramWidth = window.innerWidth;
    const diagramHeight = window.innerHeight * 0.8;
    if (data && data.links) {
      const diagram = d3
        .select(this.diagramViz)
        .attr("width", diagramWidth)
        .attr("height", diagramHeight);

      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 2])
        .on("zoom", () => {
          const { k, x, y } = d3.event.transform;
          diagram.attr("transform", `translate(${x},${y}) scale(${k})`);
        });

      const drag = simulation => {
        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          // eslint-disable-next-line no-param-reassign
          d.fx = d.x;
          // eslint-disable-next-line no-param-reassign
          d.fy = d.y;
        }
        function dragged(d) {
          // eslint-disable-next-line no-param-reassign
          d.fx = d3.event.x;
          // eslint-disable-next-line no-param-reassign
          d.fy = d3.event.y;
        }
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          // eslint-disable-next-line no-param-reassign
          d.fx = null;
          // eslint-disable-next-line no-param-reassign
          d.fy = null;
        }
        return d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended);
      };

      diagram.call(zoom);

      const simulation = d3
        .forceSimulation(data.nodes)
        .force("charge", d3.forceManyBody().strength(-200))
        .force(
          "link",
          d3
            .forceLink(data.links)
            .distance(70)
            .id(d => d.id),
        )
        .force("center", d3.forceCenter(diagramWidth / 2, diagramHeight / 2))
        .force("collide", d3.forceCollide([5]).iterations([5]));

      const link = diagram
        .append("g")
        .attr("class", "links")
        .attr("stroke", "#47cc5c")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line");

      const node = diagram
        .append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 5)
        .attr("fill", "red")
        .call(drag(simulation));

      const ticked = () => {
        link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x).attr("cy", d => d.y);
      };

      simulation.nodes(data.nodes).on("tick", ticked);

      simulation.force("link").links(data.links);
    }
  }

  render() {
    return (
      <svg
        ref={viz => {
          this.diagramViz = viz;
        }}
      />
    );
  }
}

Diagram.propTypes = {
  data: PropTypes.shape(PropTypes.any).isRequired,
};

export default Diagram;
