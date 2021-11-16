import { Switch } from 'antd';
import classNames from 'classnames/bind';
import { Control, Controller } from 'react-hook-form';
import styles from './styles.module.scss';

interface IToggleProps {
  className?: string;
  disabled?: boolean;
  value?: boolean;
  defaultChecked?: boolean;
  label?: string;
  onChange?: (value: any) => void;
}

interface IControlledToggleProps extends IToggleProps {
  control: Control<any>;
  name: string;
}

const Toggle = ({
  className = '',
  disabled = false,
  onChange = () => {},
  value = false,
  label = null,
}: IToggleProps): JSX.Element => (
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

export const ControlledToggle = ({
  control,
  name,
  ...props
}: IControlledToggleProps): JSX.Element => (
  <Controller
    control={control}
    name={name}
    render={({ field: { ref, ...field } }) => {
      return <Toggle {...props} {...field} />;
    }}
  />
);

export default Toggle;
