import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import Button from '../../../../components/Button';
import DepositModal from '../../../../components/DepositModal/DepositModal';
import { useWalletModal } from '../../../../contexts/WalletModal';
import { ChevronDownIcon } from '../../../../icons';
import { TokenFieldWithBalance } from '../../../../components/TokenField';
import { SOL_TOKEN } from '../../../../components/SwapForm/constants';
import { Token } from '../../../../utils';
import styles from './styles.module.scss';

interface PoolInterface {
  quoteToken: Token;
}

const Pool: FC<PoolInterface> = ({ quoteToken }) => {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [detailsBlock, setDetailsBlock] = useState<boolean>(false);
  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);
  const [payValue, setPayValue] = useState<string>('');
  const [baseToken, setBaseToken] = useState<Token | null>(SOL_TOKEN);

  return (
    <div className={styles.pool}>
      <div className={styles.header}>
        <Button className={styles.awarderBtn}>Awarded</Button>
      </div>
      <div className={styles.body}>
        <div className={styles.tokenInfo}>
          <div className={styles.tokensIcon}>
            <img className={styles.img} src={baseToken.img} />
            <img className={styles.img} src={quoteToken.img} />
          </div>
          <div className={styles.subtitle}>
            {baseToken.symbol} / {quoteToken.symbol}
          </div>
        </div>

        <div className={styles.statsValue}>
          <div>
            <p className={styles.title}>Total liquidity</p>
            <p className={styles.value}>$ 120 120 000</p>
          </div>
          <div>
            <p className={styles.title}>Apr</p>
            <p className={styles.value}>30%</p>
          </div>
          <div onClick={() => setDetailsBlock((prev) => !prev)}>
            <ChevronDownIcon className={styles.chevronVisibleIcon} />
          </div>
        </div>
      </div>
      {detailsBlock && (
        <div className={styles.poolDetails}>
          {connected ? (
            <>
              <div className={styles.withdraw}>
                <div className={styles.withdrawHeader}>
                  <p className={styles.title}>Withdraw</p>
                  <p className={styles.title} style={{ opacity: 0.3 }}>
                    Balance: 250.325246317
                  </p>
                </div>
                <div className={styles.footer}>
                  <div className={styles.inputWrapper}>
                    <TokenFieldWithBalance
                      className={styles.input}
                      value={payValue}
                      onValueChange={(nextValue) => setPayValue(nextValue)}
                      showMaxButton
                    />
                  </div>

                  <Button className={styles.rewardBtn}>Confirm</Button>
                </div>
              </div>
              <div className={styles.pending}>
                <p className={styles.title}>Pending rewards</p>
                <div className={styles.pendingInner}>
                  <div className={styles.pendingInfo}>
                    <p>
                      0.0 <span>{baseToken.symbol}</span>
                    </p>
                    <p>
                      0.0 <span>{quoteToken.symbol}</span>
                    </p>
                  </div>
                  <Button className={styles.rewardBtn}>Harvest</Button>
                </div>
              </div>
              <Button
                onClick={() => setDepositModalVisible(true)}
                className={styles.depositBtn}
                type="alternative"
              >
                Deposit
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setVisible(true)}
              className={styles.connectBtn}
            >
              Connect wallet
            </Button>
          )}
        </div>
      )}
      <DepositModal
        visible={depositModalVisible}
        onCancel={() => setDepositModalVisible(false)}
        quoteToken={quoteToken}
        baseToken={baseToken}
      />
    </div>
  );
};

export default Pool;
