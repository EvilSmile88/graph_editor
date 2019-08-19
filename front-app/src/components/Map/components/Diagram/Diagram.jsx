import React from "react";
import PropTypes from "prop-types";
import GraphService from "Services/GraphService";
import LinkNode from "../LinkNode/LinkNode";
import Node from "../Node/Node";
import style from "./Diagram.scss";
import LinkPopup from "../LinkPopup/LinkPopup";

class Diagram extends React.Component {
  constructor(props) {
    super(props);
    this.canvasWidth = window.innerWidth;
    this.canvasHeight = window.innerHeight * 0.9;
    this.state = {
      popup: {
        link: null,
        isOpen: false,
        position: null,
      },
      nodes: [],
      links: [],
    };
    this.onPopupOpen = this.onPopupOpen.bind(this);
    this.onPopupClose = this.onPopupClose.bind(this);
    this.onChangeLinkType = this.onChangeLinkType.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState(() => ({ ...data }));
    this.Graph = new GraphService(
      this.canvasWidth,
      this.canvasHeight,
      this.vis,
      this.visNodes,
      this.visLinks,
    );
    this.Graph.initForce(data.nodes, data.links);
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

  onChangeLinkType(type) {
    const { links, popup } = this.state;
    const updatedLinks = links.map(link => {
      if (link.index === popup.link.index) {
        return { ...link, type };
      }
      return link;
    });
    this.setState(() => ({
      links: updatedLinks,
      popup: {
        isOpen: false,
        position: null,
        link: null,
      },
    }));
  }

  onPopupOpen(position, link) {
    this.Graph.disableZoom();
    this.setState(() => ({
      popup: {
        isOpen: true,
        position,
        link,
      },
    }));
  }

  onPopupClose() {
    const { popup } = this.state;
    if (popup.isOpen) {
      this.Graph.enableZoom();
      this.setState(() => ({
        popup: {
          isOpen: false,
          position: null,
          link: null,
        },
      }));
    }
  }

  update() {
    const data = this.state;
    this.Graph.tick(data.nodes, data.links);
    this.Graph.drag();
    this.Graph.enableZoom();
    this.Graph.drawLinkHandler(this.onLinkAdd.bind(this));
    this.Graph.popupHandler(this.onPopupOpen, this.onPopupClose);
  }

  render() {
    const { links, nodes, popup } = this.state;
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
      <div style={{ position: "relative" }}>
        <div
          className={style.container}
          style={{
            width: this.canvasWidth,
            height: this.canvasHeight,
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
              ref={vis => {
                this.visLinks = vis;
              }}
              className={style.links_container}
            >
              {linksElements}
            </g>
          </svg>
          <div
            ref={vis => {
              this.visNodes = vis;
            }}
            className={style.nodes_container}
          >
            {nodesElements}
          </div>
        </div>
        {popup.isOpen && (
          <LinkPopup
            onChange={this.onChangeLinkType}
            position={popup.position}
          />
        )}
      </div>
    );
  }
}

Diagram.propTypes = {
  data: PropTypes.shape(PropTypes.any).isRequired,
};

export default Diagram;
