import { FC } from 'react';
import { NavLink } from 'react-router-dom';

import Button from '../../../../components/Button';
import { Container } from '../../../../components/Layout';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { PATHS } from '../../../../constants';
import { sendAmplitudeData } from '../../../../utils/amplitude';
import styles from './MainSection.module.scss';

export const MainSection: FC = () => {
  return (
    <div className={styles.bg}>
      <Container component="section" className={styles.root}>
        <h1 className={styles.title}>
          DEFI<span>x</span>NFT
        </h1>
        <h2 className={styles.subtitle}>
          Buy, sell, earn yield and get instant liquidity out of your NFTs.{' '}
          <br /> Oh, and get rewarded in the process!
        </h2>
        <NavLink to={PATHS.LOANS}>
          <Button
            className={styles.btn}
            type="alternative"
            onClick={() => sendAmplitudeData('landingpage-launch')}
          >
            Try it out!
          </Button>
        </NavLink>
        <LinkWithArrow
          externalLink
          to="https://docs.frakt.xyz"
          label="Read docs"
          className={styles.docsLink}
        />
      </Container>
    </div>
  );
};
