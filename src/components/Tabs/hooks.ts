import { useState } from 'react';

import { Tab } from './Tabs';

type UseTabs = (props: { tabs: Tab[]; defaultValue?: string }) => {
  tabs: Tab[];
  activeTab: Tab | null;
  value: string;
  setValue: (value: string) => void;
};

export const useTabs: UseTabs = ({ tabs, defaultValue }) => {
  const [value, setValue] = useState<string>(defaultValue);

  return {
    tabs,
    activeTab: tabs.find(({ value: tabValue }) => value === tabValue) || null,
    value,
    setValue,
  };
};
