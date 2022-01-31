import { FC, useState } from 'react';

import { TokenFieldWithBalance } from '../../../components/TokenField';
import { TokenInfo } from '@solana/spl-token-registry';
import Button from '../../../components/Button';
import styles from './styles.module.scss';
import {
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import BN from 'bn.js';
import {
  LiquidityPoolKeysV4,
  Token,
  TokenAmount,
} from '@raydium-io/raydium-sdk';
import { useUserTokens } from '../../../contexts/userTokens';
import { SOL_TOKEN } from '../../../utils';

interface WithdrawInterface {
  baseToken: TokenInfo;
  poolConfig: LiquidityPoolKeysV4;
  raydiumPoolInfo: RaydiumPoolInfo;
}

const Withdraw: FC<WithdrawInterface> = ({
  baseToken,
  poolConfig,
  raydiumPoolInfo,
}) => {
  const { removeRaydiumLiquidity } = useLiquidityPools();
  const { rawUserTokensByMint } = useUserTokens();

  const [withdrawValue, setWithdrawValue] = useState<string>('');
  const quoteToken = SOL_TOKEN;

  const { lpMint } = poolConfig;
  const { lpDecimals } = raydiumPoolInfo;

  const tokenLpInfo = rawUserTokensByMint[poolConfig.lpMint.toBase58()];
  const balance = String(Number(tokenLpInfo?.amount) / 10 ** lpDecimals);

  const baseAmount = new BN(Number(withdrawValue) * 10 ** lpDecimals);

  const amount = new TokenAmount(new Token(lpMint, lpDecimals), baseAmount);

  const onSubmitHandler = () => {
    removeRaydiumLiquidity({
      baseToken,
      quoteToken,
      amount,
      poolConfig,
    });
  };

  return (
    <div className={styles.withdraw}>
      <div className={styles.header}>
        <p className={styles.title}>Withdraw</p>
        <p className={styles.balance}>Balance: {balance || 0}</p>
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
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

export default Withdraw;
