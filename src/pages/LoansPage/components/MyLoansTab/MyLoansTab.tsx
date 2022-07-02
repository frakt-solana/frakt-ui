import { Loan } from '@frakt-protocol/frakt-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../../../components/Button';
import { SearchInput } from '../../../../components/SearchInput';
import { commonActions } from '../../../../state/common/actions';
import { selectUserLoans } from '../../../../state/loans/selectors';
import { LoansList } from '../../../WalletPage/components/LoansList';
import { useLoansPage } from '../../hooks';
import styles from './MyLoansTab.module.scss';

export const MyLoansTab = (): JSX.Element => {
  const { connected } = useWallet();

  const { search, searchItems, setSearch } = useLoansPage();
  const userLoans: Loan[] = useSelector(selectUserLoans);

  const totalDebt = userLoans.reduce(
    (acc, { repayValue }) => acc + repayValue,
    0,
  );
  const totalBorrowed = userLoans.reduce(
    (acc, { loanValue }) => acc + loanValue,
    0,
  );

  return (
    <div className={styles.wrapper}>
      {connected ? (
        <>
          <div className={styles.content}>
            <SearchInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value || '');
                searchItems(e.target.value || '');
              }}
              className={styles.search}
              placeholder="Search by NFT name"
            />
            <div className={styles.valuesWrapper}>
              <p className={styles.value}>
                Total borrowed: <span>{totalBorrowed} SOL</span>
              </p>
              <p className={styles.value}>
                Total Debt: <span>{totalDebt} SOL</span>
              </p>
            </div>
            <div>
              <p>Selected collections</p>
            </div>
          </div>
          <LoansList />
        </>
      ) : (
        <ConnectWalletSection />
      )}
    </div>
  );
};

const ConnectWalletSection = () => {
  const dispatch = useDispatch();

  return (
    <div className={styles.connectWallet}>
      <p className={styles.connectWalletText}>
        Connect your wallet to check if you have any active loans
      </p>
      <Button
        type="alternative"
        className={styles.connectWalletBtn}
        onClick={() =>
          dispatch(commonActions.setWalletModal({ isVisible: true }))
        }
      >
        Connect wallet
      </Button>
    </div>
  );
};
