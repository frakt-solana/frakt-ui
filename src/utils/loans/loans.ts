import { Loan } from '@frakt-protocol/frakt-sdk';
import moment from 'moment';

export const caclTimeToRepay = (
  loan: Loan,
): {
  expiredAtUnix: number;
  startedAtUnix: number;
  loanDurationInSeconds: number;
} => {
  const { expiredAt, startedAt } = loan;

  const expiredAtUnix = moment(expiredAt).unix();
  const startedAtUnix = moment(startedAt).unix();

  const loanDurationInSeconds = expiredAtUnix - startedAtUnix;

  return { expiredAtUnix, startedAtUnix, loanDurationInSeconds };
};
