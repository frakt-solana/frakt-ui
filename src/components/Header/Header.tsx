import classNames from 'classnames/bind';

import styles from './styles.module.scss';
import { Container } from '../Layout';
import React, { useState } from 'react';
import { MobileMenu } from './MobileMenu';
import { DesktopMenu } from './DesktopMenu';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={classNames([styles.root, className])}>
      <Container component="nav" className={styles.container}>
        <DesktopMenu />
        <div
          className={classNames(styles.burgerIcon, { [styles.opened]: isOpen })}
          onClick={() => setIsOpen(!isOpen)}
        />
        <div
          className={classNames(styles.menuOverlay, {
            [styles.menuOverlayHidden]: !isOpen,
          })}
        >
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
};

export default Header;
