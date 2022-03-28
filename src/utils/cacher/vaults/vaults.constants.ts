//? We have a bug in contract that there are can be nfts with store 11111111111111111111111111111111 for really old vaults but it's valid.
//? Need to ignore old vaults from filtering delisted nfts
export const IGNORE_DELISTED_NFTS_VAULTS_PUBKEYS = [
  '4hmc2TFXg6HcM94pUDzBRbLcMjKTWu95p23HymQETN9v',
  '5jMVo2SHXSB3P2CPT2Qu5kFvTuNwfDKuBwxLJiV452nM',
  'AnbtvfSSQ54V9im2NuqQkbptPHvJEYa5A34u3okZYoGr',
  '2x1R3HJQuhgSoCPReSS1PUoV7XdrCGuHs3shsgaemoPa',
];
