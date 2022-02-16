import { useState } from 'react';
import SwiperCore from 'swiper';

interface UseModalNFTsSlider {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  currentSlide: number;
  setCurrentSlide: (value: number) => void;
  slideTo: (index: number) => void;
  onSliderNavClick: () => void;
  setSwiper: (swiper: SwiperCore) => void;
  openOnCertainSlide: (index: number) => void;
}

export const useModalNFTsSlider = (): UseModalNFTsSlider => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [swiper, setSwiper] = useState(null);

  const slideTo = (index: number) => {
    if (swiper) swiper.slideTo(index);
  };

  const onSliderNavClick = () => {
    if (swiper) setCurrentSlide(swiper.activeIndex);
  };

  const openOnCertainSlide = (index: number) => {
    setIsModalVisible(true);
    setCurrentSlide(index);
    slideTo(index);
  };

  return {
    isModalVisible,
    setIsModalVisible,
    currentSlide,
    setCurrentSlide,
    slideTo,
    onSliderNavClick,
    setSwiper,
    openOnCertainSlide,
  };
};
