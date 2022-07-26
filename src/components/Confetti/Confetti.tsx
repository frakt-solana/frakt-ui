import { FC } from 'react';
import ReactConfetti from 'react-confetti';
import { useDispatch, useSelector } from 'react-redux';

import { commonActions } from '../../state/common/actions';
import { selectConfettiVisible } from '../../state/common/selectors';

const Confetti: FC = () => {
  const dispatch = useDispatch();
  const confettiVisible = useSelector(selectConfettiVisible);

  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <>
      {confettiVisible && (
        <ReactConfetti
          numberOfPieces={500}
          recycle={false}
          run={true}
          width={width}
          height={height}
          confettiSource={{
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: window.innerHeight,
          }}
          onConfettiComplete={() => {
            dispatch(commonActions.setConfetti({ isVisible: false }));
          }}
        />
      )}
    </>
  );
};

export default Confetti;
