import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import classNames from 'classnames/bind';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Loader } from '../../components/Loader';
import { useFraktion, VaultState } from '../../contexts/fraktion';
import { InfoTable } from './InfoTable';
import styles from './styles.module.scss';
import { Buyout } from './Buyout';
import { Redeem } from './Redeem';
import { useTokenMap } from '../../contexts/TokenList';
import { TradeTab } from './TradeTab';
import { SwapTab } from './SwapTab';
import { DetailsHeader } from './DetailsHeader';

const VaultPage = (): JSX.Element => {
  const [tab, setTab] = useState<tabType>('trade');
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();
  const tokenMap = useTokenMap();

  const vaultInfo = useMemo(() => {
    return vaults.find(({ publicKey }) => publicKey === vaultPubkey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);

  const vaultMarket = useMemo(() => {
    return vaultsMarkets.find(
      ({ baseMint }) => baseMint === vaultInfo.fractionMint,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultInfo]);

  const [tokerName, setTokerName] = useState<string>('');

  useEffect(() => {
    !loading &&
      vaultInfo &&
      setTokerName(tokenMap.get(vaultInfo.fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, vaultInfo]);

  return (
    <AppLayout>
      <Container component="main" className={styles.wrapper}>
        {loading && (
          <div className={styles.loading}>
            <Loader size="large" />
          </div>
        )}
        {!loading && !!vaultInfo && (
          <div className={styles.content}>
            <DetailsHeader
              className={styles.detailsHeaderMobile}
              vaultInfo={vaultInfo}
              tokerName={tokerName}
            />
            <div className={styles.col}>
              <div
                className={styles.image}
                style={{
                  backgroundImage: `url(${vaultInfo.imageSrc})`,
                }}
              />
              <div className={styles.mainInfoWrapper}>
                {!!vaultInfo?.description && (
                  <div className={styles.description}>
                    {vaultInfo.description}
                  </div>
                )}
                {!!vaultInfo?.nftAttributes?.length && (
                  <div className={styles.attributesTable}>
                    {vaultInfo?.nftAttributes.map(
                      ({ trait_type, value }, idx) => (
                        <div key={idx} className={styles.attributesTable__row}>
                          <p>{trait_type}</p>
                          <p>{value}</p>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className={styles.details}>
              <DetailsHeader
                className={styles.detailsHeaderDesc}
                vaultInfo={vaultInfo}
                tokerName={tokerName}
              />
              <InfoTable
                vaultInfo={vaultInfo}
                marketId={vaultMarket?.address}
              />
              {vaultInfo.state === VaultState[1] && (
                <>
                  <Tabs tab={tab} setTab={setTab} />
                  <div className={styles.tabContent}>
                    {tab === 'trade' && (
                      <TradeTab
                        vaultInfo={vaultInfo}
                        tokerName={tokerName}
                        vaultMarketAddress={vaultMarket?.address}
                      />
                    )}
                    {tab === 'swap' && (
                      <SwapTab fractionMint={vaultInfo.fractionMint} />
                    )}
                    {tab === 'buyout' && <Buyout vaultInfo={vaultInfo} />}
                  </div>
                </>
              )}
              {vaultInfo.state === VaultState[2] && (
                <Redeem vaultInfo={vaultInfo} />
              )}
              {vaultInfo.state === VaultState[3] && (
                <div className={styles.detailsPlaceholder} />
              )}
            </div>
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

type tabType = 'trade' | 'swap' | 'buyout';

interface TabsProps {
  tab: tabType;
  setTab: (tab: tabType) => void;
}

const Tabs = ({ tab, setTab }: TabsProps): JSX.Element => {
  return (
    <div className={styles.tabs}>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'trade' },
        ])}
        name="trade"
        onClick={() => setTab('trade')}
      >
        Trade
      </button>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'swap' },
        ])}
        name="swap"
        onClick={() => setTab('swap')}
      >
        Swap
      </button>
      <button
        className={classNames([
          styles.tab,
          { [styles.tabActive]: tab === 'buyout' },
        ])}
        name="buyout"
        onClick={() => setTab('buyout')}
      >
        Buyout
      </button>
    </div>
  );
};

export default VaultPage;
