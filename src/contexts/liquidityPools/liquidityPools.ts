import { web3, raydium } from '@frakt-protocol/frakt-sdk';

export const fetchRaydiumPoolsInfo =
  (connection: web3.Connection) =>
  async (
    raydiumPoolConfigs: raydium.LiquidityPoolKeysV4[],
  ): Promise<raydium.LiquidityPoolInfo[]> => {
    const raydiumPoolsInfo = await raydium.Liquidity.fetchMultipleInfo({
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
