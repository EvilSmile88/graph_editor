import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

import style from "./Avatar.scss";

const Avatar = props => {
  const { loading } = props;
  const spinner = <FontAwesomeIcon icon={faSpinner} spin size="lg" />;
  const defaultProfile = <FontAwesomeIcon icon={faUser} size="lg" />;
  return (
    <div className={style.avatar}>{loading ? spinner : defaultProfile}</div>
  );
};

Avatar.defaultProps = {
  loading: false,
};

Avatar.propTypes = {
  loading: PropTypes.bool,
};

export default Avatar;
