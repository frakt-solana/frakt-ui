import classNames from 'classnames';
import { FC } from 'react';
import { Slider as SliderAntd } from 'antd';

import styles from './Slider.module.scss';

interface SliderProps {
  value: number;
  setValue?: (nextValue: number) => void;
  className?: string;
  marks?: { [key: number]: string };
  step?: number;
}

export const Slider: FC<SliderProps> = ({
  className,
  marks,
  value,
  setValue,
  step,
}) => {
  return (
    <div className={classNames(styles.slider, className)}>
      <SliderAntd
        marks={marks}
        value={value}
        onChange={setValue}
        tooltipVisible={false}
        step={step}
      />
    </div>
  );
};
