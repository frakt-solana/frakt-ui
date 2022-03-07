import classNames from 'classnames/bind';
import { FC, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { usePortal } from '../../../../hooks';
import styles from './LotteryModal.module.scss';

interface CardProps {
  imageUrl: string;
  className?: string;
}

const Card: FC<CardProps> = ({ imageUrl, className }) => {
  return (
    <div className={classNames(styles.card, className)}>
      <div
        className={styles.cardContent}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
    </div>
  );
};

interface CardLoadingProps {
  nftImages: string[];
}

const CardLoading: FC<CardLoadingProps> = ({ nftImages }) => {
  const timeoutRef = useRef(null);

  const timeoutTime = useRef<number>(200);

  const [imageIdx, setImageIdx] = useState<number>(0);

  const next = () =>
    setImageIdx((imageIdx) => {
      return imageIdx === nftImages.length - 1 ? 0 : imageIdx + 1;
    });

  useEffect(() => {
    timeoutRef.current = setTimeout(function tick() {
      next();
      setTimeout(tick, timeoutTime.current);
    }, timeoutTime.current);

    return () => clearTimeout(timeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Card imageUrl={nftImages[imageIdx]} />;
};

const CardWin: FC<CardProps> = ({ imageUrl }) => {
  return <Card imageUrl={imageUrl} className={styles.cardWin} />;
};

type UseLotteryModal = () => {
  isLotteryModalVisible: boolean;
  setIsLotteryModalVisible: (value: boolean) => void;
  prizeImg?: string;
  setPrizeImg: (string: string) => void;
  openLotteryModal: () => void;
};

export const useLotteryModal: UseLotteryModal = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [prizeImg, setPrizeImg] = useState<string>();

  const openLotteryModal = () => {
    setIsVisible(true);
  };

  return {
    isLotteryModalVisible: isVisible,
    setIsLotteryModalVisible: setIsVisible,
    prizeImg,
    setPrizeImg,
    openLotteryModal,
  };
};

interface LotteryModalProps {
  setIsVisible: (value: boolean) => void;
  prizeImg?: string;
  setPrizeImg: (string: string) => void;
  nftImages: string[];
}

export const LotteryModal: FC<LotteryModalProps> = ({
  setIsVisible,
  setPrizeImg,
  prizeImg,
  nftImages,
}) => {
  const target = usePortal('lottery-modal');

  const onClose = () => {
    if (!prizeImg) {
      return;
    }
    setIsVisible(false);
    setPrizeImg(null);
  };

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.cards}>
        {!prizeImg ? (
          <CardLoading nftImages={nftImages} />
        ) : (
          <CardWin imageUrl={prizeImg} />
        )}
      </div>
    </div>,
    target,
  );
};
