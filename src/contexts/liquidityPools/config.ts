const devnet = {
  PROGRAM_PUBKEY: 'JCrmDPsceQew2naUT1UosJLaPW5K6QnV54frXjcBkXvc',
};

const mainnet = {
  PROGRAM_PUBKEY: '',
};

export default process.env.REACT_APP_NETWORK === 'devnet' ? devnet : mainnet;
