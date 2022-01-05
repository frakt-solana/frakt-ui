import { FC, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useForm } from 'react-hook-form';

import DepositModal from '../../components/DepositModal/DepositModal';
import { ControlledSelect } from '../../components/Select/Select';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { AppLayout } from '../../components/Layout/AppLayout';
import { useWalletModal } from '../../contexts/WalletModal';
import { SearchInput } from '../../components/SearchInput';
import { Container } from '../../components/Layout';
import { ArrowDownSmallIcon, ChevronDownIcon } from '../../icons';
import Button from '../../components/Button';
import { useDebounce } from '../../hooks';
import styles from './styles.module.scss';

const SORT_VALUES = [
  {
    label: (
      <span>
        Liquidity (asc) <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'liquidity_asc',
  },
  {
    label: (
      <span>
        Liquidity (dsc) <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'liquidity_desc',
  },
  {
    label: (
      <span>
        Trading Vol. (asc) <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'trading_asc',
  },
  {
    label: (
      <span>
        Trading Vol. (dsc) <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'trading_desc',
  },
  {
    label: (
      <span>
        APR (asc) <ArrowDownSmallIcon className={styles.arrowUp} />
      </span>
    ),
    value: 'apr_asc',
  },
  {
    label: (
      <span>
        APR (dsc) <ArrowDownSmallIcon className={styles.arrowDown} />
      </span>
    ),
    value: 'apr_desc',
  },
];

const LiquidityPage: FC = () => {
  const [searchString, setSearchString] = useState<string>('');
  const [visibleBlock, setVisibleBlock] = useState<boolean>(true);
  const [depositModalVisible, setDepositModalVisible] =
    useState<boolean>(false);
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();

  const searchItems = useDebounce((search: string) => {
    setSearchString(search.toUpperCase());
  }, 300);

  const { control } = useForm({
    defaultValues: {
      showStaked: true,
      showAwarded: true,
      sort: SORT_VALUES[0],
    },
  });

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Liquidity</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchInput
            size="large"
            onChange={(e) => searchItems(e.target.value || '')}
            className={styles.search}
            placeholder="Filter by symbol"
          />
          <div className={styles.filtersWrapper}>
            <div className={styles.filters}>
              <ControlledToggle
                control={control}
                name="showStaked"
                label="Staked only"
                className={styles.filter}
              />
              <ControlledToggle
                control={control}
                name="showAwarded"
                label="Awarded"
                className={styles.filter}
              />
            </div>
            <div>
              <ControlledSelect
                valueContainerClassName={styles.sortingSelectValueContainer}
                label="Sort by"
                control={control}
                name="sort"
                options={SORT_VALUES}
              />
            </div>
          </div>
        </div>

        <div className={styles.pool}>
          <div className={styles.header}>
            <Button className={styles.awarderBtn}>Awarded</Button>
          </div>
          <div>
            <div className={styles.body}>
              <div className={styles.subtitle}>SOL / FRKT</div>
              <div className={styles.statsValue}>
                <div>
                  <p className={styles.title}>Total liquidity</p>
                  <p className={styles.value}>$ 120 120 000</p>
                </div>
                <div>
                  <p className={styles.title}>Apr</p>
                  <p className={styles.value}>30%</p>
                </div>
                <div>
                  <div onClick={() => setVisibleBlock((prev) => !prev)}>
                    <ChevronDownIcon className={styles.chevronVisibleIcon} />
                  </div>
                </div>
              </div>
            </div>
            {visibleBlock && (
              <div className={styles.hiddenBlock}>
                {connected ? (
                  <>
                    <div className={styles.withdraw}>
                      <div className={styles.withdrawHeader}>
                        <h2 className={styles.title}>Withdraw</h2>
                        <h2 className={styles.title}>Balance: 250.325246317</h2>
                      </div>
                      <div className={styles.footer}>
                        <div className={styles.stats}>
                          <p>0.023423</p>
                          <Button className={styles.maxBtn}>USE MAX</Button>
                          <p className={styles.name}>SOL / FRKT</p>
                        </div>
                        <Button className={styles.btn}>Confirm</Button>
                      </div>
                    </div>
                    <div className={styles.pending}>
                      <h2 className={styles.title}>Pending rewards</h2>
                      <div className={styles.pendingBody}>
                        <div>
                          <p>0.0 SOL</p>
                          <p>0.0 FRKT</p>
                        </div>
                        <Button className={styles.btn}>Harvest</Button>
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
          </div>
          <DepositModal
            visible={depositModalVisible}
            onCancel={() => setDepositModalVisible(false)}
          />
        </div>
      </Container>
    </AppLayout>
  );
};

export default LiquidityPage;
