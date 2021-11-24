import classNames from 'classnames/bind';
import styles from './styles.module.scss';

interface EcosystemProps {
  className?: string;
}

const Partners = ({ className }: EcosystemProps): JSX.Element => {
  return (
    <div className={classNames([styles.ecosystem, className])}>
      <h2>Technical Partners</h2>
      <h2>Backers</h2>
    </div>
  );
};

export default Partners;
