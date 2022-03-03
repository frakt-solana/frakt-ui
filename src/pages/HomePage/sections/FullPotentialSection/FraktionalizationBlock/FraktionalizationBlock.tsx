import { FC } from 'react';
import classNames from 'classnames';

import styles from './styles.module.scss';
import { BlockContent } from '../BlockContent';
import { Slider } from './Slider';
import { FraktionalizationInfoIcon } from '../../../svg';
import { PATHS } from '../../../../../constants';

interface FraktionalizationBlockProps {
  className?: string;
}

export const FraktionalizationBlock: FC<FraktionalizationBlockProps> = ({
  className,
}) => {
  return (
    <div className={classNames(className, styles.block)}>
      <Slider />
      <BlockContent
        title={'Fraktionalization'}
        icon={<FraktionalizationInfoIcon />}
        text={
          'Split a single or multiple NFTs to provide owners with increased liquidity and lower the barriers to entry to blue chips'
        }
        to={PATHS.VAULTS}
      />
    </div>
  );
};
