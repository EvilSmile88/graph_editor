import React, { useContext } from "react";
import PropTypes from "prop-types";
import PanelContext from "Contexts/PanelContext";
import Avatar from "Components/Avatar/Avatar";

import style from "./SidePanel.scss";
import PanelTabs from "../PanelTabs/PanelTabs";

const SidePanel = props => {
  // TODO: display list of domains;
  // eslint-disable-next-line no-unused-vars
  const { loading, domains } = props;
  const { collapsed } = useContext(PanelContext);
  return (
    <div className={style.panel}>
      <div className={style.panel__header}>
        <h1>{collapsed ? "m." : "mesh."}</h1>
      </div>
      <div className={style.panel__main}>
        {collapsed ? <PanelTabs loading={loading} isVertical /> : ""}
      </div>
      <div className={style.panel__footer}>
        <Avatar loading={loading} />
        {collapsed ? "" : <PanelTabs loading={loading} />}
      </div>
    </div>
  );
};

SidePanel.defaultProps = {
  loading: false,
  domains: [],
};

SidePanel.propTypes = {
  loading: PropTypes.bool,
  domains: PropTypes.arrayOf(PropTypes.any),
};

export default SidePanel;
