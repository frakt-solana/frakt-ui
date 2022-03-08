import classNames from 'classnames/bind';
import { DoneIcon } from '../../icons';
import styles from './styles.module.scss';

export const VerifiedBadge = (): JSX.Element => (
  <div
    className={classNames(
      styles.label,
      styles.labelStrict,
      styles.labelVerified,
    )}
  >
    <DoneIcon /> <span>Verified</span>
  </div>
);
