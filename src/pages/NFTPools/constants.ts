import { publicKey, struct, u64, u8 } from '@raydium-io/raydium-sdk';

export const LOTTERY_TICKET_ACCOUNT_LAYOUT = struct([
  u64('anchor_start'),
  publicKey('community_pool'),
  publicKey('ticket_holder'),
  publicKey('winning_safety_box'),
  u64('lottery_ticket_state'),
  u8('anchor_end'),
]);

export const SELL_COMMISSION_PERCENT = 5; //? 2%
