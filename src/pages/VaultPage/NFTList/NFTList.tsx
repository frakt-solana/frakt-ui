import React, { FC, useRef, useState } from 'react';
import styles from './styles.module.scss';
import { SafetyBoxWithMetadata } from '../../../contexts/fraktion';
import classNames from 'classnames';
import { shortenAddress } from '../../../utils/solanaUtils';
import { Modal } from 'antd';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.scss';
import 'swiper/modules/pagination/pagination.scss';
import 'swiper/modules/thumbs/thumbs';
import SwiperCore, { FreeMode, Navigation, Scrollbar, Thumbs } from 'swiper';
import { CopyClipboardIcon, CloseModalIcon } from '../../../icons';
import { CollectionData } from '../../../utils/collections';
import { NavLink } from 'react-router-dom';
import { PATHS } from '../../../constants';
import { copyToClipboard, getCollectionThumbnailUrl } from '../../../utils';
import Tooltip from '../../../components/Tooltip';

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

interface NFTListProps {
  safetyBoxes?: SafetyBoxWithMetadata[];
  nftCollections: CollectionData[];
  className?: string;
}

export const NFTList: FC<NFTListProps> = ({
  safetyBoxes = [],
  nftCollections,
  className,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [swiper, setSwiper] = useState(null);

  const safetyBoxesWithCollectionData: Array<
    SafetyBoxWithMetadata & { collectionInfo: CollectionData }
  > = safetyBoxes.map((box) => ({
    ...box,
    collectionInfo: nftCollections.find(
      (coll) => coll.collectionName === box.nftCollectionName,
    ),
  }));

  const slideTo = (index) => {
    if (swiper) swiper.slideTo(index);
  };

  const prevBtn = useRef<HTMLDivElement>(null);
  const nextBtn = useRef<HTMLDivElement>(null);

  const onNftItemClick = (index) => () => {
    setIsModalVisible(true);
    setCurrentSlide(index);
    slideTo(index);
  };

  const onSliderNavClick = () => () => {
    if (swiper) setCurrentSlide(swiper.activeIndex);
  };

  return (
    <div className={styles.wrapper}>
      <ul className={classNames(styles.nftList, className)}>
        {safetyBoxes.map((nft, index) => (
          <li
            className={styles.nftListItem}
            key={nft.nftMint}
            onClick={onNftItemClick(index)}
          >
            <div
              style={{ backgroundImage: `url(${nft.nftImage})` }}
              className={styles.nftImage}
            />
            <div className={styles.nftInfoBlock}>
              <h5 className={styles.nftTitle}>{nft.nftName}</h5>
              <span className={styles.nftInfoLabel}>NFT MINT</span>
              <span className={styles.nftInfoItem}>
                {shortenAddress(nft.nftMint)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <Modal
        visible={isModalVisible}
        className={styles.modal}
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
          >
            {safetyBoxesWithCollectionData.map((slide) => (
              <SwiperSlide key={slide.nftMint} className={styles.slide}>
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
                  <h5 className={styles.nftTitle}>{slide.nftName}</h5>
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
                    {shortenAddress(slide.nftMint)}
                    <Tooltip
                      placement="bottom"
                      trigger="hover"
                      overlay="Click to copy to clipboard"
                    >
                      <CopyClipboardIcon
                        className={styles.copyIcon}
                        width={24}
                      />
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
    </div>
  );
};
