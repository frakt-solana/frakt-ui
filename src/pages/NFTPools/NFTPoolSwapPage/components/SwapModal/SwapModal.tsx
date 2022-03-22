import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { TokenInfo } from '@solana/spl-token-registry';

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
import { SELL_COMMISSION_PERCENT } from '../../../constants';

interface SwapModalProps {
  nft?: UserNFTWithCollection;
  onDeselect?: () => void;
  onSubmit: (needSwap?: boolean) => void;
  randomPoolImage?: string;
  poolTokenAvailable: boolean;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

export const SwapModal: FC<SwapModalProps> = ({
  nft,
  onDeselect,
  onSubmit,
  randomPoolImage,
  poolTokenAvailable,
  poolTokenInfo,
  poolTokenPrice,
}) => {
  const priceSOL = parseFloat(poolTokenPrice) * (SELL_COMMISSION_PERCENT / 100);

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
      ? `* Max total (with slippage) = ${(priceSOL * 1.01).toFixed(3)} SOL`
      : '';

  const isBtnDisabled =
    (!isSolTokenSelected && !poolTokenAvailable) ||
    (isSolTokenSelected && solBalance < priceSOL);

  const price = isSolTokenSelected
    ? priceSOL.toFixed(3)
    : (SELL_COMMISSION_PERCENT / 100).toFixed(3);

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
        price={price}
        slippageText={slippageText}
        label="Fee"
        poolTokenInfo={poolTokenInfo}
      />

      <SubmitButton
        text="Swap"
        onClick={() => onSubmit(isSolTokenSelected)}
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
