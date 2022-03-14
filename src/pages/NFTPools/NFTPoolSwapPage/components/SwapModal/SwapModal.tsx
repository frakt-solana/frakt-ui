import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';

import styles from './SwapModal.module.scss';
import { SwapMarketIcon } from '../../../../../icons';
import { UserNFTWithCollection } from '../../../../../contexts/userTokens';
import {
  CurrencySelector,
  ItemContent,
  ItemContentProps,
  ModalHeader,
  SubmitButton,
} from '../../../components/ModalParts';
import { useNativeAccount } from '../../../../../utils/accounts';
import { LAMPORTS_PER_SOL } from '../../../../../utils/solanaUtils';

interface SwapModalProps {
  nft?: UserNFTWithCollection;
  onDeselect?: () => void;
  onSubmit: () => void;
  randomPoolImage?: string;
  poolTokenAvailable: boolean;
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

enum Price {
  SOL = 0.3,
  POOL_TOKEN = 0.02,
}

export const SwapModal: FC<SwapModalProps> = ({
  nft,
  onDeselect,
  onSubmit,
  randomPoolImage,
  poolTokenAvailable,
}) => {
  const { account } = useNativeAccount();

  const solBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  const [token, setToken] = useState<Token>(Token.SOL);

  useEffect(() => {
    poolTokenAvailable && setToken(Token.POOL_TOKEN);
  }, [poolTokenAvailable]);

  const isSolTokenSelected = token === Token.SOL;

  const slippageText =
    token === Token.SOL
      ? `* Max total (with slippage) = ${(Price.SOL * 0.98).toFixed(3)} SOL`
      : '';

  const isBtnDisabled =
    (!isSolTokenSelected && !poolTokenAvailable) ||
    (isSolTokenSelected && solBalance < Price.SOL);

  const price = isSolTokenSelected ? Price.SOL : Price.POOL_TOKEN;

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
        setSlippage={isSolTokenSelected && !isModalDown && ((num) => num)}
      />

      <div className={styles.separator}>
        <SwapMarketIcon className={styles.swapIcon} />
      </div>

      <SwapModalItem
        headerText="Swap to"
        name="Random"
        randomPoolImage={randomPoolImage}
      />

      <CurrencySelector
        token={token}
        setToken={setToken}
        price={price.toFixed(3)}
        slippageText={slippageText}
        label="Fee"
      />

      <SubmitButton
        text="Swap"
        onClick={onSubmit}
        wrapperClassName={styles.swapBtnWrapper}
        disabled={isBtnDisabled}
      />
    </div>
  );
};

interface SwapModalItemProps extends ItemContentProps {
  headerText?: string;
  onHeaderClick?: () => void;
  setSlippage?: (num: number) => void;
}

const SwapModalItem: FC<SwapModalItemProps> = ({
  headerText = 'Swap from',
  name,
  image,
  collectionName,
  onHeaderClick = () => {},
  onDeselect,
  randomPoolImage,
  setSlippage,
}) => {
  return (
    <div className={styles.item}>
      <ModalHeader
        onHeaderClick={onHeaderClick}
        headerText={headerText}
        setSlippage={setSlippage}
      />

      <ItemContent
        className={styles.itemContent}
        name={name}
        image={image}
        collectionName={collectionName}
        onDeselect={onDeselect}
        randomPoolImage={randomPoolImage}
      />
    </div>
  );
};
