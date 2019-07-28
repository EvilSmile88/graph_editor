import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

class Node extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    this.d3Node = d3
      .select(this.viz)
      .datum(data)
      .call(selection => {
        selection
          .select("circle")
          .attr("r", 25)
          .style("fill", "tomato")
          .style("stroke", "bisque")
          .style("stroke-width", "3px");

        selection
          .select("text")
          .style("fill", "honeydew")
          .style("font-weight", "600")
          .style("text-transform", "uppercase")
          .style("text-anchor", "middle")
          .style("alignment-baseline", "middle")
          .style("font-size", "10px")
          .style("font-family", "cursive");
      });
  }

  componentDidUpdate() {
    const { data, FORCE } = this.props;
    this.d3Node.datum(data).call(FORCE.updateNode);
  }

  render() {
    const { data } = this.props;
    return (
      <g
        className="node"
        ref={viz => {
          this.viz = viz;
        }}
      >
        <circle />
        <text>{data.label}</text>
      </g>
    );
  }
}

Node.propTypes = {
  data: PropTypes.shape({ label: PropTypes.string }).isRequired,
  FORCE: PropTypes.shape({
    updateNode: PropTypes.func,
  }).isRequired,
};

export default Node;
