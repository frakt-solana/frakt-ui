import styles from './styles.module.scss';
import cardImage from './9.png';
import { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

const slides = [
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: '' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: '' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
  { url: 'https://ychef.files.bbci.co.uk/976x549/p054n6rx.jpg' },
];

const Card = ({
  url,
  index,
  currentIndex,
}: {
  url: string;
  index: number;
  currentIndex: number;
}): JSX.Element => (
  <div className={classNames(styles.card, styles[`card${index}`])}>
    <div className={styles.card_image_container}>
      <img className={styles.card_image} src={url ? url : cardImage} alt="" />
    </div>
    <div className={styles.card_background} />
  </div>
);

const SlickCarousel = (): JSX.Element => {
  const interval = useRef<number | null>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const cardWidth = window.innerWidth * 0.23541667;
  const spaceWidth = window.innerWidth * 0.001;
  const containerWidth = useMemo(
    () => cardWidth * slides.length + spaceWidth * (slides.length - 1),
    [cardWidth, spaceWidth],
  );

  // const start = () => {
  //     interval.current = window.setInterval(() => {
  //         setCurrentIndex((index) => {
  //             if (index === slides.length - 6) {
  //                 clearInterval(interval.current);
  //             }
  //             return index + 1;
  //         });
  //     }, 100);
  // };
  // useEffect(() => {
  //     start();
  // }, []);

  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div className={styles['carousel']}>
        <div
          className={styles['carousel-container']}
          // style={{
          //     width: containerWidth,
          //     transform: `translateX(-${(cardWidth + spaceWidth) * currentIndex + cardWidth / 2
          //         }px)`,
          // }}
        >
          {slides.map(({ url }, index) => (
            <Card
              url={url}
              key={index}
              index={index}
              currentIndex={currentIndex}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SlickCarousel;
