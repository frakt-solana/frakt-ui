import { FC, useState } from 'react';
import BN from 'bn.js';
import {
  LiquidityPoolKeysV4,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { TokenInfo } from '@solana/spl-token-registry';

import { TokenFieldWithBalance } from '../../../components/TokenField';
import { useUserTokens } from '../../../contexts/userTokens';
import { SOL_TOKEN } from '../../../utils';
import Button from '../../../components/Button';
import styles from './styles.module.scss';
import {
  ProgramAccountData,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';

interface WithdrawInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
  programAccount: ProgramAccountData;
}

const Withdraw: FC<WithdrawInterface> = ({
  baseToken,
  poolConfig,
  raydiumPoolInfo,
  programAccount,
}) => {
  const { removeRaydiumLiquidity, unstakeLiquidity } = useLiquidityPools();
  const { rawUserTokensByMint } = useUserTokens();
  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const quoteToken = SOL_TOKEN;

  const { lpMint } = poolConfig;
  const { lpDecimals } = raydiumPoolInfo;

  const tokenLpInfo = rawUserTokensByMint[poolConfig.lpMint.toBase58()];
  const balance = String(Number(tokenLpInfo?.amount) / 10 ** lpDecimals || 0);

  const baseAmount = new BN(Number(withdrawValue) * 10 ** lpDecimals);

  const amount = new TokenAmount(new Token(lpMint, lpDecimals), baseAmount);

  const onSubmitHandler = async (): Promise<void> => {
    if (programAccount) {
      const { mainRouter, stakeAccount } = programAccount;

      await unstakeLiquidity({
        router: mainRouter,
        stakeAccount,
      });

      await removeRaydiumLiquidity({
        baseToken,
        quoteToken,
        amount,
        poolConfig,
      });
    }
  };

  return (
    <div className={styles.withdraw}>
      <div className={styles.header}>
        <p className={styles.title}>Withdraw</p>
        <p className={styles.balance}>Balance: {balance}</p>
      </div>
      <div className={styles.footer}>
        <TokenFieldWithBalance
          className={styles.input}
          value={withdrawValue}
          onValueChange={(nextValue) => setWithdrawValue(nextValue)}
          style={{ width: '100%' }}
          showMaxButton
          lpTokenSymbol={baseToken.symbol}
          lpBalance={balance}
        />
        <Button
          type="tertiary"
          className={styles.rewardBtn}
          onClick={onSubmitHandler}
          disabled={!parseFloat(balance) || !parseFloat(withdrawValue)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
