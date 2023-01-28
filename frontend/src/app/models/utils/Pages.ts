export interface Page {
  key: string;
  translateKey: string;
  iconKey: string;
}

export const pages: readonly Page[] = [
  { key: "home", translateKey: "header.home", iconKey: "home" },
  {
    key: "simulator",
    translateKey: "header.simulator",
    iconKey: "rocket_launch",
  },
  {
    key: "map-simulator",
    translateKey: "header.mapSimulator",
    iconKey: "location_on",
  },
  { key: "tester", translateKey: "header.tester", iconKey: "bug_report" },
  { key: "results", translateKey: "header.results", iconKey: "analytics" },
  { key: "changelog", translateKey: "header.changelog", iconKey: "history" },
  {
    key: "page-not-found",
    translateKey: "header.pageNotFound",
    iconKey: "warning",
  },
];
