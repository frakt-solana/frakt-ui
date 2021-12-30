import React, { FC, useState } from 'react';
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

SwiperCore.use([FreeMode, Navigation, Thumbs, Scrollbar]);

interface NFTListProps {
  safetyBoxes: SafetyBoxWithMetadata[];
  className?: string;
}

export const NFTList: FC<NFTListProps> = ({ safetyBoxes, className }) => {
  const [isModal, setIsModal] = useState(false);

  const onNftItemClick = () => () => {
    setIsModal(true);
  };

  return (
    <>
      <ul className={classNames(styles.nftList, className)}>
        {safetyBoxes.map((nft) => (
          <li
            className={styles.nftListItem}
            key={nft.vaultPubkey}
            onClick={onNftItemClick()}
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
        visible={isModal}
        className={styles.modal}
        width={820}
        footer={false}
        centered
        onCancel={() => setIsModal(false)}
      >
        <div className={styles.sliderWrapper}>
          <Swiper navigation={true} autoHeight={true}>
            {safetyBoxes.map((slide) => (
              <SwiperSlide key={slide.nftMint} className={styles.slide}>
                <div
                  style={{ backgroundImage: `url(${slide.nftImage})` }}
                  className={styles.slideImage}
                />
                <div className={styles.slideInfoBlock}>
                  {/*//TODO need to insert correct link and delete text 'Collection Name'*/}
                  {!slide.nftCollectionName && (
                    <p className={styles.collection}>
                      <a href={'#'}>{slide.nftCollectionName}Collection Name</a>
                    </p>
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
                  <p className={styles.nftInfoItem}>
                    {shortenAddress(slide.nftMint)}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Modal>
    </>
  );
};
