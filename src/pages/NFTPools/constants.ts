import { raydium } from '@frakt-protocol/frakt-sdk';

export const LOTTERY_TICKET_ACCOUNT_LAYOUT = raydium.struct([
  raydium.u64('anchor_start'),
  raydium.publicKey('community_pool'),
  raydium.publicKey('ticket_holder'),
  raydium.publicKey('winning_safety_box'),
  raydium.u64('lottery_ticket_state'),
  raydium.u8('anchor_end'),
]);

export const SELL_COMMISSION_PERCENT = 5; //? 2%
