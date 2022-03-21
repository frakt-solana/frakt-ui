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
}

enum Token {
  SOL = 'sol',
  POOL_TOKEN = 'poolToken',
}

enum Price {
  SOL = 0.001,
  POOL_TOKEN = 0.98,
}

export const SellingModal: FC<BuyingModalProps> = ({
  onDeselect,
  nft,
  onSubmit,
  poolTokenAvailable,
  poolTokenInfo,
}) => {
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
      ? `* Max total (with slippage) = ${(Price.SOL * 0.98).toFixed(3)} SOL`
      : '';

  const isBtnDisabled =
    (!isSolTokenSelected && !poolTokenAvailable) ||
    (isSolTokenSelected && solBalance < Price.SOL);

  const price = isSolTokenSelected ? Price.SOL : Price.POOL_TOKEN;

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
        price={price.toFixed(3)}
        slippageText={slippageText}
        poolTokenInfo={poolTokenInfo}
      />

      <SubmitButton text="Sell" onClick={onSubmit} disabled={isBtnDisabled} />
    </div>
  );
};
