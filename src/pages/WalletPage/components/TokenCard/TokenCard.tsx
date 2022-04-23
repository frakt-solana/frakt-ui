import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import BN from 'bn.js';

import { decimalBNToString } from '../../../../utils';
import Button from '../../../../components/Button';
import styles from './TokenCard.module.scss';
import { createPoolLink, PATHS, POOL_TABS } from '../../../../constants';
import { TokenInfoWithAmount } from '../../WalletPage';

interface TokenCardProps {
  token: TokenInfoWithAmount;
}

export const TokenCard: FC<TokenCardProps> = ({ token }) => {
  const isVaultToken = token?.tags?.includes('fractionalized-nft');

  const linkTo = isVaultToken
    ? `${PATHS.VAULT}/${(token?.extensions as any)?.vaultPubkey}`
    : createPoolLink(POOL_TABS.INFO, (token?.extensions as any)?.poolPubkey);

  return (
    <NavLink to={linkTo} className={styles.token}>
      <div className={styles.token__info}>
        <img
          className={styles.token__logo}
          src={token?.logoURI}
          alt={token.name}
        />
        <div>
          <div className={styles.token__name}>{token.name}</div>
          <div className={styles.token__balance}>
            {`${decimalBNToString(
              token?.amountBN || new BN(0),
              3,
              token?.decimals || 3,
            )} ${token.symbol}`}
          </div>
        </div>
      </div>
      <Button type="alternative" className={styles.token__btn}>
        {isVaultToken ? 'Browse vault' : 'Browse pool'}
      </Button>
    </NavLink>
  );
};
