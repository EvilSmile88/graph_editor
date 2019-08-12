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
    this.state = {
      nodes: [],
      links: [],
    };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState(() => ({ ...data }));
    this.update();
  }

  componentDidUpdate(prevProps, prevState) {
    const { nodes, links } = this.state;
    if (prevState.nodes !== nodes || prevState.links !== links) {
      this.update();
    }
  }

  onLinkAdd(newLink) {
    this.setState(prevState => ({
      links: [...prevState.links, { ...newLink }],
    }));
  }

  update() {
    const data = this.state;
    this.Graph.initForce(data.nodes, data.links);
    this.Graph.tick(this.vis);
    this.Graph.zoom(this.vis);
    this.Graph.drag(this.vis);
    this.Graph.crtlHandler(this.vis, this.onLinkAdd.bind(this));
  }

  render() {
    const { links, nodes } = this.state;
    const linksElements = links.map(link => {
      return (
        <LinkNode
          key={`${link.source.id || link.source}_${link.target.id ||
            link.target}`}
          data={link}
          updateLink={this.Graph.updateLink}
        />
      );
    });

    const nodesElements = nodes.map(node => {
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
        <svg
          style={{ position: "absolute" }}
          width={this.canvasWidth}
          height={this.canvasHeight}
        >
          <g
            className={["mesh__links_container", style.links_container].join(
              " ",
            )}
          >
            {linksElements}
          </g>
        </svg>
        <div
          className={["mesh__nodes_container", style.nodes_container].join(" ")}
        >
          {nodesElements}
        </div>
      </div>
    );
  }
}

Diagram.propTypes = {
  data: PropTypes.shape(PropTypes.any).isRequired,
};

export default Diagram;
