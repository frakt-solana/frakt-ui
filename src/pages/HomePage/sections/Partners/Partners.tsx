import React from 'react';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';
import exchange from './images/exchange.svg';
import digitalEyes from './images/digitalEyes.svg';
import magicEden from './images/magicEden.svg';
import radium from './images/radium.svg';
import serum from './images/serum.svg';
import solsea from './images/solsea.svg';

interface EcosystemProps {
  className?: string;
}

const Partners = ({ className }: EcosystemProps): JSX.Element => {
  return (
    <section className={classNames('section', styles.section, className)}>
      <div className={`container`}>
        <h2 className={styles.title}>Technical Partners</h2>
        <p className={styles.subtitle}>Technical Partners</p>
        <div className={styles.brands}>
          <img src={radium} alt="Brand logo" />
          <img src={serum} alt="Brand logo" />
          <img src={exchange} alt="Brand logo" />
          <img src={digitalEyes} alt="Brand logo" />
          <img src={magicEden} alt="Brand logo" />
          <img src={solsea} alt="Brand logo" />
        </div>
      </div>
    </section>
  );
};

export default Partners;
