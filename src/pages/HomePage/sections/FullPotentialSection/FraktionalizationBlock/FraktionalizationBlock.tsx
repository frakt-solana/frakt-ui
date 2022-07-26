import { FC } from 'react';

import { BlockContent } from '../BlockContent';
import { Slider } from './Slider';
import { FraktionalizationInfoIcon } from '../../../svg';

interface FraktionalizationBlockProps {
  className?: string;
}

export const FraktionalizationBlock: FC<FraktionalizationBlockProps> = ({
  className,
}) => {
  return (
    <div className={className}>
      <Slider />
      <BlockContent
        title={'Fraktionalization'}
        icon={<FraktionalizationInfoIcon />}
        text={
          'Split a single or multiple NFTs to provide owners with increased liquidity and lower the barriers to entry to blue chips'
        }
        to={process.env.FRAKT_VAULTS_URL}
        externalLink
      />
    </div>
  );
};
