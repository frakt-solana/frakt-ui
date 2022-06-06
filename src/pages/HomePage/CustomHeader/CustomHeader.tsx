import { FC, useState } from 'react';
import { HashLink as AnchorLink } from 'react-router-hash-link';

import styles from './styles.module.scss';
import classNames from 'classnames';
import { useIntersectionObserver } from '../../../hooks';
import {
  CONTACT_SECTION_ID,
  OUR_PRODUCT_ID,
  // OUR_TOKENS_ID,
  TEAM_SECTION_ID,
  // TECHNICAL_PARTNERS_ID,
} from '../constants';

interface CustomHeaderProps {
  menuLinksData: { sectionRef: { current: HTMLParagraphElement } }[];
}

const LINKS = [
  { id: OUR_PRODUCT_ID, label: 'Our products' },
  // { id: OUR_TOKENS_ID, label: 'Our tokens' },
  // { id: TECHNICAL_PARTNERS_ID, label: 'Backers' },
  { id: TEAM_SECTION_ID, label: 'Team' },
  { id: CONTACT_SECTION_ID, label: 'Contact us' },
];

export const CustomHeader: FC<CustomHeaderProps> = ({ menuLinksData }) => {
  const [activeBlockId, setActiveBlockId] = useState<string>();

  const intersectionCallback = (element: Element) => {
    element.id !== activeBlockId && setActiveBlockId(element.id);
  };

  useIntersectionObserver(null, menuLinksData, intersectionCallback);

  return (
    <div className={styles.wrapper}>
      <ul className={`${styles.container} container`}>
        {LINKS.map(({ id, label }, idx) => (
          <li
            key={idx}
            className={classNames(styles.item, {
              [styles.active]: activeBlockId === id,
            })}
          >
            <AnchorLink smooth to={`#${id}`}>
              {label}
            </AnchorLink>
          </li>
        ))}
      </ul>
    </div>
  );
};
