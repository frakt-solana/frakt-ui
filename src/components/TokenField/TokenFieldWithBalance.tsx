import { useWallet } from '@solana/wallet-adapter-react';

import TokenField, { TokenFieldProps } from './TokenField';

interface TokenFieldWithBalanceProps extends TokenFieldProps {
  showMaxButton?: boolean;
  lpTokenSymbol?: string;
  lpBalance?: number;
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
  lpBalance,
  labelRight,
  lpTokenSymbol,
}: TokenFieldWithBalanceProps): JSX.Element => {
  const { connected } = useWallet();

  const onUseMaxButtonClick = () => {
    lpBalance && onValueChange(String(lpBalance));
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
      onUseMaxButtonClick={
        connected && showMaxButton ? onUseMaxButtonClick : null
      }
      lpTokenSymbol={lpTokenSymbol}
      error={error}
      placeholder={placeholder}
      disabled={disabled}
      labelRight={labelRight}
    />
  );
};
