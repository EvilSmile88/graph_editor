import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// FONT_AWESOME: used the free equivalent of "fal fa-palette"
import { faPalette } from "@fortawesome/free-solid-svg-icons";

import style from "./ColorAddon.scss";

const ColorAddon = props => {
  const { name, onChange, ...restProps } = props;

  function onInputChange(e) {
    onChange(e.target.value);
  }

  return (
    <label
      style={{ position: "relative" }}
      htmlFor={name}
      className={style.color_addon}
    >
      <input id={name} onChange={onInputChange} {...restProps} type="color" />
      <span title="Select Color" className={style.color_addon__label}>
        <FontAwesomeIcon icon={faPalette} size="xs" />
      </span>
    </label>
  );
};

ColorAddon.defaultProps = {
  disabled: false,
};
ColorAddon.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ColorAddon;
