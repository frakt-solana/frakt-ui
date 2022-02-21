export type SortValue = {
  label: JSX.Element;
  value: string;
};

export enum SidebarCheckboxNames {
  SHOW_VERIFIED_VAULTS = 'showVerifiedVaults',
  SHOW_TRADABLE_VAULTS = 'showTradableVaults',
}

export enum StatusRadioNames {
  SHOW_ALL_VAULTS = 'showAllVaults',
  SHOW_ACTIVE_VAULTS = 'showActiveVaults',
  SHOW_AUCTION_LIVE_VAULTS = 'showAuctionLiveVaults',
  SHOW_AUCTION_FINISHED_VAULTS = 'showAuctionFinishedVaults',
  SHOW_ARCHIVED_VAULTS = 'showArchivedVaults',
}

export enum InputControlsNames {
  SHOW_VAULTS_STATUS = 'showVaultsStatus',
  SHOW_VERIFIED_VAULTS = 'showVerifiedVaults',
  SHOW_TRADABLE_VAULTS = 'showTradableVaults',
  SORT = 'sort',
}

export type FormFieldValues = {
  [InputControlsNames.SHOW_VAULTS_STATUS]: StatusRadioNames;
  [InputControlsNames.SHOW_VERIFIED_VAULTS]: boolean;
  [InputControlsNames.SHOW_TRADABLE_VAULTS]: boolean;
  [InputControlsNames.SORT]: SortValue;
};
