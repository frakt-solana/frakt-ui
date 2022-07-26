import { FC } from 'react';
import ReactConfetti from 'react-confetti';

const Confetti: FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const width = window.innerWidth - window.innerWidth * 0.05;
  const height = window.screen.height;

  return isVisible ? (
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
