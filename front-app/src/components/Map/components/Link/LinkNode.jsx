import React from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

class LinkNode extends React.Component {
  componentDidMount() {
    const { data } = this.props;
    this.d3Link = d3
      .select(this.viz)
      .datum(data)
      .call(selection =>
        selection.attr("stroke-width", 3).attr("stroke", "bisque"),
      );
  }

  componentDidUpdate() {
    const { data, updateLink } = this.props;
    this.d3Link.datum(data).call(updateLink);
  }

  render() {
    return (
      <line
        ref={viz => {
          this.viz = viz;
        }}
        className="link"
      />
    );
  }
}

LinkNode.propTypes = {
  data: PropTypes.shape({ name: PropTypes.string }).isRequired,
  updateLink: PropTypes.func.isRequired,
};

export default LinkNode;
