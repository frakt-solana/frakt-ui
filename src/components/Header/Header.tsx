import { FC, useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import {
  AppNavigation,
  DropdownMenuDoStuff,
  DropdownMenuMore,
} from './AppNavigation';
import BurgerMenu from '../BurgerMenu';
import { PATHS } from '../../constants';
import ConnectButton from '../ConnectButton';
import ConnectedButton from '../ConnectedButton';
import WalletContent from '../WalletContent';
import { useWalletModal } from '../../contexts/WalletModal';
import { login } from '../../utils/loans';

interface HeaderProps {
  className?: string;
  customHeader?: JSX.Element;
}

const Header: FC<HeaderProps> = ({ className, customHeader }) => {
  const { visible } = useWalletModal();
  const wallet = useWallet();
  const { connected } = wallet;

  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const walletLS = localStorage.getItem('wallet');
    const walletName = localStorage.getItem('walletName');

    if (walletLS && walletName) {
      setAuthenticated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const signToken = async (): Promise<void> => {
    if (!authenticated) {
      const isLogin = await login(wallet);
      if (isLogin) {
        setAuthenticated(true);
      }
    } else {
      setAuthenticated(false);
    }
  };

  return (
    <header className={classNames(styles.root, styles.header, className)}>
      {visible && (
        <WalletContent authenticated={authenticated} signToken={signToken} />
      )}
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={PATHS.ROOT}>
          Frakt
        </NavLink>
        <AppNavigation>
          <DropdownMenuMore />
        </AppNavigation>
        <ul className={styles.buttons}>
          <li className={styles.bgAccent}>
            <AppNavigation withoutLinks>
              <DropdownMenuDoStuff />
            </AppNavigation>
          </li>
          <li>
            <div className={styles.profileWrapper}>
              {connected && authenticated ? (
                <ConnectedButton
                  className={classNames(
                    styles.walletBtn,
                    styles.walletConnectedBtn,
                  )}
                />
              ) : (
                <ConnectButton className={styles.walletBtn} />
              )}
            </div>
          </li>
        </ul>
        <BurgerMenu />
      </Container>
      {customHeader}
    </header>
  );
};

export default Header;
