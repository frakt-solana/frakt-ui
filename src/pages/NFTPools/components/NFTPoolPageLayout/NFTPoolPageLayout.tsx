import classNames from 'classnames/bind';
import { FC } from 'react';

import { Container } from '../../../../components/Layout';
import { AppLayout } from '../../../../components/Layout/AppLayout';
import { POOL_TABS } from '../../../../constants';
import styles from './NFTPoolPageLayout.module.scss';

interface NFTPoolPageLayout {
  customHeader?: JSX.Element;
  children: JSX.Element[] | JSX.Element;
  tab?: POOL_TABS;
}

export const NFTPoolPageLayout: FC<NFTPoolPageLayout> = ({
  customHeader,
  children,
  tab = POOL_TABS.BUY,
}) => {
  const CONTENT_STYLE_BY_PAGE_TYPE = {
    [POOL_TABS.BUY]: styles.buyContent,
    [POOL_TABS.SELL]: styles.sellContent,
    [POOL_TABS.SWAP]: styles.swapContent,
    [POOL_TABS.STAKE]: styles.stakeContent,
    [POOL_TABS.INFO]: styles.infoContent,
  };

  return (
    <AppLayout customHeader={customHeader}>
      <Container
        component="main"
        className={classNames(styles.content, CONTENT_STYLE_BY_PAGE_TYPE[tab])}
      >
        {children}
      </Container>
    </AppLayout>
  );
};
