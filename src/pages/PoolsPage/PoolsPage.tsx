import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { ControlledSelect } from '../../components/Select/Select';
import { ControlledToggle } from '../../components/Toggle/Toggle';
import { AppLayout } from '../../components/Layout/AppLayout';
import { SearchInput } from '../../components/SearchInput';
import { Container } from '../../components/Layout';
import styles from './styles.module.scss';
import Pool from './Pool';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../components/FakeInfinityScroll';
import { SORT_VALUES, InputControlsNames, usePoolsPage } from './hooks';
import { poolsDataTest, raydiumPoolInfoTest } from './testPoolData';

const PoolsPage: FC = () => {
  const { connected } = useWallet();
  const { itemsToShow, next } = useFakeInfinityScroll(9);
  const {
    formControl,
    loading,
    poolsData,
    raydiumPoolsInfoMap,
    searchItems,
    activePoolTokenAddress,
    onPoolCardClick,
    programAccount,
    poolsStatsByMarketId,
  } = usePoolsPage();

  return (
    <AppLayout>
      <Container component="main" className={styles.container}>
        <h1 className={styles.title}>Liquidity</h1>
        <div className={styles.sortWrapper}>
          <SearchInput
            size="large"
            onChange={(e) => searchItems(e.target.value || '')}
            className={styles.search}
            placeholder="Filter by symbol"
          />
          <div className={styles.filters}>
            {connected && (
              <ControlledToggle
                control={formControl}
                name={InputControlsNames.SHOW_STAKED}
                label="Staked only"
                className={styles.filter}
              />
            )}
            {/* <ControlledToggle
              control={formControl}
              name={InputControlsNames.SHOW_AWARDED_ONLY}
              label="Awarded only"
              className={styles.filter}
            /> */}
            <ControlledSelect
              valueContainerClassName={styles.sortingSelectContainer}
              className={styles.sortingSelect}
              control={formControl}
              name={InputControlsNames.SORT}
              label="Sort by"
              options={SORT_VALUES}
            />
          </div>
        </div>

        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          isLoading={!programAccount}
          emptyMessage={'No Liquidity pool found'}
        >
          {poolsDataTest.map(({ poolData, poolStatsTest }) => (
            <Pool
              key={poolData.tokenInfo.address}
              poolData={poolData}
              raydiumPoolInfo={raydiumPoolInfoTest}
              // raydiumPoolInfo={raydiumPoolsInfoMap.get(
              //   poolData.tokenInfo.address,
              // )}
              // poolStats={poolsStatsByMarketId.get(
              //   poolData.poolConfig.marketId.toBase58(),
              // )}
              poolStats={poolStatsTest}
              isOpen={activePoolTokenAddress === poolData.tokenInfo.address}
              onPoolCardClick={() =>
                onPoolCardClick(poolData.tokenInfo.address)
              }
              programAccount={programAccount}
            />
          ))}
        </FakeInfinityScroll>
      </Container>
    </AppLayout>
  );
};

export default PoolsPage;
