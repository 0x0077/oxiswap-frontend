'use client';

import React, { useState, useEffect } from 'react';
import SwapCard from '@components/Swap/SwapCard';
import SelectAsset from '@components/Swap/SelectAsset';
import SwapConfirm from '@components/Swap/SwapConfirm';
import SwapSetting from '@components/Swap/SwapSetting';
import SwapPending from '@components/Swap/SwapPending';
import { Asset } from '@utils/interface';
import { observer } from 'mobx-react';
import { useStores } from '@stores/useStores';
import SwapNotification from '@components/Swap/SwapNotification';
import { useWallet } from '@hooks/useWallet';
import PopupModal from '@components/PopupModal';
import { AssetConfig } from "@utils/interface";
import { fetchServerAssetConfig } from "@utils/api";

interface SwapPageContentProps {
  initialAssetConfig: AssetConfig;
}

export const SwapPageContent = observer(({ initialAssetConfig }: SwapPageContentProps) => {
  const [isAssetCardOpen, setIsAssetCardOpen] = useState(false);
  const [isSwapCardOpen, setIsSwapCardOpen] = useState(false);
  const [isSetCardOpen, setIsSetCardOpen] = useState(false);
  const [isPendingCardOpen, setIsPendingCardOpen] = useState(false);
  const [isFromAsset, setIsFromAsset] = useState(false);
  const { swapStore, buttonStore, notificationStore } = useStores();

  const { connect } = useWallet();

  useEffect(() => {
    async function fetchAssetConfig() {
      const assetConfig = await fetchServerAssetConfig();
      swapStore.setAsset(assetConfig.assets);
      swapStore.setPopularAssets(assetConfig.popularAssets);
    }
    fetchAssetConfig();
  },[])

  const handleAssetCardOpen = (isFrom: boolean) => {
    setIsAssetCardOpen(true);
    setIsFromAsset(isFrom);
  };

  const handleAssetCardClose = () => {
    setIsAssetCardOpen(false);
  };

  const handleSwapCardOpen = () => {
    setIsSwapCardOpen(true);
  };

  const handleSwapCardClose = () => {
    setIsSwapCardOpen(false);
    buttonStore.setSwapButton(
      'Swap', 
      false, 
      'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-all duration-300'
    );
  };

  const handleSelectWalletCardOpen = () => {
    connect();
  };

  const handleSetCardOpen = () => {
    setIsSetCardOpen(true);
  };

  const handleSetCardClose = () => {
    setIsSetCardOpen(false);
  };

  const handleSwapPendingOpen = () => {
    setIsPendingCardOpen(true);
  };

  const handleSwapPendingClose = () => {
    setIsPendingCardOpen(false);
    setIsSwapCardOpen(false);
    swapStore.setInitalize();
  };


  return (
    <main className="flex flex-col overflow-hidden w-full pt-16 md:pt-20">
      <SwapCard
        onAssetCardOpen={handleAssetCardOpen}
        onSwapClose={handleSwapCardOpen}
        onConnectOpen={handleSelectWalletCardOpen}
        onSetClose={handleSetCardOpen}
      />
      <PopupModal isOpen={isAssetCardOpen} onClose={handleAssetCardClose}>
        <SelectAsset
          onAction={handleAssetCardClose}
          assets={swapStore.assets as unknown as Asset[]}
          popularAssets={swapStore.popularAssets}
          isFromAsset={isFromAsset}
          isSwapAction={true}
        />
      </PopupModal>

      <PopupModal isOpen={isSwapCardOpen} onClose={handleSwapCardClose}>
        <SwapConfirm
          onAction={handleSwapCardClose}
          onSwap={handleSwapPendingOpen}
        />
      </PopupModal>

      <PopupModal isOpen={isSetCardOpen} onClose={handleSetCardClose}>
        <SwapSetting onAction={handleSetCardClose} />
      </PopupModal>

      <PopupModal isOpen={isPendingCardOpen} onClose={handleSwapPendingClose}>
        <SwapPending fromAmount={swapStore.fromAmount} toAmount={swapStore.toAmount} onAction={handleSwapPendingClose} />
      </PopupModal>

      <div className='relative z-50'>
        <div className='fixed right-0 top-32 w-72 h-auto flex flex-col'>
          {notificationStore.notifications.length > 0 && (
            <SwapNotification />
          )}
        </div>
      </div>
    </main>
  );
});

