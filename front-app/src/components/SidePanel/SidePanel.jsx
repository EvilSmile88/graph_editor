import React, { useContext } from "react";
import PanelContext from "Contexts/PanelContext";
import Avatar from "Components/Avatar/Avatar";
import PanelTabs from "Components/PanelTabs/PanelTabs";
import DomainContext from "Contexts/DomainContext";

import style from "./SidePanel.scss";

const SidePanel = () => {
  // TODO: display list of domains;
  const { collapsed } = useContext(PanelContext);
  const { loading } = useContext(DomainContext);
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

export default SidePanel;
