import { moduleConfig, moduleOrder, type ModuleGroup } from "./moduleConfig";

export type NavigationItem = {
  id: string;
  label: string;
  group: ModuleGroup;
  accentColor: string;
};

export const navigationItems: NavigationItem[] = moduleOrder.map((moduleId) => {
  const item = moduleConfig[moduleId];

  return {
    id: item.id,
    label: item.label,
    group: item.group,
    accentColor: item.accentColor,
  };
});

export const navigationGroups = [
  {
    id: "overview",
    label: "Übersicht",
  },
  {
    id: "sales",
    label: "Verkauf",
  },
  {
    id: "masterdata",
    label: "Stammdaten",
  },
  {
    id: "system",
    label: "System",
  },
] as const;

export function getNavigationItemById(pageId: string) {
  return navigationItems.find((item) => item.id === pageId);
}
