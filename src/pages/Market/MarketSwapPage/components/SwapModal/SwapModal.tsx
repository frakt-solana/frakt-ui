import { FC, useState } from 'react';
import styles from './styles.module.scss';
import {
  CloseModalIcon,
  QuestionIcon,
  SwapMarketIcon,
} from '../../../../../icons';
import classNames from 'classnames';
import { UserNFTWithCollection } from '../../../../../contexts/userTokens';
import Button from '../../../../../components/Button';

interface SwapModalProps {
  nft?: UserNFTWithCollection;
  onDeselect?: () => void;
  onSubmit: () => void;
  randomPoolImage?: string;
}

export const SwapModal: FC<SwapModalProps> = ({
  nft,
  onDeselect,
  onSubmit,
  randomPoolImage,
}) => {
  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.visible]: !!nft,
        [styles.modalDown]: isModalDown && !!nft,
      })}
    >
      <SwapModalItem
        name={nft?.metadata.name}
        collectionName={nft?.collectionName}
        image={nft?.metadata.image}
        onHeaderClick={() => setIsModalDown(!isModalDown)}
        onDeselect={onDeselect}
      />

      <div className={styles.separator}>
        <SwapMarketIcon className={styles.swapIcon} />
      </div>

      <SwapModalItem
        headerText="Swap to"
        name="Random"
        randomPoolImage={randomPoolImage}
      />

      <div className={styles.swapBtnWrapper}>
        <Button
          type="alternative"
          className={styles.swapBtn}
          onClick={onSubmit}
        >
          Swap
        </Button>
      </div>
    </div>
  );
};

interface SwapModalItemProps {
  headerText?: string;
  name?: string;
  collectionName?: string;
  image?: string;
  onHeaderClick?: () => void;
  onDeselect?: () => void;
  randomPoolImage?: string;
}

const SwapModalItem: FC<SwapModalItemProps> = ({
  headerText = 'Swap from',
  name,
  image,
  collectionName,
  onHeaderClick = () => {},
  onDeselect,
  randomPoolImage,
}) => {
  return (
    <div className={styles.item}>
      <div className={styles.itemHeader} onClick={onHeaderClick}>
        {headerText}
      </div>
      <div className={styles.itemContent}>
        <div className={styles.itemInfo}>
          {randomPoolImage ? (
            <div
              className={styles.questionImg}
              style={{ backgroundImage: `url(${randomPoolImage})` }}
            >
              <QuestionIcon
                className={styles.questionIcon}
                width={25}
                height={44}
              />
            </div>
          ) : (
            <div
              className={styles.itemImg}
              style={{ backgroundImage: `url(${image})` }}
            />
          )}

          <div className={styles.itemText}>
            <p className={styles.itemName}>{name}</p>
            {collectionName && (
              <p className={styles.itemCollection}>{collectionName}</p>
            )}
          </div>
          {onDeselect && (
            <div className={styles.itemDeselectWrapper} onClick={onDeselect}>
              <CloseModalIcon className={styles.itemDeselect} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
