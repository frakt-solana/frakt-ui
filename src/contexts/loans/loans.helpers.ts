import { getAllProgramAccounts } from '@frakters/nft-lending-v2';
import { Connection, PublicKey } from '@solana/web3.js';

import { LOANS_PROGRAM_PUBKEY } from './loans.constants';
import { AvailableCollections, LoansProgramAccounts } from './loans.model';

export const fetchAvailableCollections = async (): Promise<
  AvailableCollections[]
> => {
  try {
    const response = await (
      await fetch('https://ezekiel9218.github.io/Data/whitelist.json')
    ).json();

    return response;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};

export const fetchLoansProgramAccounts = async (
  connection: Connection,
): Promise<LoansProgramAccounts> => {
  return await getAllProgramAccounts(
    new PublicKey(LOANS_PROGRAM_PUBKEY),
    connection,
  );
};
