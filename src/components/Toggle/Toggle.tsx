import { Switch } from 'antd';
import {
  SwitchChangeEventHandler,
  SwitchClickEventHandler,
} from 'antd/lib/switch';
import classNames from 'classnames/bind';
import styles from './styles.module.scss';

interface IToggleProps {
  className?: string;
  disabled?: boolean;
  onClick?: SwitchClickEventHandler;
  onChange?: SwitchChangeEventHandler;
  checked?: boolean;
  defaultChecked?: boolean;
}

const Toggle = ({
  className = '',
  disabled = false,
  onClick = () => {},
  onChange = () => {},
  checked = false,
}: IToggleProps): JSX.Element => (
  <Switch
    className={classNames(className, styles.toggle)}
    onChange={onChange}
    onClick={onClick}
    checked={checked}
    disabled={disabled}
  />
);

export default Toggle;
