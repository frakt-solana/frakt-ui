import React from 'react';
import Button from '../Button';
import { useWalletModal } from '../../contexts/WalletModal';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectButton = ({ className }: ConnectButtonProps): JSX.Element => {
  const { visible, setVisible } = useWalletModal();

  return (
    <Button
      className={className}
      onClick={() => {
        setVisible(!visible);
      }}
    >
      Connect wallet
    </Button>
  );
};

export default ConnectButton;
