import React, { useEffect, useContext } from "react";
import ApiService from "Services/ApiService";
import API_ENDPOINTS from "Constants/api";
import PanelContext from "Contexts/PanelContext";
import SidePanel from "Components/SidePanel/SidePanel";
import DomainContext from "Contexts/DomainContext";

const Main = () => {
  const { openPanel } = useContext(PanelContext);
  const { loadDomains, loadDomainsSuccess, loadDomainsFail } = useContext(
    DomainContext,
  );

  useEffect(() => {
    loadDomains();
    ApiService.get(API_ENDPOINTS.DOMAIN)
      .then(res => {
        openPanel();
        if (res.data.length) {
          loadDomainsSuccess(res.data);
        } else {
          loadDomainsFail("Sorry!. No Data.");
        }
      })
      .catch(() => {
        openPanel();
        loadDomainsFail("Sorry! Something was wrong.");
      });
  }, []);

  return <SidePanel />;
};

export default Main;
