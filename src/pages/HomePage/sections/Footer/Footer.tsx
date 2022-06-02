import { FC } from 'react';
import { HashLink as AnchorLink } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';

import styles from './Footer.module.scss';
import {
  // CoinGeckoIcon,
  DiscordIcon,
  DocsIcon,
  GitHubIcon,
  MediumIcon,
  TwitterIcon,
} from '../../../../icons';
import {
  CONTACT_SECTION_ID,
  OUR_PRODUCT_ID,
  OUR_TOKENS_ID,
  TEAM_SECTION_ID,
  // TECHNICAL_PARTNERS_ID,
} from '../../constants';
import { PATHS } from '../../../../constants';
import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import { Container } from '../../../../components/Layout';

const ECOSYSTEM_LIST = [
  { path: PATHS.LOANS, label: 'Loans' },
  { path: PATHS.POOLS, label: 'Pools' },
  { path: PATHS.SWAP, label: 'Swap' },
  { to: PATHS.ROADMAP, label: 'Roadmap' },
];

const LANDING_LIST = [
  { to: `#${OUR_PRODUCT_ID}`, label: 'Our products' },
  { to: `#${OUR_TOKENS_ID}`, label: 'Our tokens' },
  // { to: `#${TECHNICAL_PARTNERS_ID}`, label: 'Technical partners' },
  { to: `#${TEAM_SECTION_ID}`, label: 'Team' },
];

const DOCS_LIST = [
  { to: 'https://medium.com/@frakt_HQ', icon: MediumIcon },
  { to: 'https://docs.frakt.xyz/', icon: DocsIcon },
  // { to: 'https://github.com/frakt-solana', icon: CoinGeckoIcon },
];

const SOCIALS_LIST = [
  { to: 'https://tinyurl.com/zp3rx6z3', icon: DiscordIcon },
  { to: 'https://twitter.com/FRAKT_HQ', icon: TwitterIcon },
  { to: 'https://github.com/frakt-solana', icon: GitHubIcon },
];

interface FooterProps {
  navRef?: { current: HTMLParagraphElement };
}

export const Footer: FC<FooterProps> = ({ navRef }) => {
  return (
    <Container component="section" className={styles.root}>
      <p className={styles.logo} id={CONTACT_SECTION_ID} ref={navRef}>
        FRAKT
      </p>
      <div className={styles.navWrapper}>
        <h5 className={styles.navTitle}>Ecosystem</h5>
        <ul className={styles.navList}>
          {ECOSYSTEM_LIST.map(({ path, label, to }, idx) => (
            <li key={idx} className={styles.navItem}>
              {path ? (
                <NavLink to={path}>{label}</NavLink>
              ) : (
                <a href={to} target="_blank" rel="noreferrer">
                  {label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.navWrapper}>
        <h5 className={styles.navTitle}>FRAKT</h5>
        <ul className={styles.navList}>
          {LANDING_LIST.map(({ to, label }, idx) => (
            <li className={styles.navItem} key={idx}>
              <AnchorLink smooth to={to}>
                {label}
              </AnchorLink>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.contacts}>
        <h5 className={styles.navTitle}>Resources</h5>
        <div className={styles.contactsInfo}>
          <div className={styles.docs}>
            <p className={styles.docsTitle}>documentation</p>
            <ul className={styles.socialNavs}>
              {DOCS_LIST.map(({ to, icon: Icon }, idx) => (
                <li className={styles.socialItem} key={idx}>
                  <a
                    href={to}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.contact}>
            <p className={styles.contactTitle}>Contact us</p>
            <ul className={styles.socialNavs}>
              {SOCIALS_LIST.map(({ to, icon: Icon }, idx) => (
                <li className={styles.socialItem} key={idx}>
                  <a
                    href={to}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
            <LinkWithArrow
              externalLink
              to="mailto:hello@frakt.art"
              label="hello@frakt.art"
            />
          </div>
        </div>
      </div>
    </Container>
  );
};
