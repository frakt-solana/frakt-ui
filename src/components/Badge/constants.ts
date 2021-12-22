import { VaultState } from '../../contexts/fraktion';

export const VAULT_BADGES_BY_STATE = {
  [VaultState.Inactive]: 'Inactive',
  [VaultState.Active]: 'Active',
  [VaultState.AuctionFinished]: 'Auction finished',
  [VaultState.Archived]: 'Archived',
  [VaultState.AuctionLive]: 'Auction live',
};
