import React, { FC } from 'react';
import styles from './styles.module.scss';

import { HashLink as AnchorLink } from 'react-router-hash-link';
import { NavLink } from 'react-router-dom';
import {
  ArrowRightTop,
  CoinGeckoIcon,
  DiscordIcon,
  DocsIcon,
  GitHubIcon,
  MediumIcon,
  TwitterIcon,
} from '../../../../icons';

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <p className={styles.logo}>FRAKT</p>
        <div className={styles.navWrapper}>
          <h5 className={styles.navTitle}>Ecosystem</h5>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink to={'URLS.COLLECTION'}>Market</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'URLS.RARITY'}>Vaults</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'URLS.STAKE'}>Swap</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'URLS.MARKETPLACE'}>Trade</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'URLS.MARKETPLACE'}>Collections</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'URLS.MARKETPLACE'}>My collection</NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to={'URLS.MARKETPLACE'}>Yield</NavLink>
            </li>
          </ul>
        </div>
        <div className={styles.navWrapper}>
          <h5 className={styles.navTitle}>FRAKTION</h5>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <AnchorLink smooth to={`#${'WHAT_IS_FRAKT_SECTION_ID'}`}>
                Our products
              </AnchorLink>
            </li>
            <li className={styles.navItem}>
              <AnchorLink smooth to={`#${'ECOSYSTEM_SECTION_ID'}`}>
                Our tokens
              </AnchorLink>
            </li>
            <li className={styles.navItem}>
              <AnchorLink smooth to={`#${'TEAM_SECTION_ID'}`}>
                Technical partners
              </AnchorLink>
            </li>
            <li className={styles.navItem}>
              <AnchorLink smooth to={`#${'FAQ_SECTION_ID'}`}>
                Team
              </AnchorLink>
            </li>
            <li className={styles.navItem}>
              <AnchorLink smooth to={`#${'FAQ_SECTION_ID'}`}>
                Contact us
              </AnchorLink>
            </li>
          </ul>
        </div>
        <div className={styles.contacts}>
          <h5 className={styles.navTitle}>Resources</h5>
          <div className={styles.contactsInfo}>
            <div className={styles.docs}>
              <p className={styles.docsTitle}>documentation</p>
              <ul className={styles.socialNavs}>
                <li className={styles.socialItem}>
                  <a
                    href="http://discord.gg/frakt"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MediumIcon />
                  </a>
                </li>
                <li className={styles.socialItem}>
                  <a
                    href="https://twitter.com/FraktArt"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <DocsIcon />
                  </a>
                </li>
                <li className={styles.socialItem}>
                  <a
                    href="https://github.com/frakt-solana"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CoinGeckoIcon />
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.contact}>
              <p className={styles.contactTitle}>Contact us</p>
              <ul className={styles.socialNavs}>
                <li className={styles.socialItem}>
                  <a
                    href="http://discord.gg/frakt"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <DiscordIcon />
                  </a>
                </li>
                <li className={styles.socialItem}>
                  <a
                    href="https://twitter.com/FraktArt"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TwitterIcon />
                  </a>
                </li>
                <li className={styles.socialItem}>
                  <a
                    href="https://github.com/frakt-solana"
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GitHubIcon />
                  </a>
                </li>
              </ul>
              <a href="mailto:hello@frakt.art" className={`link-with-arrow`}>
                hello@frakt.art <ArrowRightTop />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
