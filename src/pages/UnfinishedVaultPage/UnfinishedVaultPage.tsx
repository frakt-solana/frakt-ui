import React, { FC, useEffect, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import stylesVaultPage from '../VaultPage/styles.module.scss';
import { AppLayout } from '../../components/Layout/AppLayout';
import NavigationLink from '../../components/Header/NavigationLink';
import { URLS } from '../../constants';
import { Container } from '../../components/Layout';
import { useParams } from 'react-router';
import { useFraktion, VaultData, VaultState } from '../../contexts/fraktion';
import { useTokenMap } from '../../contexts/TokenList';
import { Loader } from '../../components/Loader';
import { DetailsHeader } from '../VaultPage/DetailsHeader';
import { InfoTable } from '../VaultPage/InfoTable';
import { Redeem } from '../VaultPage/Redeem';
import classNames from 'classnames';
import { usePrivatePage } from '../../hooks';

export const UnfinishedVaultPage: FC = () => {
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults, vaultsMarkets } = useFraktion();
  const tokenMap = useTokenMap();

  const vaultData: VaultData = useMemo(() => {
    return vaults.find(
      ({ vaultPubkey: publicKey }) => publicKey === vaultPubkey,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);

  const vaultMarket = useMemo(() => {
    return vaultsMarkets.find(
      ({ baseMint }) => baseMint === vaultData.fractionMint,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultData]);

  const [tokerName, setTokerName] = useState<string>('');
  const noNameText = `Here's no name`;

  useEffect(() => {
    !loading &&
      vaultData &&
      setTokerName(tokenMap.get(vaultData.fractionMint)?.symbol || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenMap, vaultData]);

  const vaultImages = vaultData?.safetyBoxes.map((box) => box.nftImage);

  usePrivatePage();

  return (
    <AppLayout>
      <Container component="main" className={stylesVaultPage.wrapper}>
        {loading && (
          <div className={stylesVaultPage.loading}>
            <Loader size="large" />
          </div>
        )}
        <div className={styles.container}>
          {!loading && !!vaultData && (
            <div className={stylesVaultPage.content}>
              <DetailsHeader
                className={stylesVaultPage.detailsHeaderMobile}
                vaultData={vaultData}
                tokerName={tokerName ? tokerName : noNameText}
              />
              <div
                className={classNames(stylesVaultPage.col, {
                  [styles.noImage]: !vaultImages.length,
                })}
              >
                <div
                  className={stylesVaultPage.image}
                  style={{
                    backgroundImage: `url(${vaultImages[0]})`,
                  }}
                />
              </div>
              <div className={stylesVaultPage.details}>
                <DetailsHeader
                  className={stylesVaultPage.detailsHeaderDesc}
                  vaultData={vaultData}
                  tokerName={tokerName ? tokerName : noNameText}
                />
                <InfoTable
                  vaultInfo={vaultData}
                  marketId={vaultMarket?.address}
                />
                {vaultData.state === VaultState.Bought && (
                  <Redeem vaultInfo={vaultData} />
                )}
                {vaultData.state === VaultState.Closed && (
                  <div className={stylesVaultPage.detailsPlaceholder} />
                )}
                <ul className={styles.buttons}>
                  <li className={styles.btnItem}>
                    <NavigationLink
                      to={`${URLS.CONTINUE_FRAKTIONALIZE}/${vaultPubkey}`}
                    >
                      Add NFTs and launch vault
                    </NavigationLink>
                  </li>
                  {/*{!!vaultData?.safetyBoxes.length && (*/}
                  <li className={styles.btnItem}>
                    <button className={styles.launchVault}>Launch vault</button>
                  </li>
                  {/*)}*/}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Container>
    </AppLayout>
  );
};
