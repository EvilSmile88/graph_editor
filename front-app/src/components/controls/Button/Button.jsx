import React from "react";
import PropTypes from "prop-types";

import style from "./Button.scss";

const Button = props => {
  const { text, primary } = props;

  return (
    <button
      className={[style.button, primary ? style.button_primary : ""].join(" ")}
      type="button"
      {...props}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
  onClick: null,
  primary: false,
};

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  primary: PropTypes.bool,
};

export default Button;
