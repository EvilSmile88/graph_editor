import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";
import style from "./LinkNode.scss";

class LinkNode extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    this.d3Link = d3.select(this.vis).datum(data);
  }

  componentDidUpdate() {
    const { data, updateLink } = this.props;
    this.d3Link.datum(data).call(updateLink);
  }

  render() {
    return (
      <React.Fragment>
        <line
          ref={vis => {
            this.vis = vis;
          }}
          className={["mesh__link", style.link, style.link_default].join(" ")}
        />
      </React.Fragment>
    );
  }
}

LinkNode.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
  }).isRequired,
  updateLink: PropTypes.func.isRequired,
};

export default LinkNode;
