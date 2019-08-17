import React, { useRef } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LINK_TYPES from "Constants/linkTypes";

import style from "./LinkPopup.scss";

const LinkPopup = props => {
  const { position } = props;
  const ref = useRef(null);

  const calcTop = () => {
    return position.top - 94;
  };

  const calcLeft = () => {
    return position.left - 46;
  };

  return (
    <div
      ref={ref}
      className={style.popup}
      style={{ top: calcTop(), left: calcLeft() }}
    >
      <div className={style.popup__content}>
        <ul className={style.links}>
          {Object.keys(LINK_TYPES).map(link => {
            return (
              <li key={LINK_TYPES[link].label}>
                <button type="button">
                  <FontAwesomeIcon
                    style={{ color: LINK_TYPES[link].color }}
                    icon={LINK_TYPES[link].icon}
                    size="lg"
                  />
                  <span>{LINK_TYPES[link].label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

LinkPopup.propTypes = {
  position: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }).isRequired,
};

export default LinkPopup;
