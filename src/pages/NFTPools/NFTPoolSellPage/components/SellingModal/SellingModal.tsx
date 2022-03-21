import { FC, useState } from 'react';
import classNames from 'classnames';
import { TokenInfo } from '@solana/spl-token-registry';

import { UserNFTWithCollection } from '../../../../../contexts/userTokens';
import styles from './SellingModal.module.scss';
import { useNativeAccount } from '../../../../../utils/accounts';
import { LAMPORTS_PER_SOL } from '../../../../../utils/solanaUtils';
import {
  CurrencySelector,
  ItemContent,
  ModalHeader,
  SubmitButton,
} from '../../../components/ModalParts';

interface BuyingModalProps {
  onSubmit: () => void;
  onDeselect?: (nft: any) => void;
  nft: UserNFTWithCollection;
  poolTokenAvailable: boolean;
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

const PRICE_WITH_COMMISSION_PERCENT = 0.98;

export const SellingModal: FC<BuyingModalProps> = ({
  onDeselect,
  nft,
  onSubmit,
  poolTokenAvailable,
  poolTokenInfo,
  poolTokenPrice,
}) => {
  const priceSOL = parseFloat(poolTokenPrice) * PRICE_WITH_COMMISSION_PERCENT;

  const { account } = useNativeAccount();

  const solBalance = (account?.lamports || 0) / LAMPORTS_PER_SOL;

  const [isModalDown, setIsModalDown] = useState<boolean>(false);

  const [token, setToken] = useState<Token>(Token.SOL);

  const isSolTokenSelected = token === Token.SOL;

  const toggleModalDown = () => {
    setIsModalDown(!isModalDown);
  };

  const slippageText =
    token === Token.SOL
      ? `* Max total (with slippage) = ${(priceSOL * 1.01).toFixed(3)} SOL`
      : '';

  const isBtnDisabled =
    (!isSolTokenSelected && !poolTokenAvailable) ||
    (isSolTokenSelected && solBalance < priceSOL);

  const price = isSolTokenSelected
    ? priceSOL.toFixed(3)
    : PRICE_WITH_COMMISSION_PERCENT.toFixed(3);

  return (
    <div
      className={classNames({
        [styles.wrapper]: true,
        [styles.visible]: !!nft,
        [styles.modalDown]: isModalDown && !!nft,
      })}
    >
      <ModalHeader
        onHeaderClick={toggleModalDown}
        headerText="You're selling"
        setSlippage={isSolTokenSelected && !isModalDown && ((num) => num)}
      />

      <ItemContent
        className={styles.itemContent}
        name={nft?.metadata.name}
        image={nft?.metadata.image}
        collectionName={nft?.collectionName}
        onDeselect={() => onDeselect(nft)}
      />

      <CurrencySelector
        token={token}
        setToken={setToken}
        price={price}
        slippageText={slippageText}
        poolTokenInfo={poolTokenInfo}
      />

      <SubmitButton text="Sell" onClick={onSubmit} disabled={isBtnDisabled} />
    </div>
  );
};
