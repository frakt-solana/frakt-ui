import React, { FC } from 'react';
import styles from './styles.module.scss';
import { HashLink as AnchorLink } from 'react-router-hash-link';
import classNames from 'classnames';

interface CustomHeaderProps {
  activeLink: string;
  menuLinksData: { sectionRef: { current: HTMLParagraphElement } }[];
}

export const CustomHeader: FC<CustomHeaderProps> = ({
  menuLinksData,
  activeLink,
}) => {
  return (
    <div className={styles.wrapper}>
      <ul className={`${styles.container} container`}>
        {menuLinksData.map(
          (linkData) =>
            linkData.sectionRef?.current && (
              <li
                key={linkData.sectionRef.current.id}
                className={classNames(styles.item, {
                  [styles.active]:
                    activeLink === linkData.sectionRef.current.innerText,
                })}
              >
                <AnchorLink smooth to={`#${linkData.sectionRef.current.id}`}>
                  {linkData.sectionRef.current.innerText}
                </AnchorLink>
              </li>
            ),
        )}
      </ul>
    </div>
  );
};
