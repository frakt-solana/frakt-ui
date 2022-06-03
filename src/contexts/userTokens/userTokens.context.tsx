import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';

import { userTokensActions } from '../../state/userTokens/actions';

export const UserTokensProvider = ({
  children = null,
}: {
  children: JSX.Element;
}): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const dispatch = useDispatch();

  useEffect(() => {
    if (connected) {
      dispatch(userTokensActions.fetchUserTokens(publicKey));
    }
    return () => {
      dispatch(userTokensActions.clearTokens());
    };
  }, [connected, dispatch, publicKey]);

  return <div>{children}</div>;
};
