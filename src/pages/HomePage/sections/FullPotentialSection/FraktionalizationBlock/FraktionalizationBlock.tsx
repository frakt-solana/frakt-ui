import React, { FC } from 'react';
import classNames from 'classnames';
import styles from './styles.module.scss';
import { FraktionalizationInfoIcon } from '../../../../../icons';
import { BlockContent } from '../BlockContent';

interface FraktionalizationBlockProps {
  className?: string;
}

export const FraktionalizationBlock: FC<FraktionalizationBlockProps> = ({
  className,
}) => {
  return (
    <div className={classNames(className, styles.block)}>
      <BlockContent
        title={'Fraktionalization'}
        icon={<FraktionalizationInfoIcon />}
        text={
          'Split a single or multiple NFTs to provide owners with increased liquidity and lower the barriers to entry to blue chips'
        }
      />
    </div>
  );
};
