import { ReactNode } from 'react';
import { Prism } from '@prism-hq/prism-ag';

import { PrismSwapTransactionParams } from './transactions';

export interface PrismContextValues {
  loading: boolean;
  prismSwap: (params: PrismSwapTransactionParams) => Promise<void>;
  prism: Prism;
}

export type PrismProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;
