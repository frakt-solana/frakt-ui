import { useState } from 'react';

import styles from './BurgerMenu.module.scss';
import { AppNavigation, DropdownMenuMore } from '../Header/AppNavigation';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu = ({ className = '' }: BurgerMenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = (): void => setIsOpen(false);

  return (
    <>
      <div
        className={`${styles.burgerIcon} ${
          isOpen ? styles.opened : ''
        } ${className}`}
        onClick={(): void => setIsOpen(!isOpen)}
      >
        <div className={styles.centerIconLine} />
      </div>
      <div
        className={`${styles.wrapper} ${
          !isOpen ? styles.menuOverlayHidden : ''
        }`}
      >
        <div onClick={closeMenu} className={`${styles.menuOverlay}`} />
        <div className={styles.menuContent} onClick={closeMenu}>
          <AppNavigation className={styles.navigation}>
            <DropdownMenuMore />
          </AppNavigation>
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
