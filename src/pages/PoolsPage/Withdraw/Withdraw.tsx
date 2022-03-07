import { FC, useState } from 'react';
import BN from 'bn.js';
import {
  LiquidityPoolKeysV4,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { TokenFieldWithBalance } from '../../../components/TokenField';
import { SOL_TOKEN } from '../../../utils';
import Button from '../../../components/Button';
import styles from './styles.module.scss';
import {
  FusionPoolInfo,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { AccountInfoParsed } from '../../../utils/accounts';

interface WithdrawInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  fusionPoolInfo: FusionPoolInfo;
  lpTokenAccountInfo: AccountInfoParsed;
}

const Withdraw: FC<WithdrawInterface> = ({
  baseToken,
  poolConfig,
  raydiumPoolInfo,
  fusionPoolInfo,
  lpTokenAccountInfo,
}) => {
  const { removeRaydiumLiquidity, unstakeLiquidity, stakeLiquidity } =
    useLiquidityPools();

  const [withdrawValue, setWithdrawValue] = useState<string>('');

  const { lpMint } = poolConfig;
  const { lpDecimals } = raydiumPoolInfo;

  const balance =
    lpTokenAccountInfo?.accountInfo?.amount.toNumber() / 10 ** lpDecimals || 0;

  const stakedBalance =
    Number(fusionPoolInfo?.mainRouter?.amountOfStaked) / 10 ** lpDecimals;

  const onSubmitHandler = async (): Promise<void> => {
    if (fusionPoolInfo) {
      const { mainRouter, secondaryReward } = fusionPoolInfo;

      const baseAmount = new BN(Number(withdrawValue) * 10 ** lpDecimals);
      const amount = new TokenAmount(new Token(lpMint, lpDecimals), baseAmount);

      if (stakedBalance) {
        await unstakeLiquidity({
          router: mainRouter,
          secondaryReward,
          amount: baseAmount,
        });
      }

      await removeRaydiumLiquidity({
        baseToken,
        quoteToken: SOL_TOKEN,
        amount,
        poolConfig,
      });

      setWithdrawValue('');
    }
  };

  return (
    <div className={styles.withdraw}>
      <div className={styles.header}>
        <p className={styles.title}>Withdraw</p>
        <div className={styles.balanceWrap}>
          {stakedBalance ? (
            <p className={styles.balance}>Staked balance: {stakedBalance}</p>
          ) : (
            <p className={styles.balance}>Balance: {balance}</p>
          )}
        </div>
      </div>
      <div className={styles.footer}>
        <TokenFieldWithBalance
          className={styles.input}
          value={withdrawValue}
          onValueChange={(nextValue) => setWithdrawValue(nextValue)}
          style={{ width: '100%' }}
          showMaxButton
          lpTokenSymbol={baseToken.symbol}
          lpBalance={stakedBalance ? stakedBalance : balance}
        />
        <Button
          type="tertiary"
          className={styles.rewardBtn}
          onClick={onSubmitHandler}
          disabled={!parseFloat(withdrawValue)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
