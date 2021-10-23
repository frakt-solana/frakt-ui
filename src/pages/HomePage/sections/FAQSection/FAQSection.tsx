import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface FAQSectionProps {
  className?: string;
}

const FAQSection = ({ className }: FAQSectionProps): JSX.Element => {
  return (
    <div className={classNames([styles.faq, className])}>
      <h2 className={styles.title}>Frequently asked questions</h2>
      <div className={styles.tab}>
        <input type="checkbox" id="tab1" />
        <label className={styles.tabLabel} htmlFor="tab1">
          What is Fraktion.art?
        </label>
        <div className={styles.tabContent}>
          It’s an open source protocol that anyone can use to fractionalise or
          break into parts an NFT token on Solana. It was built by the team
          behind Frakt.art with help from the team at Metaplex and it is part of
          the Frakt ecosystem.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab2" />
        <label className={styles.tabLabel} htmlFor="tab2">
          What is fractionalisation?
        </label>
        <div className={styles.tabContent}>
          Fractionalisation is splitting up an NFT into fractions. In short the protocol locks the NFT in a vault and emits tokens representing parts of the original NFT. Those SPL tokens are emitted to the owner of the original NFT so they own all the fractions of the original NFT.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab3" />
        <label className={styles.tabLabel} htmlFor="tab3">
          Why fractionalise NFTs?
        </label>
        <div className={styles.tabContent}>
          Fractionalisation solves two problems for two types of people: for NFT
          owners it helps them free up liquidity which they can use to pursue
          other ventures and for people wanting to buy or invest in NFTs it
          allows them to acquire parts of much more expensive NFTs which are
          fractionalised.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab4" />
        <label className={styles.tabLabel} htmlFor="tab4">
          Can people fractionalise any NFT?
        </label>
        <div className={styles.tabContent}>
          The short answer is yes. But Fraktion.art has a built-in security
          mechanism that only allows fractionalisation of NFTs belonging to the
          original collection. That means we check NFTs for authenticity in
          order to prevent scams.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab5" />
        <label className={styles.tabLabel} htmlFor="tab5">
          Once I get fractions of an NFT what can I do with them?
        </label>
        <div className={styles.tabContent}>
          The fractions will be tokens that you cutodially own in your own
          wallet. That means you can hold on to them and get exposure to the
          price of the original NFT, you can trade them OTC or on Serum DEX if
          there are liquidity pools put in place, you can even gift them to
          friends, basically you can do anything you want with them, just like
          with any tokens you own. In the case the original NFT gets sold you
          can exchange them for SOL in the protocol.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab6" />
        <label className={styles.tabLabel} htmlFor="tab6">
          Is my NFT safe while it’s fractonalised?
        </label>
        <div className={styles.tabContent}>
          Yes. Each fractionalised NFT is stored in a separate vault and locked
          until the buyout procedure is completed. While it is fractionalised it
          cannot be accessed or traded, it’s locked away in the vault. This
          guarantees the unbreakable connection between the value of the
          fractionalised asset and the fractions.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab7" />
        <label className={styles.tabLabel} htmlFor="tab7">
          Can I buy fractions from different NFTs?
        </label>
        <div className={styles.tabContent}>
          Yes, you can in fact even make a portfolio of fractions from different
          NFTs and in this way get exposure to all projects you are interested
          in. Once you purchase the tokens representing the fractions you will
          custodially one them so they will show up in your wallet.
        </div>
      </div>

      <div className={styles.tab}>
        <input type="checkbox" id="tab8" />
        <label className={styles.tabLabel} htmlFor="tab8">
          Is the protocol safe?
        </label>
        <div className={styles.tabContent}>
          The code of the protocol is open source, available to audit and it is
          based on the code of Metaplex. There have been no hacks on the
          Metaplex platform so far.
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
