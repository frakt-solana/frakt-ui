import { TokenInfo } from '@solana/spl-token-registry';
import { SOL_TOKEN, FRKT_TOKEN } from '../../utils';

//? Tokens info for TokenField component. Added FRKT for future
export const TOKEN_FIELD_CURRENCY: {
  SOL: TokenInfo;
  FRKT: TokenInfo;
} = {
  SOL: SOL_TOKEN,
  FRKT: FRKT_TOKEN,
};
