import { useMemo } from 'react';
import { useParams } from 'react-router';

import Badge from '../../components/Badge';
import { Container } from '../../components/Layout';
import { AppLayout } from '../../components/Layout/AppLayout';
import { Loader } from '../../components/Loader';
import { useFraktion } from '../../contexts/fraktion/fraktion.context';
import { shortenAddress } from '../../external/utils/utils';
import { DoneIcon } from '../../icons';
import { InfoTable } from './InfoTable';
import styles from './styles.module.scss';

const VaultPage = (): JSX.Element => {
  const { vaultPubkey } = useParams<{ vaultPubkey: string }>();
  const { loading, vaults } = useFraktion();

  const vaultInfo = useMemo(() => {
    return vaults.find(({ publicKey }) => publicKey === vaultPubkey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaults]);

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
            <div
              className={styles.image}
              style={{
                backgroundImage: `url(${vaultInfo.imageSrc})`,
              }}
            />

            <div className={styles.details}>
              <h2 className={styles.title}>{vaultInfo.name}</h2>
              <div className={styles.statusAndOwner}>
                <div className={styles.status}>
                  <DoneIcon />
                  <Badge label={vaultInfo.state} className={styles.badge} />
                </div>
                <div className={styles.owner}>
                  {shortenAddress(vaultInfo.authority)}
                </div>
              </div>
              <InfoTable vaultInfo={vaultInfo} />
            </div>
          </div>
        )}
      </Container>
    </AppLayout>
  );
};

export default VaultPage;
