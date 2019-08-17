import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import CUSTOM_DIAGRAM_EVENTS from "Constants/customDiagramEvents";

import style from "./Node.scss";

class Node extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    this.d3Node = d3
      .select(this.vis)
      .datum(data)
      .on(`${CUSTOM_DIAGRAM_EVENTS.dragStart}.node`, this.onDragStart)
      .on(`${CUSTOM_DIAGRAM_EVENTS.dragEnd}.node`, this.onDragEnd)
      .on("dblclick", this.unpin);
  }

  componentDidUpdate() {
    const { data, updateNode } = this.props;
    this.d3Node.datum(data).call(updateNode);
  }

  onDragStart(d) {
    d3.select(this).classed(style.node_grabbing, true);
    return d;
  }

  onDragEnd(d) {
    d3.select(this)
      .classed(style.node_fixed, true)
      .classed(style.node_grabbing, false);
    return d;
  }

  pin(d) {
    d3.select(this).classed(style.node_fixed, true);
    return d;
  }

  unpin(d) {
    const node = d;
    node.fx = null;
    node.fy = null;
    d3.select(this).classed(style.node_fixed, false);
    return node;
  }

  render() {
    const { data } = this.props;
    return (
      <div
        id={`mesh__node_${data.id}`}
        className={["mesh__node", style.node].join(" ")}
        ref={vis => {
          this.vis = vis;
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
