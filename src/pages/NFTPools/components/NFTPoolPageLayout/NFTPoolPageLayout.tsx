import classNames from 'classnames/bind';
import { FC } from 'react';

import { Container } from '../../../../components/Layout';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import styles from './NFTPoolPageLayout.module.scss';

export enum PoolPageType {
  BUY = 'buy',
  SELL = 'sell',
  SWAP = 'swap',
  INFO = 'info',
}

interface NFTPoolPageLayout {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  pageType?: PoolPageType;
}

export const NFTPoolPageLayout: FC<NFTPoolPageLayout> = ({
  customHeader,
  children,
  pageType = PoolPageType.BUY,
}) => {
  const CONTENT_STYLE_BY_PAGE_TYPE = {
    [PoolPageType.BUY]: styles.buyContent,
    [PoolPageType.SELL]: styles.sellContent,
    [PoolPageType.SWAP]: styles.swapContent,
    [PoolPageType.INFO]: styles.infoContent,
  };

  return (
    <AppLayout customHeader={customHeader}>
      <Container
        component="main"
        className={classNames(
          styles.content,
          CONTENT_STYLE_BY_PAGE_TYPE[pageType],
        )}
      >
        {children}
      </Container>
    </AppLayout>
  );
};
