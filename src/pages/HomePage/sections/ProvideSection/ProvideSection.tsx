import { FC } from 'react';

import { FraktGuardIcon } from '../../../../icons/FraktGuardIcon';
import { FraktSdkIcon } from '../../../../icons/FraktSdkIcon';
import { FraktNftApi } from '../../../../icons/FraktNftApi';
import { Container } from '../../../../components/Layout';
import Button from '../../../../components/Button';
import styles from './ProvideSection.module.scss';

interface ProvideSectionProps {
  navRef?: { current: HTMLParagraphElement };
}

export const ProvideSection: FC<ProvideSectionProps> = ({ navRef }) => {
  return (
    <Container component="section" className={styles.root}>
      <h3 className={styles.title} ref={navRef}>
        We also provide infrastructure
      </h3>
      <h4 className={styles.subtitle}>Empowering 15 projects across Solana</h4>
      <div className={styles.wrapper}>
        <div className={styles.column}>
          <FraktGuardIcon />
          <h5 className={styles.columnTitle}>FRAKT Guard</h5>
          <p className={styles.desc}>
            Locked liquidity launch for NFT collections to prevent hard and soft
            rugs
          </p>
          <Button className={styles.btn} type="alternative">
            Request
          </Button>
        </div>
        <div className={styles.column}>
          <FraktSdkIcon />
          <h5 className={styles.columnTitle}>FRAKT-sdk</h5>
          <p className={styles.desc}>
            Create, manage and use vaults and pools with our SDK
          </p>
          <Button className={styles.btn} type="alternative">
            Explore
          </Button>
        </div>
        <div className={styles.column}>
          <FraktNftApi />
          <h5 className={styles.columnTitle}>NFT API</h5>
          <p className={styles.desc}>
            Easy and perfomant fetching of Solana NFTs
          </p>
          <Button className={styles.btn} type="alternative">
            Explore
          </Button>
        </div>
      </div>
    </Container>
  );
};
