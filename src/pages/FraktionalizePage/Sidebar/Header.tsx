import { UserNFT } from '../../../contexts/userTokens';
import styles from './styles.module.scss';

interface HeaderProps {
  nfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
}

export const Header = ({ nfts, onDeselect }: HeaderProps): JSX.Element => {
  return (
    <div className={styles.sidebar__header}>
      <p className={styles.sidebar__title}>
        {nfts.length > 1 ? 'Your NFTs' : 'Your NFT'}
      </p>

      {!nfts.length ? (
        <>
          <div className={styles.sidebar__image}>
            <button className={styles.sidebar__removeBtn} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.sidebar__images}>
            {nfts.map((nft, idx) => (
              <div
                key={idx}
                className={styles.sidebar__image}
                style={{ backgroundImage: `url(${nft?.metadata?.image})` }}
              >
                <button
                  className={styles.sidebar__removeBtn}
                  onClick={() => onDeselect(nft)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.sidebar__separator} />
    </div>
  );
};
