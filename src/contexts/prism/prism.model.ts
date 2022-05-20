import { ReactNode } from 'react';
import { Prism } from '@prism-hq/prism-ag';

export interface PrismContextValues {
  loading: boolean;
  prism: Prism;
}

export type PrismProviderType = ({
  children,
}: {
  children: ReactNode;
}) => JSX.Element;
