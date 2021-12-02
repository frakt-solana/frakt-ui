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
      <h2 className={styles.title}>The process</h2>
      <div className={styles.tabButtons}>
        <button
          onClick={onTabButtonClick}
          type="button"
          className={classNames([
            styles.tabButton,
            { [styles.tabButtonActive]: activeTab === 'owner' },
          ])}
        >
          I want
          <br />
          to fraktionalize my NFT
        </button>
        <button
          onClick={onTabButtonClick}
          type="button"
          className={classNames([
            styles.tabButton,
            { [styles.tabButtonActive]: activeTab === 'buyer' },
          ])}
        >
          I want to
          <br />
          buy fraktions
        </button>
      </div>
      <div
        className={classNames([
          styles.steps,
          { [styles.stepsHidden]: activeTab === 'buyer' },
        ])}
      >
        <p>
          As you’re about to fraktionalize your NFT, you decide on supply,
          ticker and buyout price.
        </p>
        <p>
          Once the transaction has been confirmed, the protocol locks the NFT in
          a vault and issues SPL tokens to your wallet in exchange.
        </p>
        <p>
          You can now do as you please with your tokens! Airdrop them, share
          them with your community, or trade them on our DEX.
        </p>
      </div>
      <div
        className={classNames([
          styles.steps,
          { [styles.stepsHidden]: activeTab === 'owner' },
        ])}
      >
        <p>
          If you’re willing to buy fraktions of a certain NFT, you can get them
          OTC from the issuer or buy them on our DEX.
        </p>
        <p>
          Once you have purchased fraktions, you have custodial ownership of
          them and can keep them or trade them as you please.
        </p>
        <p>
          If the original NFT gets sold through the buyout procedure, each
          fraktions token holders can exchange them for a proportional reward
          through the protocol.
        </p>
      </div>
      <p className={styles.info}>
        The NFT is bought out if 100% of the buyout price (incl. fees) is paid
        by someone. Once the original NFT is sold, the fraktions holders get
        paid out by the protocol proportionally to the shares that they hold,
        which are in returned claimed by the protocol to allow the buyer to gain
        full custody of the NFT.
      </p>
    </div>
  );
};

export default HowItWorksSection;
