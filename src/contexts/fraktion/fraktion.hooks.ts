import { useContext } from 'react';

import { FraktionContext } from './fraktion.context';
import { FraktionContextType } from './fraktion.model';

export const useFraktion = (): FraktionContextType => {
  const context = useContext(FraktionContext);
  return context;
};
