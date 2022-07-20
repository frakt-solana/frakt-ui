import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useWallet } from '@solana/wallet-adapter-react';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames';

import { selectWalletModalVisible } from '../../state/common/selectors';
import styles from './styles.module.scss';
import { Container } from '../Layout';
import { AppNavigation, DropdownMenuMore } from './AppNavigation';
import BurgerMenu from '../BurgerMenu';
import { PATHS } from '../../constants';
import ConnectButton from '../ConnectButton';
import ConnectedButton from '../ConnectedButton';
import WalletContent from '../WalletContent';

interface HeaderProps {
  className?: string;
  customHeader?: JSX.Element;
}

const Header: FC<HeaderProps> = ({ className, customHeader }) => {
  const { connected } = useWallet();
  const visible = useSelector(selectWalletModalVisible);

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
          <li>
            <NavLink
              className={styles.borrow}
              activeClassName={styles.borrowActive}
              to={PATHS.BORROW}
            >
              Borrow
            </NavLink>
          </li>
          <li>
            <div className={styles.profileWrapper}>
              {connected ? (
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
