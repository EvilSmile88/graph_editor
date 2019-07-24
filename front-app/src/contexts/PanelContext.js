import { createContext } from "react";

const PanelContext = createContext({
  collapsed: true,
  selectedTab: null,
  openPanel: () => {},
  closePanel: () => {},
  selectTab: () => {},
});

export default PanelContext;
