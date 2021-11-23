import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { AccountInfo } from '@solana/web3.js';
import { WSOL } from '@raydium-io/raydium-sdk';

import { getSolBalanceValue, getTokenBalanceValue, Token } from '../../utils';
import { RawUserTokensByMint, useUserTokens } from '../../contexts/UserTokens';
import { useNativeAccount } from '../../hooks';
import TokenField, { TokenFieldProps } from './TokenField';

const getTokenBalance = (
  token: Token,
  account: AccountInfo<Buffer>,
  rawUserTokensByMint: RawUserTokensByMint,
): string => {
  if (token?.mint === WSOL.mint) {
    return getSolBalanceValue(account);
  } else {
    const tokenAccount = rawUserTokensByMint[token?.mint];

    return getTokenBalanceValue(tokenAccount?.amountBN, token?.data?.decimals);
  }
};

const getMintBalanceMap = (
  tokensList: Token[],
  account: AccountInfo<Buffer>,
  rawUserTokensByMint: RawUserTokensByMint,
) => {
  return tokensList.reduce((acc, token) => {
    const balance = getTokenBalance(token, account, rawUserTokensByMint);

    balance && balance !== '--' && (acc[token.mint] = balance);

    return acc;
  }, {});
};

interface TokenFieldWithBalanceProps extends TokenFieldProps {
  showMaxButton?: boolean;
}

export const TokenFieldWithBalance = ({
  tokensList,
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
    />
  );
};
