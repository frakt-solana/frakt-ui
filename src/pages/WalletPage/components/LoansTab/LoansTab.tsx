import { FC } from 'react';
import { LoanView } from '@frakters/nft-lending-v2/lib/accounts';

import LoanCard from '../../../../components/LoanCard';
import { Loader } from '../../../../components/Loader';
import { useLoans } from '../../../../contexts/loans';
import styles from './styles.module.scss';
import FakeInfinityScroll, {
  useFakeInfinityScroll,
} from '../../../../components/FakeInfinityScroll';

export const LoansTab: FC = () => {
  const { itemsToShow, next } = useFakeInfinityScroll(12);
  const { loading, loansProgramAccounts } = useLoans();

  return (
    <>
      {loading ? (
        <div className={styles.loader}>
          <Loader size={'large'} />
        </div>
      ) : (
        <FakeInfinityScroll
          itemsToShow={itemsToShow}
          next={next}
          wrapperClassName={styles.loansList}
          emptyMessage="No suitable loans found"
        >
          {loansProgramAccounts?.loan.map((nft: LoanView) => (
            <LoanCard key={nft.loanPubkey} nft={nft} />
          ))}
        </FakeInfinityScroll>
      )}
    </>
  );
};
