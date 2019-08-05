import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import style from "./Node.scss";

class Node extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    this.d3Node = d3
      .select(this.viz)
      .datum(data)
      .on("dblclick", this.unpin);
  }

  componentDidUpdate() {
    const { data, updateNode } = this.props;
    this.d3Node.datum(data).call(updateNode);
  }

  unpin(d) {
    const node = d;
    node.fx = null;
    node.fy = null;
    d3.select(this).classed(style.mesh__node_fixed, false);
    return node;
  }

  render() {
    const { data } = this.props;
    return (
      <div
        id={`mesh__node_${data.id}`}
        className={["mesh__node", style.node].join(" ")}
        ref={viz => {
          this.viz = viz;
        }}
      >
        <div>
          <span>{data.label}</span>
        </div>
      </div>
    );
  }
}

Node.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    id: PropTypes.string,
  }).isRequired,
  updateNode: PropTypes.func.isRequired,
};

export default Node;
