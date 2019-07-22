import React, { useContext, useEffect, useState } from "react";
import PanelContext from "Contexts/PanelContext";
import Avatar from "Components/Avatar/Avatar";
import PanelTabs from "Components/PanelTabs/PanelTabs";
import DomainContext from "Contexts/DomainContext";
import DomainsSelect from "Components/DomainsSelect/DomainSelect";

import style from "./SidePanel.scss";

const SidePanel = () => {
  const { collapsed } = useContext(PanelContext);
  const { loading, domains, error } = useContext(DomainContext);
  const [selectedDomain, changeSelectedDomain] = useState(null);

  useEffect(() => {
    if (domains) {
      changeSelectedDomain(() => {
        return domains[0];
      });
    }
  }, [domains]);

  const onChangeDomain = domain => {
    changeSelectedDomain(() => domain);
  };

  return (
    <div className={style.panel}>
      <div className={style.panel__header}>
        <h1>{collapsed ? "m." : "mesh."}</h1>
        {!loading && !collapsed && selectedDomain ? (
          <DomainsSelect
            selectedDomain={selectedDomain}
            domains={domains}
            onChange={onChangeDomain}
          />
        ) : (
          ""
        )}
      </div>
      {collapsed ? (
        <div className={style.panel__aside}>
          <PanelTabs loading={loading} isVertical />
        </div>
      ) : (
        <div className={style.panel__main}>
          {!collapsed && error ? <p>{error}</p> : ""}
          {!collapsed && selectedDomain && selectedDomain.groups ? (
            <ul className={style.group_list}>
              {selectedDomain.groups.map(group => (
                <li key={group.id}>
                  <button style={{ borderColor: group.color }} type="button">
                    {group.name}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            ""
          )}
        </div>
      )}

      <div className={style.panel__footer}>
        <Avatar loading={loading} />
        {collapsed ? "" : <PanelTabs loading={loading} />}
      </div>
    </div>
  );
};

export default SidePanel;
