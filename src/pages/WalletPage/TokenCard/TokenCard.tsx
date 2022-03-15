import { NavLink } from 'react-router-dom';
import BN from 'bn.js';

import { decimalBNToString } from '../../../utils';
import Button from '../../../components/Button';
import { TokenInfoWithAmount } from '../hooks';
import styles from './TokenCard.module.scss';
import { PATHS } from '../../../constants';
import { FC } from 'react';

interface TokenCardProps {
  token: TokenInfoWithAmount;
}

export const TokenCard: FC<TokenCardProps> = ({ token }) => {
  const vaultPubkey = (token.extensions as any)?.vaultPubkey;

  return (
    <NavLink to={`${PATHS.VAULT}/${vaultPubkey}`} className={styles.token}>
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
        Browse vault
      </Button>
    </NavLink>
  );
};
