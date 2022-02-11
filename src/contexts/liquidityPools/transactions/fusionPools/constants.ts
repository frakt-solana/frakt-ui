const IS_DEVNET = process.env.REACT_APP_NETWORK === 'devnet';

export const FUSION_PROGRAM_PUBKEY = IS_DEVNET
  ? 'JCrmDPsceQew2naUT1UosJLaPW5K6QnV54frXjcBkXvc'
  : '';
