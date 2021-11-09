import classNames from 'classnames/bind';
import { WarningIcon } from '../../icons';
import styles from './styles.module.scss';

export const UnverifiedBadge = (): JSX.Element => (
  <div
    className={classNames(
      styles.label,
      styles.labelStrict,
      styles.labelUnverified,
    )}
  >
    <WarningIcon /> Unverified
  </div>
);
