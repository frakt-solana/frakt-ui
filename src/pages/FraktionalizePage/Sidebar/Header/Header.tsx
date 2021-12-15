import { UserNFT } from '../../../../contexts/userTokens';
import styles from './styles.module.scss';

interface HeaderProps {
  nfts: UserNFT[];
  onDeselect?: (nft: UserNFT) => void;
}

export const Header = ({ nfts, onDeselect }: HeaderProps): JSX.Element => {
  return (
    <div className={styles.header}>
      <p className={styles.title}>
        {nfts.length > 1 ? 'Your NFTs' : 'Your NFT'}
      </p>

      {!nfts.length ? (
        <>
          <div className={styles.image}>
            <button className={styles.removeBtn} />
          </div>
        </>
      ) : (
        <>
          <div className={styles.images}>
            {nfts.map((nft, idx) => (
              <div
                key={idx}
                className={styles.image}
                style={{ backgroundImage: `url(${nft?.metadata?.image})` }}
              >
                <button
                  className={styles.removeBtn}
                  onClick={() => onDeselect(nft)}
                />
              </div>
            ))}
          </div>
        </>
      )}
      <div className={styles.separator} />
    </div>
  );
};
