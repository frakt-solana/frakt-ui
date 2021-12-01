import React from 'react';
import BN from 'bn.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { AccountInfo } from '@solana/web3.js';
import { WSOL } from '@raydium-io/raydium-sdk';

import { decimalBNToString, Token } from '../../utils';
import { RawUserTokensByMint, useUserTokens } from '../../contexts/userTokens';
import { useNativeAccount } from '../../hooks';
import TokenField, { TokenFieldProps } from './TokenField';

const getTokenBalance = (
  token: Token,
  account: AccountInfo<Buffer>,
  rawUserTokensByMint: RawUserTokensByMint,
): string => {
  if (token?.mint === WSOL.mint) {
    return decimalBNToString(new BN(account?.lamports || 0), 3, 9);
  } else {
    const tokenAccount = rawUserTokensByMint[token?.mint];

    return decimalBNToString(
      tokenAccount?.amountBN || new BN(0),
      3,
      token?.data?.decimals || 9,
    );
  }
};

const getMintBalanceMap = (
  tokensList: Token[],
  account: AccountInfo<Buffer>,
  rawUserTokensByMint: RawUserTokensByMint,
) => {
  return tokensList.reduce((acc, token) => {
    const balance = getTokenBalance(token, account, rawUserTokensByMint);

    balance && balance !== '0' && (acc[token.mint] = balance);

    return acc;
  }, {});
};

interface TokenFieldWithBalanceProps extends TokenFieldProps {
  showMaxButton?: boolean;
}

export const TokenFieldWithBalance = ({
  tokensList = [],
  onTokenChange,
  currentToken,
  value,
  onValueChange,
  modalTitle,
  label,
  style,
  className,
  error,
  placeholder = '0.0',
  showMaxButton = false,
  disabled = false,
}: TokenFieldWithBalanceProps): JSX.Element => {
  const { connected } = useWallet();
  const { rawUserTokensByMint } = useUserTokens();
  const { account } = useNativeAccount();

  const balances = getMintBalanceMap(tokensList, account, rawUserTokensByMint);

  const balance = balances[currentToken?.mint];

  const onUseMaxButtonClick = () => {
    onValueChange(balance);
  };

  return (
    <TokenField
      tokensList={tokensList}
      onTokenChange={onTokenChange}
      currentToken={currentToken}
      value={value}
      onValueChange={onValueChange}
      modalTitle={modalTitle}
      label={label}
      style={style}
      className={className}
      balance={connected && currentToken ? balance : null}
      balances={balances}
      onUseMaxButtonClick={
        connected && showMaxButton && balance !== '0.00'
          ? onUseMaxButtonClick
          : null
      }
      error={error}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};
