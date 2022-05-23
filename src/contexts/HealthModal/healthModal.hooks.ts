import { useContext } from 'react';
import { HealthModalContextValues } from './healthModal.model';
import { HealthModalContext } from './healthModal.context';

export const useHealthModal = (): HealthModalContextValues => {
  const { setVisible, visible, config } = useContext(HealthModalContext);

  return { setVisible, visible, config };
};
