import { Liquidity, LiquidityPoolKeysV4 } from '@raydium-io/raydium-sdk';
import { Connection } from '@solana/web3.js';
import { RaydiumPoolInfo } from './liquidityPools.model';

export const fetchRaydiumPoolsInfo =
  (connection: Connection) =>
  async (
    raydiumPoolConfigs: LiquidityPoolKeysV4[],
  ): Promise<RaydiumPoolInfo[]> => {
    const raydiumPoolsInfo = await Liquidity.fetchMultipleInfo({
      connection,
      pools: raydiumPoolConfigs,
    });

    return raydiumPoolsInfo;
  };

export {
  stakeLiquidity,
  unstakeLiquidity,
  harvestLiquidity,
} from './transactions/fusionPools';
export {
  raydiumSwap,
  createRaydiumLiquidityPool,
  addRaydiumLiquidity,
  removeRaydiumLiquidity,
} from './transactions/raydiumLiquidityPools';
