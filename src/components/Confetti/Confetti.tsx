import { FC } from 'react';
import ReactConfetti from 'react-confetti';

const Confetti: FC = () => {
  const width = window.innerWidth - window.innerWidth * 0.05;
  const height = window && window.innerHeight;

  return (
    <>
      <ReactConfetti
        width={width}
        height={height}
        numberOfPieces={500}
        recycle={false}
      />
    </>
  );
};

export default Confetti;
