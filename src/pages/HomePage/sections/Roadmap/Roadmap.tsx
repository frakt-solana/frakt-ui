import styles from './styles.module.scss';

const STEPS = [
  {
    title: 'Unlock liquidity',
    description:
      'To completely unlock NFTs liquidity, fractions and derivatives should be tradable. For this reason we connected our app to Serum and built swaps on top of Raydium to provide luquidity and tools for NFT owners',
    checked: true,
  },
  {
    title: 'Baskets and Pools',
    description:
      'Users will be able to transform any NFT collection into a tradable asset with guaranteed liquidity. Make tradeable collections of any sizes, however many NFTs they want to combine. It allows to create on-chain NFT funds, DAO treasures, NFT indexes and NFT ETFs',
    checked: false,
  },
  {
    title: 'Farming',
    description:
      'Eventually we bringing  even more utility to NFT collections tokens, by having liquidity pools and farming on the platform. You can provide liquidity to your favourite collection liquidity pool and earn rewards in $FRKT and collection tokens',
    checked: false,
  },
  {
    title: 'Secret Stage',
    description:
      'Open ___ ___ ___ to borrow ___ and use ___ __ ______ for ___ p2p',
    checked: false,
  },
  {
    title: 'Another Secret Stage',
    description: `___ this infrastructure to ___, ___ and ___. All ___ by Solana's speed ___ ___ ___ DeFi product explode __ __ NFT and DeFi-oriented communities`,
    checked: false,
  },
];

const Roadmap = (): JSX.Element => {
  return (
    <div className={styles.root}>
      <h2 className={styles.title}>Roadmap</h2>
      <div className={styles.roadmap}>
        {STEPS.map(({ title, description, checked }, idx) => (
          <div
            key={idx}
            className={`${styles.item} ${checked ? styles.item_checked : ''}`}
          >
            <div className={styles.item__content}>
              <h3 className={styles.item__title}>{title}</h3>
              <p>{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
