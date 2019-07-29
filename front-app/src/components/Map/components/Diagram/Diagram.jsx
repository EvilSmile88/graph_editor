import React from "react";
import PropTypes from "prop-types";
import GraphService from "Services/GraphService";
import LinkNode from "../Link/LinkNode";
import Node from "../Node/Node";
import style from "./Diagram.scss";

class Diagram extends React.Component {
  constructor(props) {
    super(props);
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight * 0.9;
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
        style={{
          width: this.canvasWidth,
          height: this.canvasHeight,
          position: "relative",
        }}
        ref={vis => {
          this.vis = vis;
        }}
      >
        <div
          ref={vis => {
            this.contentVis = vis;
          }}
        >
          <svg
            style={{ position: "absolute" }}
            width={this.canvasWidth}
            height={this.canvasHeight}
          >
            <g className="links_container">{links}</g>
          </svg>
          <div className={["nodes_container", style.nodes_container].join(" ")}>
            {nodes}
          </div>
        </div>
      </div>
    );
  }
}

Diagram.propTypes = {
  data: PropTypes.shape(PropTypes.any).isRequired,
};

export default Diagram;
