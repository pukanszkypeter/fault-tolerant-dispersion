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
    iconKey: "hub",
  },
  { key: "tester", translateKey: "header.tester", iconKey: "science" },
  { key: "results", translateKey: "header.results", iconKey: "analytics" },
  { key: "changelog", translateKey: "header.changelog", iconKey: "history" },
  {
    key: "page-not-found",
    translateKey: "header.pageNotFound",
    iconKey: "warning",
  },
];
