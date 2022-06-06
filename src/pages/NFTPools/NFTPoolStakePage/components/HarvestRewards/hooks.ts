import { useWallet } from '@solana/wallet-adapter-react';

import { useLoadingModal } from '../../../../../components/LoadingModal';
import { FusionPool } from '../../../../../contexts/liquidityPools';
import { useConnection } from '../../../../../hooks';
import { harvest } from '../../transactions';

type UseHarvestRewards = (props: {
  inventoryFusionPool: FusionPool;
  liquidityFusionPool: FusionPool;
}) => {
  harvest: () => Promise<void>;
  visible: boolean;
  close: () => void;
};

export const useHarvestRewards: UseHarvestRewards = ({
  inventoryFusionPool,
  liquidityFusionPool,
}) => {
  const wallet = useWallet();
  const connection = useConnection();

  const {
    visible: loadingModalVisible,
    open: openLoadingModal,
    close: closeLoadingModal,
  } = useLoadingModal();

  const runHarvest = async (): Promise<void> => {
    try {
      openLoadingModal();

      const result = await harvest({
        wallet,
        connection,
        inventoryFusionPool,
        liquidityFusionPool,
      });
      if (!result) {
        throw new Error('Harvest failed');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    } finally {
      closeLoadingModal();
    }
  };

  return {
    harvest: runHarvest,
    visible: loadingModalVisible,
    close: closeLoadingModal,
  };
};
