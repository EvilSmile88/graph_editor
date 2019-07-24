import React from "react";
import PropTypes from "prop-types";

import style from "./TextField.scss";

const TextField = props => {
  const { onChange, addonAfter, ...restProps } = props;

  function onInputChange(e) {
    onChange(e.target.value);
  }
  return (
    <div className={style.text_field}>
      <input
        className={addonAfter ? style.pr : null}
        onChange={onInputChange}
        {...restProps}
        type="text"
      />
      {addonAfter ? (
        <div className={style.addon_after}>{addonAfter}</div>
      ) : null}
    </div>
  );
};

TextField.defaultProps = {
  inputMode: "text",
  placeholder: null,
  addonAfter: null,
  disabled: false,
};
TextField.propTypes = {
  inputMode: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  addonAfter: PropTypes.element,
  disabled: PropTypes.bool,
};

export default TextField;
