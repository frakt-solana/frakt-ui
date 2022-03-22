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
import { SELL_COMMISSION_PERCENT } from '../../../constants';

interface SellingModalProps {
  onSubmit: (needSwap?: boolean) => void;
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

export const SellingModal: FC<SellingModalProps> = ({
  onDeselect,
  nft,
  onSubmit,
  poolTokenAvailable,
  poolTokenInfo,
  poolTokenPrice,
}) => {
  const priceSOL =
    parseFloat(poolTokenPrice) * ((100 - SELL_COMMISSION_PERCENT) / 100);

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
    : ((100 - SELL_COMMISSION_PERCENT) / 100).toFixed(3);

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

      <SubmitButton
        text="Sell"
        onClick={() => onSubmit(isSolTokenSelected)}
        disabled={isBtnDisabled}
      />
    </div>
  );
};
