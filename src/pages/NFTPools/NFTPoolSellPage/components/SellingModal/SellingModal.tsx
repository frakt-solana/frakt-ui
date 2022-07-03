import { FC, useState } from 'react';
import classNames from 'classnames';
import { TokenInfo } from '@solana/spl-token-registry';

import { UserNFTWithCollection } from '../../../../../state/userTokens/types';
import styles from './SellingModal.module.scss';
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
  poolTokenInfo: TokenInfo;
  poolTokenPrice: string;
  slippage: number;
  setSlippage: (nextValue: number) => void;
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

export const SellingModal: FC<SellingModalProps> = ({
  onDeselect,
  nft,
  onSubmit,
  poolTokenInfo,
  poolTokenPrice,
  slippage,
  setSlippage,
}) => {
  const priceSOL =
    parseFloat(poolTokenPrice) * ((100 - SELL_COMMISSION_PERCENT) / 100);

  const [token, setToken] = useState<Token>(Token.SOL);

  const isSolTokenSelected = token === Token.SOL;

  const slippageText =
    token === Token.SOL
      ? `* Min total (with slippage) = ${(
          priceSOL *
          (1 - slippage / 100)
        ).toFixed(3)} SOL`
      : '';

  const price = isSolTokenSelected
    ? priceSOL.toFixed(3)
    : ((100 - SELL_COMMISSION_PERCENT) / 100).toFixed(3);

  return (
    <div
      className={classNames(styles.wrapper, {
        [styles.visible]: !!nft,
      })}
    >
      <ModalHeader
        headerText="You're selling"
        slippage={slippage}
        setSlippage={setSlippage}
        showSlippageDropdown={isSolTokenSelected}
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

      <SubmitButton text="Sell" onClick={() => onSubmit(isSolTokenSelected)} />
    </div>
  );
};
