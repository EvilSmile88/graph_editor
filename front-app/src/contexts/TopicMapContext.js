import { createContext } from "react";

const TopicMapContext = createContext({
  opened: false,
  loading: false,
  map: null,
  error: null,
  openMap: () => {},
  closeMap: () => {},
  getMap: () => {},
  getMapSuccess: () => {},
  getMapFail: () => {},
});

export default TopicMapContext;
