import React from 'react';

import useWindowSize from 'react-use/lib/useWindowSize';

import ReactConfetti from 'react-confetti';
import { useDispatch } from 'react-redux';
import { commonActions } from '../../state/common/actions';

export const showConfetti = (): void => {
  const dispatch = useDispatch();

  dispatch(commonActions.setConfetti({ isVisible: true }));
  setTimeout(() => {
    dispatch(commonActions.setConfetti({ isVisible: false }));
  }, 3000);
};

const Confetti: React.FC<{ start: boolean }> = ({ start }) => {
  const { width, height } = useWindowSize();

  return start ? (
    <ReactConfetti
      numberOfPieces={500}
      recycle={false}
      run={true}
      width={width}
      height={height}
    />
  ) : null;
};

export default Confetti;
