import React from "react";
import PropTypes from "prop-types";
import GraphService from "Services/GraphService";
import LinkNode from "../Link/LinkNode";
import Node from "../Node/Node";

class Diagram extends React.Component {
  constructor(props) {
    super(props);
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight * 0.8;
    this.Graph = new GraphService(this.canvasWidth, this.canvasHeight);
  }

  componentDidMount() {
    const { data } = this.props;
    this.Graph.initForce(data.nodes, data.links);
    this.Graph.zoom(this.vis, this.contentVis);
    this.Graph.tick(this.vis);
    this.Graph.drag(this.vis);
  }

  render() {
    const { data } = this.props;
    const links = data.links.map(link => {
      return (
        <LinkNode
          key={`${link.source}_${link.target}`}
          data={link}
          updateLink={this.Graph.updateLink}
        />
      );
    });

    const nodes = data.nodes.map(node => {
      return (
        <Node data={node} updateNode={this.Graph.updateNode} key={node.id} />
      );
    });
    return (
      <div
        ref={vis => {
          this.vis = vis;
        }}
      >
        <svg width={this.canvasWidth} height={this.canvasHeight}>
          <g
            fill="red"
            ref={vis => {
              this.contentVis = vis;
            }}
            className="graph-content"
          >
            <g>{links}</g>
            <g>{nodes}</g>
          </g>
        </svg>
      </div>
    );
  }
}

Diagram.propTypes = {
  data: PropTypes.shape(PropTypes.any).isRequired,
};

export default Diagram;
