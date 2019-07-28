import React from "react";
import PropTypes from "prop-types";
import GraphService from "Services/GraphService";
import LinkNode from "../Link/LinkNode";
import Node from "../Node/Node";

class Diagram extends React.Component {
  constructor(props) {
    super(props);
    this.Graph = new GraphService(
      window.innerWidth * 3,
      window.innerHeight * 0.8 * 3,
    );
  }

  componentDidMount() {
    const { data } = this.props;
    this.Graph.initForce(data.nodes, data.links);
    this.Graph.zoom(this.viz);
    this.Graph.tick(this.viz);
    this.Graph.drag(this.viz);
  }

  render() {
    const { data } = this.props;
    const links = data.links.map(link => {
      return (
        <LinkNode
          key={`${link.source}_${link.target}`}
          data={link}
          FORCE={this.Graph}
        />
      );
    });

    const nodes = data.nodes.map(node => {
      return <Node data={node} FORCE={this.Graph} key={node.id} />;
    });
    return (
      <div
        className="graph__container"
        ref={viz => {
          this.viz = viz;
        }}
      >
        <svg
          className="graph"
          width={this.Graph.width}
          height={this.Graph.height}
        >
          <g>{links}</g>
          <g>{nodes}</g>
        </svg>
      </div>
    );
  }
}

Diagram.propTypes = {
  data: PropTypes.shape(PropTypes.any).isRequired,
};

export default Diagram;
