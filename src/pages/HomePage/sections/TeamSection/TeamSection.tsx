import { FC } from 'react';

import styles from './TeamSection.module.scss';
import teamPhotoTim from './assets/teamPhotoTim.jpg';
import teamPhotoVedamir from './assets/teamPhotoVedamire.jpg';
import teamPhotoVlad from './assets/teamPhotoVlad.jpg';
import teamPhotoPhil from './assets/teamPhotoPhil.jpg';
import teamPhotoViktor from './assets/teamPhotoViktor.jpg';
import teamPhotoRoman from './assets/teamPhotoRoman.jpg';
import teamPhotoAdrian from './assets/teamPhotoAdrian.jpg';
import teamPhotoEgor from './assets/teamPhotoEgor.jpg';
import teamPhotoVlad2 from './assets/teamPhotoVlad2.jpg';
import { BehanceIcon, GitHubIcon, TwitterIcon } from '../../../../icons';
import { TEAM_SECTION_ID } from '../../constants';
import { Container } from '../../../../components/Layout';

const MEMBERS = [
  {
    name: 'Tim',
    photoUrl: teamPhotoTim,
    position: <span>Founder</span>,
    socialLink: (
      <a
        href="https://twitter.com/timsamoylov"
        rel="noreferrer"
        target="_blank"
      >
        <TwitterIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Vedamir',
    photoUrl: teamPhotoVedamir,
    position: (
      <span>
        Co-founder, <br /> DeFi Magician
      </span>
    ),
    socialLink: (
      <a href="https://github.com/vedamire" rel="noreferrer" target="_blank">
        <GitHubIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Vlad',
    photoUrl: teamPhotoVlad,
    position: (
      <span>
        Co-founder, <br /> UX Lead
      </span>
    ),
    socialLink: (
      <a href="https://github.com/sablevsky" rel="noreferrer" target="_blank">
        <GitHubIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Phil',
    photoUrl: teamPhotoPhil,
    position: (
      <span>
        Swiss Army
        <br />
        Knife
      </span>
    ),
    socialLink: (
      <a href="https://twitter.com/rawrxbt" rel="noreferrer" target="_blank">
        <TwitterIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Adrian',
    photoUrl: teamPhotoAdrian,
    position: <span>Partnerships</span>,
    socialLink: (
      <a href="https://twitter.com/0x1dad" rel="noreferrer" target="_blank">
        <TwitterIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Roman',
    photoUrl: teamPhotoRoman,
    position: <span>Developer</span>,
    socialLink: (
      <a href="https://github.com/Piterom911" rel="noreferrer" target="_blank">
        <GitHubIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Viktor',
    photoUrl: teamPhotoViktor,
    position: <span>Developer</span>,
    socialLink: (
      <a href="https://github.com/valpaq" rel="noreferrer" target="_blank">
        <GitHubIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Vlad',
    photoUrl: teamPhotoVlad2,
    position: <span>Developer</span>,
    socialLink: (
      <a href="https://github.com/ezekiel9218" rel="noreferrer" target="_blank">
        <GitHubIcon width={24} />
      </a>
    ),
  },
  {
    name: 'Egor',
    photoUrl: teamPhotoEgor,
    position: <span>UX/UI designer</span>,
    socialLink: (
      <a
        href="https://www.behance.net/egor_russak"
        rel="noreferrer"
        target="_blank"
      >
        <BehanceIcon width={24} />
      </a>
    ),
  },
];

export const TeamSection: FC<{ navRef?: { current: HTMLParagraphElement } }> =
  ({ navRef }) => {
    return (
      <Container component="section" className={styles.root}>
        <h2 className={styles.title} ref={navRef} id={TEAM_SECTION_ID}>
          Meet the team
        </h2>
        <ul className={styles.teamList}>
          {MEMBERS.map(({ name, photoUrl, position, socialLink }, idx) => (
            <li key={idx} className={styles.teamItem}>
              <img src={photoUrl} alt={name} className={styles.teamPhoto} />
              <div className={styles.teamInfo}>
                <p className={styles.teamName}>{name}</p>
                <div className={styles.teamPosition}>
                  {position}
                  {socialLink}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    );
  };
