import classNames from 'classnames';
import { FC } from 'react';
import { Slider as SliderAntd } from 'antd';

import styles from './Slider.module.scss';

interface SliderProps {
  value: number;
  setValue?: (nextValue: number) => void;
  className?: string;
}

export const Slider: FC<SliderProps> = ({ className, value, setValue }) => {
  return (
    <div className={classNames(styles.slider, className)}>
      <SliderAntd value={value} onChange={setValue} tooltipVisible={false} />
    </div>
  );
};
