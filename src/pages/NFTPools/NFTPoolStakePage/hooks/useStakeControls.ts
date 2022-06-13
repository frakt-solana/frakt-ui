import { MutableRefObject, useRef, useState } from 'react';

import { UserNFT } from '../../../../state/userTokens/types';
import { CONTROLS } from '../constants';

type UseStakeControls = () => {
  toggleSelectNftsVisisble: (
    control: CONTROLS.SELECT_NFTS_INVENTORY | CONTROLS.SELECT_NFTS_LIQUIDITY,
  ) => () => void;
  activeControl: CONTROLS;
  toggleModal: (modal: CONTROLS) => () => void;
  showHideModal: (modal: CONTROLS) => (visible: boolean) => void;
  selectNftRef: MutableRefObject<HTMLDivElement>;
  onSelect: (nft: UserNFT) => void;
  onDeselect: () => void;
  selectedNft: UserNFT;
};

export const useStakeControls: UseStakeControls = () => {
  const [activeControl, setActiveControl] = useState<CONTROLS>(null);

  const showHideModal = (modal: CONTROLS) => (visible: boolean) => {
    if (visible) {
      setActiveControl(modal);
    } else {
      setActiveControl(null);
    }
  };

  const toggleModal = (modal: CONTROLS) => () => {
    if (activeControl === modal) {
      setActiveControl(null);
    } else {
      setActiveControl(modal);
    }
  };

  const selectNftRef = useRef<HTMLDivElement>(null);

  const toggleSelectNftsVisisble =
    (
      control: CONTROLS.SELECT_NFTS_INVENTORY | CONTROLS.SELECT_NFTS_LIQUIDITY,
    ) =>
    () => {
      if (activeControl === control) {
        setActiveControl(null);
        onDeselect();
      } else {
        setActiveControl(control);
        setTimeout(() => {
          selectNftRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 100);
      }
    };

  const [selectedNft, setSelectedNft] = useState<UserNFT>(null);

  const onSelect = (nft: UserNFT) => {
    setSelectedNft((prevNft) => (prevNft?.mint === nft.mint ? null : nft));
  };

  const onDeselect = () => {
    setSelectedNft(null);
  };

  return {
    selectedNft,
    toggleSelectNftsVisisble,
    activeControl,
    toggleModal,
    showHideModal,
    selectNftRef,
    onSelect,
    onDeselect,
  };
};
