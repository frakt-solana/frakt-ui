import { useCallback, useMemo, useState } from 'react';
import styles from './styles.module.scss';
import cardImage from './emptyImage.png';
import soundfile from './slotMachineSound.mp3';
import classNames from 'classnames';
interface Nft {
  nft: string;
}

interface Roulette {
  nfts?: Nft[];
}

interface Card extends Nft {
  isWonNft: boolean;
}

const Card = ({ nft, isWonNft }: Card): JSX.Element => (
  <li className={classNames([styles.card, { [styles.wonNft]: isWonNft }])}>
    <div className={styles.card_image_container}>
      <img
        className={styles.card_image}
        src={nft ? nft : cardImage}
        alt="roulette image"
      />
    </div>
    <div className={styles.card_background} />
  </li>
);

const nftsMock = [
  {
    nft: 'https://bucket-bykvu.s3.eu-central-1.amazonaws.com/wp-content/uploads/2022/01/https___hypebeast.com_image_2022_01_eminem-bored-ape-yacht-club-nft-450000-usd-purchase-001-900x600.jpg',
  },
  { nft: 'https://www.cointribune.com/app/uploads/2021/09/bayc2.jpg' },
  {
    nft: 'https://variety.com/wp-content/uploads/2021/10/Guy-oseary-ape.jpg?w=681&h=383&crop=1',
  },
  {
    nft: 'https://images.ctfassets.net/a9237abdyvg9/39i2MxooigoF9iaYpekQJ6/956017a647a0471999ecf52deec35c07/Yuga-Labs-Bored-Ape-Yacht-Club-5812.jpeg?fm=webp',
  },
  { nft: 'https://www.coin24.news/wp-content/uploads/2021/10/431652_5d12.png' },
];

function calcvw(v) {
  const w = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0,
  );
  return (v * w) / 100;
}

const Roulette = ({ nfts = nftsMock }: Roulette): JSX.Element => {
  const CARD_WIDTH = 19.444444;
  const SLIDER_ARRAY_LENGTH = 100;
  const STEP_COUNT = 5;
  const SLIDER_DURATION = '10000ms';
  const TRANSITION_PARAMS = `right ${SLIDER_DURATION} cubic-bezier(0, 0, .8 , 1)`;
  const SPACE_WIDTH = 15;
  const SLIDE_WIDTH = useMemo(() => +calcvw(CARD_WIDTH).toFixed(2), []);
  const DEFAULT_TRANSITION = useMemo(
    () => (SLIDE_WIDTH * 5 - window.innerWidth + SPACE_WIDTH * 3) / 2,
    [SLIDE_WIDTH],
  );

  const [transition, setTransition] = useState<number>(() => {
    return DEFAULT_TRANSITION;
  });
  const [transitionStyle, setTransitionStyle] =
    useState<string>(TRANSITION_PARAMS);

  const sliderArray = useMemo<Nft[]>(() => {
    let nftIndex = 0;
    const emptySliderArray = Array(SLIDER_ARRAY_LENGTH).fill({ nft: '' });
    const duplicatedSliderArray = emptySliderArray.map(() => {
      if (nftIndex === nfts.length) {
        nftIndex = 0;
      }
      const currentNft = nfts[nftIndex];
      nftIndex += 1;
      return currentNft;
    });
    return duplicatedSliderArray;
  }, [nfts]);

  const calcTransition = useCallback((isStepBack: boolean): number => {
    const stepBack = isStepBack ? STEP_COUNT : 0;
    return (
      +SLIDE_WIDTH.toFixed(2) * (sliderArray.length - stepBack) +
      transition +
      SPACE_WIDTH * (sliderArray.length - stepBack)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onStart = () => {
    if (transition) {
      setTransitionStyle(null);
    }
    setTransition(DEFAULT_TRANSITION);
    setTimeout(() => {
      setTransitionStyle(() => {
        setTransition(calcTransition(true));
        return TRANSITION_PARAMS;
      });
    }, 0);
    const audio = new Audio(soundfile);
    audio.play();
  };

  const onSkip = () => {
    setTransitionStyle(null);
  };

  return (
    <>
      <div className={styles.rouletteContainer}>
        <ul
          className={styles.cardContainer}
          style={{
            right: `${transition}px`,
            width: `${calcTransition(false)}px`,
            transition: transitionStyle,
          }}
        >
          {sliderArray.map(({ nft }, idx) => (
            <Card
              nft={nft}
              key={idx}
              isWonNft={sliderArray.length - 3 === idx}
            />
          ))}
        </ul>
        <button onClick={onStart} className={styles.startButton}>
          START
        </button>
        <button onClick={onSkip} className={styles.skipButton}>
          SKIP
        </button>
      </div>
    </>
  );
};

export default Roulette;
