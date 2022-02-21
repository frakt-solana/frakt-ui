import { Radio as RadioAntd } from 'antd';
import classNames from 'classnames/bind';

import styles from './styles.module.scss';

interface RadioProps {
  className?: string;
  disabled?: boolean;
  checked?: boolean;
  value: string;
  label?: string;
}

export const Radio = ({
  className = '',
  disabled = false,
  checked = false,
  label = null,
  value,
}: RadioProps): JSX.Element => (
  <RadioAntd
    className={classNames(styles.radio, className)}
    disabled={disabled}
    checked={checked}
    value={value}
  >
    {label}
  </RadioAntd>
);
