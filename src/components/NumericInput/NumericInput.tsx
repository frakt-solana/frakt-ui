import { Input } from '../../components/Input';
import styles from './styles.module.scss';

interface NumericInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const NumericInput = ({
  onChange,
  value,
  placeholder = '0.0',
}: NumericInputProps): JSX.Element => {
  const onChangeHanlder = (event) => {
    const { value } = event.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '') {
      onChange(value);
    }
  };

  return (
    <Input
      value={value}
      onChange={onChangeHanlder}
      placeholder={placeholder}
      maxLength={25}
      className={styles.numberInput}
    />
  );
};

export default NumericInput;
