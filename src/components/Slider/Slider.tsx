import { FC, ReactNode } from 'react';
import { Slider as AntdSlider } from 'antd';
import classNames from 'classnames';

import styles from './Slider.module.scss';

interface SliderProps {
  value: number;
  onChange: () => void;
  marks?: { [key: number]: string };
  step?: number;
  max?: number;
  className?: string;
  tipFormatter: (value: number) => ReactNode;
}

const Slider: FC<SliderProps> = ({
  value,
  onChange,
  marks,
  step,
  max,
  className,
  tipFormatter,
}) => {
  return (
    <AntdSlider
      value={value}
      tipFormatter={tipFormatter}
      onChange={onChange}
      className={classNames(styles.slider, className)}
      marks={marks}
      step={step}
      max={max}
    />
  );
};

export default Slider;
