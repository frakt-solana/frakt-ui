import { Switch } from 'antd';
import classNames from 'classnames';

import styles from './styles.module.scss';

interface ToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: any) => void;
}

const Toggle = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value = false,
  label = null,
}: ToggleProps): JSX.Element => (
  <div
    className={classNames(className, styles.filterToggle)}
    onClick={() => onChange(!value)}
  >
    <Switch className={styles.toggle} checked={value} disabled={disabled} />
    {label && (
      <p
        className={classNames([
          styles.filterToggle__text,
          { [styles.filterToggle__text_muted]: !value },
        ])}
      >
        {label}
      </p>
    )}
  </div>
);

export default Toggle;
