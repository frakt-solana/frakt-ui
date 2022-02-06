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
import { notify, SOL_TOKEN } from '../../../utils';
import Button from '../../../components/Button';
import styles from './styles.module.scss';
import {
  ProgramAccountData,
  RaydiumPoolInfo,
  useLiquidityPools,
} from '../../../contexts/liquidityPools';
import { NotifyType } from '../../../utils/solanaUtils';

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
  const [visibleUnstakeBtn, setVisibleUnstakeBtn] = useState<boolean>(false);
  const quoteToken = SOL_TOKEN;

  const { lpMint } = poolConfig;
  const { lpDecimals } = raydiumPoolInfo;

  const tokenLpInfo = rawUserTokensByMint[poolConfig.lpMint.toBase58()];
  const balance = String(Number(tokenLpInfo?.amount) / 10 ** lpDecimals || 0);

  const baseAmount = new BN(Number(withdrawValue) * 10 ** lpDecimals);

  const amount = new TokenAmount(new Token(lpMint, lpDecimals), baseAmount);

  const onSubmitHandler = async (): Promise<void> => {
    if (programAccount) {
      const { router, stakeAccount } = programAccount;

      try {
        if (balance && stakeAccount.amount) {
          await unstakeLiquidity({
            router,
            stakeAccount,
          });
          await removeRaydiumLiquidity({
            baseToken,
            quoteToken,
            amount,
            poolConfig,
          });
        }
        notify({
          message: 'Liquidity withdrawn successfully',
          type: NotifyType.SUCCESS,
        });
      } catch (error) {
        setVisibleUnstakeBtn(true);
        // eslint-disable-next-line no-console
        console.error(error);

        notify({
          message: 'Transaction failed',
          type: NotifyType.ERROR,
        });
      }
    }
  };

  const onRemoveLiquidityHandler = async () => {
    try {
      await removeRaydiumLiquidity({
        baseToken,
        quoteToken,
        amount,
        poolConfig,
      });

      notify({
        message: 'Liquidity withdrawn successfully',
        type: NotifyType.SUCCESS,
      });

      setVisibleUnstakeBtn(false);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);

      notify({
        message: 'Transaction failed',
        type: NotifyType.ERROR,
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
        {visibleUnstakeBtn && (
          <Button
            type="tertiary"
            className={styles.rewardBtn}
            onClick={onRemoveLiquidityHandler}
          >
            unstake
          </Button>
        )}
      </div>
    </div>
  );
};

export default Withdraw;
