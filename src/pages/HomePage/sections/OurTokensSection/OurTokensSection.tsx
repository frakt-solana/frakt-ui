import React, { FC } from 'react';
import styles from './styles.module.scss';
import { PortalIcon, TokensBg } from '../../svg';
import classNames from 'classnames';
import { OUR_TOKENS_ID } from '../../constants';

interface OurTokensSectionProps {
  className?: string;
  navRef?: { current: HTMLParagraphElement };
}

export const OurTokensSection: FC<OurTokensSectionProps> = ({
  className,
  navRef,
}) => {
  return (
    <section className={`section ${className}`}>
      <p className="itemForIntersectionMenu" id={OUR_TOKENS_ID} ref={navRef}>
        Our tokens
      </p>
      <div className={`container`}>
        <h2 className={styles.title}>Our tokens</h2>
        <div className={styles.wrapper}>
          <div className={classNames(styles.card, styles.cardGreen)}>
            <div className={styles.portalWrapper}>
              <PortalIcon />
            </div>
            <div className={styles.infoWrapper}>
              <h4 className={styles.titleCard}>$FRKT</h4>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>NFTs</li>
                <li className={styles.infoItem}>Community activities</li>
                <li className={styles.infoItem}>
                  Reward token for FRKX stakers
                </li>
                <li className={styles.infoItem}>Governance</li>
              </ul>
            </div>
            <TokensBg className={styles.cardBg} />
          </div>
          <div className={classNames(styles.card, styles.cardBlue)}>
            <div className={styles.portalWrapper}>
              <PortalIcon />
            </div>
            <div className={styles.infoWrapper}>
              <h4 className={styles.titleCard}>$FRKX</h4>
              <ul className={styles.infoList}>
                <li className={styles.infoItem}>Reduced fees</li>
                <li className={styles.infoItem}>Trading rewards</li>
                <li className={styles.infoItem}>Referrals rewards</li>
                <li className={styles.infoItem}>Lending rewards</li>
              </ul>
            </div>
            <TokensBg className={styles.cardBg} fill={'#5D5FEF'} />
          </div>
        </div>
      </div>
    </section>
  );
};
