import { useDispatch } from 'react-redux';

import Button from '../Button';
import { commonActions } from '../../state/common/actions';

export interface ConnectButtonProps {
  className?: string;
}

const ConnectButton = ({ className }: ConnectButtonProps): JSX.Element => {
  const dispatch = useDispatch();

  return (
    <Button
      className={className}
      onClick={() => {
        dispatch(commonActions.toggleWalletModal());
      }}
    >
      Connect wallet
    </Button>
  );
};

export default ConnectButton;
