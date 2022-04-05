import { FC } from 'react';
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
import { useLoans } from '../../contexts/loans';

interface HeaderProps {
  className?: string;
  customHeader?: JSX.Element;
}

const Header: FC<HeaderProps> = ({ className, customHeader }) => {
  const { visible } = useWalletModal();
  const { isPawnshopAuthenticated } = useLoans();
  const wallet = useWallet();
  const { connected } = wallet;

  return (
    <header className={classNames(styles.root, styles.header, className)}>
      {visible && <WalletContent />}
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
              {connected && isPawnshopAuthenticated ? (
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
