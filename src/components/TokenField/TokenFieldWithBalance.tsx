import { FC } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { TokenInfo } from '@solana/spl-token-registry';
import { AccountInfo } from '@solana/web3.js';
import BN from 'bn.js';

import { RawUserTokensByMint, useUserTokens } from '../../contexts/userTokens';
import { decimalBNToString, SOL_TOKEN } from '../../utils';
import TokenField, { TokenFieldProps } from './TokenField';
import { useNativeAccount } from '../../utils/accounts';
import { useTokenListContext } from '../../contexts/TokenList';

const getTokenBalance = (
  token: TokenInfo,
  account: AccountInfo<Buffer>,
  rawUserTokensByMint: RawUserTokensByMint,
): string => {
  if (token?.address === SOL_TOKEN.address) {
    return decimalBNToString(new BN(account?.lamports || 0), 3, 9);
  } else {
    const tokenAccount = rawUserTokensByMint[token?.address];

    return decimalBNToString(
      tokenAccount?.amountBN || new BN(0),
      3,
      token?.decimals || 9,
    );
  }
};

const getMintBalanceMap = (
  tokensList: TokenInfo[],
  account: AccountInfo<Buffer>,
  rawUserTokensByMint: RawUserTokensByMint,
) => {
  return tokensList.reduce((acc, token) => {
    const balance = getTokenBalance(token, account, rawUserTokensByMint);

    balance && balance !== '0' && (acc[token.address] = balance);

    return acc;
  }, {});
};

interface TokenFieldWithBalanceProps extends TokenFieldProps {
  showMaxButton?: boolean;
  lpTokenSymbol?: string;
  lpBalance?: number;
}

export const TokenFieldWithBalance: FC<TokenFieldWithBalanceProps> = ({
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
  lpBalance,
  lpTokenSymbol,
}) => {
  const { connected } = useWallet();
  const { tokensList: defaultTokenList } = useTokenListContext();
  const { rawUserTokensByMint } = useUserTokens();
  const { account } = useNativeAccount();

  const isTokenList = tokensList ? tokensList : defaultTokenList;

  const balances = getMintBalanceMap(
    defaultTokenList,
    account,
    rawUserTokensByMint,
  );

  const balance = balances[currentToken?.address] || 0;

  const onUseMaxButtonClick = () => {
    lpBalance ? onValueChange(String(lpBalance)) : onValueChange(balance);
  };

  return (
    <TokenField
      tokensList={isTokenList}
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
      lpTokenSymbol={lpTokenSymbol}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
};
