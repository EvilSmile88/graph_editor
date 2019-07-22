import React, { useContext } from "react";
import uuid from "uuid/v1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain, faDna, faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBookmark as farBookmark,
  faCommentAlt as farCommentAlt,
  faStar as farStart,
} from "@fortawesome/free-regular-svg-icons";

import PanelContext from "Contexts/PanelContext";
import PropTypes from "prop-types";
import style from "./PanelTabs.scss";

library.add(farBookmark, farCommentAlt, farStart);

const PanelTabs = props => {
  const { closePanel } = useContext(PanelContext);
  const { isVertical, loading } = props;
  const verticalTabs = [
    {
      // FONT_AWESOME: used the free equivalent of "far fa-brain"
      icon: faBrain,
      tabName: "Topic",
      onClick: closePanel,
      id: uuid(),
    },
    {
      icon: faDna,
      tabName: "Pattern",
      id: uuid(),
    },
    {
      icon: ["far", "bookmark"],
      tabName: "Define",
      id: uuid(),
    },
  ];

  const horizontalTabs = [
    ...verticalTabs,
    {
      // FONT_AWESOME: used the free equivalent of "far fa-comment-alt-lines"
      icon: ["far", "comment-alt"],
      tabName: "Thought",
      id: uuid(),
    },
    {
      icon: ["far", "star"],
      tabName: "Rate",
      id: uuid(),
    },
    {
      // FONT_AWESOME: used the free equivalent of "far fa-sliders-v"
      icon: faSlidersH,
      tabName: "Settings",
      id: uuid(),
    },
  ];

  const tabPlaceholder = <div className={style.tab_placeholder} />;

  return (
    <nav
      className={[
        style.panel__nav,
        isVertical ? style.panel__nav_vertical : "",
      ].join(" ")}
    >
      <ul>
        {isVertical
          ? verticalTabs.map(tab => (
              <li key={tab.id.toString()}>
                {loading ? (
                  tabPlaceholder
                ) : (
                  <button
                    className={style.panel__nav__tab}
                    type="button"
                    onClick={tab.onClick}
                  >
                    <FontAwesomeIcon icon={tab.icon} size="2x" />
                  </button>
                )}
              </li>
            ))
          : horizontalTabs.map(tab => (
              <li key={tab.id.toString()}>
                {loading ? (
                  tabPlaceholder
                ) : (
                  <button
                    className={style.panel__nav__tab}
                    type="button"
                    onClick={tab.onClick}
                  >
                    <FontAwesomeIcon icon={tab.icon} size="2x" />
                    <div>{tab.tabName}</div>
                  </button>
                )}
              </li>
            ))}
      </ul>
    </nav>
  );
};

PanelTabs.defaultProps = {
  isVertical: false,
  loading: false,
};

PanelTabs.propTypes = {
  isVertical: PropTypes.bool,
  loading: PropTypes.bool,
};

export default PanelTabs;
