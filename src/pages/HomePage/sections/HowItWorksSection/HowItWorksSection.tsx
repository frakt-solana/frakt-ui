import classNames from 'classnames/bind';
import { useState } from 'react';

import styles from './styles.module.scss';

interface HowItWorksSectionProps {
  className?: string;
}

const HowItWorksSection = ({
  className,
}: HowItWorksSectionProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState<'owner' | 'buyer'>('owner');

  const onTabButtonClick = () => {
    setActiveTab((prevValue) => (prevValue === 'owner' ? 'buyer' : 'owner'));
  };

  return (
    <div className={classNames([styles.howItWorks, className])}>
      <div className={styles.howItWorksLeft}>
        <h2 className={styles.title}>How it works?</h2>
        <div className={styles.tabButtons}>
          <button
            onClick={onTabButtonClick}
            type="button"
            className={classNames([
              styles.tabButton,
              { [styles.tabButtonActive]: activeTab === 'owner' },
            ])}
          >
            For NFT owner
          </button>
          <button
            onClick={onTabButtonClick}
            type="button"
            className={classNames([
              styles.tabButton,
              { [styles.tabButtonActive]: activeTab === 'buyer' },
            ])}
          >
            For Fraktions buyers
          </button>
        </div>
        <p className={styles.subtitle}>
          The NFT is bought if 100% of the buyout price is paid by someone. Once
          the original NFT is sold the fraktion holders get paid by the protocol
          from the payout proportionally to the parts they hold. They exchange
          their parts for the payout.
        </p>
      </div>
      <div className={styles.howItWorksRight}>
        <div
          className={classNames([
            styles.steps,
            { [styles.stepsHidden]: activeTab === 'buyer' },
          ])}
        >
          <p>The NFT owner decides on supply, ticket, and buyout price.</p>
          <p>
            The protocol locks the NFT in a Vault and issues tokens to the owner
            in exchange.
          </p>
          <p>
            The owner can airdrop the tokens, share them with friends, or trade
            on DEX.
          </p>
        </div>
        <div
          className={classNames([
            styles.steps,
            { [styles.stepsHidden]: activeTab === 'owner' },
          ])}
        >
          <p>
            If user wants to own a fraktion of a certain NFT they can buy it
            from the issuer OTC, buy it from a market on DEX, get it airdropped,
            etc.
          </p>
          <p>
            The user then has custodial ownership of the tokens and can then
            keep them or trade them.
          </p>
          <p>
            Once the original NFT gets sold, users with fraktion tokens can
            exchange them in the protocol for a proportional compensation. (e.g.
            if user has 16% of a 300 SOL SMB they get 48 SOL from the protocol
            in exchange for their tokens).
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksSection;
