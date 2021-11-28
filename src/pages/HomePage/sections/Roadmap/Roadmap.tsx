import styles from './styles.module.scss';

const STEPS = [
  {
    title: 'Staking',
    description:
      "Here's your chance to get involved with the FRAKT ecosystem. Stake your frakts and you will be eligible to vote in the FRAKT DAO, receive exclusive airdrops, access Launchpad lottery tickets, and earn yields from collection royalties and fraktionalizer fees",
    checked: true,
  },
  {
    title: 'Sandbox',
    description:
      'Sandbox is a platform to spotlight individual artists, incentivize staking and give utility to $FRKT. Every kurated collection launching on platform can be minted only with $FRKT. We provide guidance and curate every single project, help with exposure and technical execution of the launch.',
    checked: true,
  },
  {
    title: 'DAO',
    description:
      'You, our community, are our main focus. To be even more community-oriented, stakers will be able to vote for upcoming projects on the launchpad and will be able to take part in key future decisions',
    checked: false,
  },
  {
    title: 'Fraktionalizer',
    description:
      'As one of the first builders in the Solana NFT space, we aim to grow its ecosystem even further with a platform to split NFTs and trade fractions on a DEX and AMM. Stakers earn a portion of fees generated',
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
