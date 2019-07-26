import React, { useContext, useEffect, useState } from "react";
import PanelContext from "Contexts/PanelContext";
import Avatar from "Components/Avatar/Avatar";
import PanelTabs from "Components/PanelTabs/PanelTabs";
import DomainContext from "Contexts/DomainContext";
import DomainsSelect from "Components/DomainsSelect/DomainSelect";
import Groups from "Components/Groups/Groups";
import TopicMapContext from "Contexts/TopicMapContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import style from "./SidePanel.scss";

const SidePanel = () => {
  const { collapsed, openPanel, selectTab } = useContext(PanelContext);
  const topicMapContext = useContext(TopicMapContext);
  const {
    loading,
    domains,
    error,
    selectDomainGroup,
    selectedDomainGroup,
    updating,
  } = useContext(DomainContext);
  const [selectedDomain, changeSelectedDomain] = useState(null);

  useEffect(() => {
    if (domains) {
      if (!selectedDomain) {
        changeSelectedDomain(() => {
          return domains[0];
        });
      } else {
        changeSelectedDomain(() => {
          return domains.find(domain => selectedDomain.id === domain.id);
        });
      }
    }
  }, [domains]);

  const onChangeDomain = domain => {
    changeSelectedDomain(() => domain);
    selectDomainGroup(null);
  };

  const errorMessage = (
    <p className={style.error_message}>
      <i>{error}</i>
    </p>
  );

  function closeTopicMap() {
    topicMapContext.closeMap();
    openPanel();
    selectTab(null);
  }

  return (
    <div className={style.panel}>
      <div className={style.panel__header}>
        <React.Fragment>
          {topicMapContext.opened ? (
            <button
              onClick={closeTopicMap}
              className={style.close_button}
              type="button"
            >
              <FontAwesomeIcon icon={faTimes} size="2x" />
            </button>
          ) : (
            ""
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1>{collapsed ? "m." : "mesh."}</h1>
            {selectedDomainGroup && collapsed ? (
              <span
                title={selectedDomainGroup.name}
                className={style.selected_group}
              >
                {selectedDomainGroup.name}
              </span>
            ) : null}
          </div>
          {!loading && !collapsed && selectedDomain ? (
            <DomainsSelect
              selectedDomain={selectedDomain}
              domains={domains}
              disabled={updating}
              onChange={onChangeDomain}
            />
          ) : (
            ""
          )}
        </React.Fragment>
      </div>
      {collapsed ? (
        <div className={style.panel__aside}>
          <PanelTabs loading={loading} isVertical />
        </div>
      ) : (
        <div className={style.panel__main}>
          {!collapsed && error ? errorMessage : ""}
          {!collapsed && selectedDomain ? (
            <Groups selectedDomain={selectedDomain} />
          ) : null}
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
