import React, { Dispatch, FC, useRef } from 'react';
import { Modal } from 'antd';
import styles from './stalys.module.scss';
import { CloseModalIcon } from '../../icons/CloseModalIcon';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../constants';
import { copyToClipboard, getCollectionThumbnailUrl } from '../../utils';
import { shortenAddress } from '../../utils/solanaUtils';
import Tooltip from '../Tooltip';
import { CopyClipboardIcon } from '../../icons/CopyClipboardIcon';
import { SafetyBoxWithMetadata } from '../../contexts/fraktion';
import { CollectionData } from '../../utils/collections';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

interface ModalNFTsSliderProps {
  isModalVisible: boolean;
  currentSlide: number;
  className?: string;
  safetyBoxes: any; // SafetyBoxWithMetadata[]
  nftCollections: any; // CollectionData[]
  onSliderNavClick: () => () => void;
  setIsModalVisible: (status: boolean) => void;
  setSwiper: Dispatch<any>;
}

export const ModalNFTsSlider: FC<ModalNFTsSliderProps> = ({
  className,
  safetyBoxes,
  nftCollections,
  isModalVisible,
  currentSlide,
  setIsModalVisible,
  setSwiper,
  onSliderNavClick,
}) => {
  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const safetyBoxesWithCollectionData: Array<
    SafetyBoxWithMetadata & { collectionInfo: CollectionData }
  > = safetyBoxes.map((box) => ({
    ...box,
    collectionInfo: nftCollections.find(
      (coll) => coll.collectionName === box.nftCollectionName,
    ),
  }));

  return (
    <Modal
      visible={isModalVisible}
      className={`${styles.modal} ${className}`}
      width={820}
      footer={false}
      closable={false}
      centered
      onCancel={() => setIsModalVisible(false)}
    >
      <div className={styles.closeModalSection}>
        <span className={styles.slideNumber}>
          {currentSlide + 1}/{safetyBoxes.length}
        </span>
        <div
          className={styles.closeModalIcon}
          onClick={() => setIsModalVisible(false)}
        >
          <CloseModalIcon className={styles.closeIcon} />
        </div>
      </div>
      <div className={styles.sliderWrapper}>
        <Swiper
          navigation={{
            prevEl: prevBtn.current,
            nextEl: nextBtn.current,
          }}
          initialSlide={currentSlide}
          onSwiper={setSwiper}
          autoHeight={true}
          onSlideChange={onSliderNavClick()}
        >
          {safetyBoxes.map((slide) => (
            <SwiperSlide key={slide.nftId} className={styles.slide}>
              <div
                style={{ backgroundImage: `url(${slide.nftImage})` }}
                className={styles.slideImage}
              />
              <div className={styles.slideInfoBlock}>
                {slide.collectionInfo?.collectionName && (
                  <NavLink
                    to={`${PATHS.COLLECTION}/${slide.collectionInfo?.collectionName}`}
                    className={styles.collectionLink}
                  >
                    <div
                      className={styles.collectionIcon}
                      style={{
                        backgroundImage: `url(${getCollectionThumbnailUrl(
                          slide.collectionInfo?.thumbnailPath,
                        )})`,
                      }}
                    />
                    <p className={styles.collectionName}>
                      {slide.collectionInfo?.collectionName}
                    </p>
                  </NavLink>
                )}
                <h5 className={styles.nftTitle}>{slide.nftId}</h5>
                {slide.nftDescription && (
                  <p className={styles.NftDescription}>
                    {slide.nftDescription}
                  </p>
                )}
                {!!slide.nftAttributes?.length && (
                  <div className={styles.attributesTable}>
                    {slide.nftAttributes.map(({ trait_type, value }, idx) => (
                      <div key={idx} className={styles.attributesTable__row}>
                        <p>{trait_type}</p>
                        <p>{value}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className={styles.nftInfoLabel}>NFT MINT</p>
                <p
                  className={styles.nftInfoItem}
                  onClick={() => copyToClipboard(slide.nftMint)}
                >
                  {shortenAddress(slide.nftId)}
                  <Tooltip
                    placement="bottom"
                    trigger="hover"
                    overlay="Click to copy to clipboard"
                  >
                    <CopyClipboardIcon className={styles.copyIcon} width={24} />
                  </Tooltip>
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div
          ref={prevBtn}
          className={styles.sliderNavPrev}
          onClick={onSliderNavClick()}
        />
        <div
          ref={nextBtn}
          className={styles.sliderNavNext}
          onClick={onSliderNavClick()}
        />
      </div>
    </Modal>
  );
};
