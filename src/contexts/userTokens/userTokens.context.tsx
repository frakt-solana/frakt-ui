import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { userTokensActions } from '../../state/userTokens/actions';
import { selectSocket } from '../../state/common/selectors';
import { commonActions } from '../../state/common/actions';

export const UserTokensProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);

  useEffect(() => {
    if (connected && publicKey && socket) {
      socket.emit('loan-subscribe', publicKey);
    }
  }, [connected, socket, publicKey]);

  useEffect(() => {
    if (connected) {
      dispatch(commonActions.setWallet({ publicKey }));
      dispatch(userTokensActions.fetchUserTokens(publicKey));
    }
    return () => {
      dispatch(userTokensActions.clearTokens());
    };
  }, [connected, dispatch, publicKey]);

  return <div>{children}</div>;
};
