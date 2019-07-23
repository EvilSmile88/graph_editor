import { createContext } from "react";

const PanelContext = createContext({
  collapsed: true,
  openPanel: () => {},
  closePanel: () => {},
});

export default PanelContext;
