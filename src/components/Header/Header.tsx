import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import { useWallet } from '@solana/wallet-adapter-react';

import styles from './styles.module.scss';
import { URLS } from '../../constants';
import { Container } from '../Layout';
import { shortenAddress } from '../../utils/solanaUtils';
import { ChevronDownIcon } from '../../icons';
import { Tooltip } from 'antd';
import { WalletInfo } from './WalletInfo';
import { useWalletModal } from '../../contexts/WalletModal/walletModal.context';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): JSX.Element => {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  return (
    <header className={classNames([styles.root, className])}>
      <Container component="nav" className={styles.container}>
        <NavLink className={styles.logo} to={URLS.ROOT}>
          Fraktion
        </NavLink>
        <ul className={`${styles.navigation} ${styles.navigation_left}`}>
          <li>
            <NavigationLink to={URLS.VAULTS}>Vaults</NavigationLink>
          </li>
          <li className={styles.navigation__exchangeSoon}>
            <NavigationLink to={URLS.EXCHANGE}>Exchange</NavigationLink>
          </li>
        </ul>
        <ul className={styles.navigation}>
          {/* //TODO: Uncomment link when exteranl page ready */}
          {/* <li>
            <NavigationLink to={URLS.STAKER_PAGE}>Frakt Staker?</NavigationLink>
          </li> */}
          <li className={styles.bgAccent}>
            <NavigationLink to={URLS.FRAKTIONALIZE}>
              Fraktionalize
            </NavigationLink>
          </li>
          <li>
            {connected ? (
              <Tooltip
                overlayClassName={styles.walletInfo}
                trigger="click"
                placement="topRight"
                title={WalletInfo}
              >
                <button
                  className={classNames([
                    styles.walletBtn,
                    styles.walletBtn_connected,
                  ])}
                >
                  {shortenAddress(publicKey.toString())}
                  <ChevronDownIcon className={styles.walletBtn__icon} />
                </button>
              </Tooltip>
            ) : (
              <button
                className={styles.walletBtn}
                onClick={() => setVisible(true)}
              >
                Connect wallet
              </button>
            )}
          </li>
        </ul>
      </Container>
    </header>
  );
};

const NavigationLink = ({ to, children }): JSX.Element => {
  return (
    <NavLink
      to={to}
      className={styles.link}
      activeClassName={styles.activeLink}
    >
      {children}
    </NavLink>
  );
};

export default Header;
