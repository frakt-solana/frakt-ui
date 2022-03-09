const IS_DEVNET = process.env.NETWORK === 'devnet';

export const FUSION_PROGRAM_PUBKEY = IS_DEVNET
  ? 'JCrmDPsceQew2naUT1UosJLaPW5K6QnV54frXjcBkXvc'
  : '';
