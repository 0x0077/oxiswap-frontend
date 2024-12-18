'use client'
import { useState } from 'react';
import { observer } from "mobx-react";
import { useStores } from "@stores/useStores";
import { RemoveLiquidityProps } from "@utils/interface";
import BN from "@utils/BN";
import { Slider } from "@nextui-org/slider";
import Image from "next/image";
import SliderButton from "./RemoveSliderButton";
import WalletIcon from '@assets/icons/WalletIcon';


const RemoveSliderDiv: React.FC<Pick<RemoveLiquidityProps, 'pool' >> = observer(({ pool }) => {
  const [sliderValue, setSliderValue] = useState(0);
  const { poolStore, balanceStore, oracleStore, accountStore } = useStores();
  const exactBalance = balanceStore.getExactBalance(pool.poolAssetId, 9);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newAmount = e.target.value.replace(/[^0-9.]/g, '');
    if (newAmount.split('.').length > 2) {
      return; 
    }
    
    if (new BN(newAmount).gt(BN.ZERO)) {
      newAmount = newAmount.replace(/^0+(?=\d)/, '');
    }
    poolStore.setRemoveLiquidityAmounts(newAmount);
  };

  const handleSliderChange = (value: number | number[]) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    setSliderValue(newValue);
    const newAmount = new BN(exactBalance).mul(newValue).div(100).toFixed(9);
    poolStore.setRemoveLiquidityAmounts(newAmount);
    if ( newValue === 100 ) {
      poolStore.setRemoveAllLiquidity(true);
    }
  };

  const handleButtonClick = (percentage: number) => {
    const newAmount = new BN(exactBalance).mul(percentage).div(100).toFixed(9);
    setSliderValue(percentage);
    poolStore.setRemoveLiquidityAmounts(newAmount);
    if ( percentage === 100 ) {
      poolStore.setRemoveAllLiquidity(true);
    }
  };

  return (
    <div className="bg-oxi-bg-02 p-6 mt-1 mb-2 rounded-2xl w-full">
      <div className="flex justify-between items-center">
        <input
          type="text"
          autoComplete="off"
          autoCorrect="off"
          min={0}
          value={poolStore.removeLiquidityAmounts}
          placeholder="0.00"
          onChange={handleInputChange}
          className="bg-transparent text-3xl outline-none w-5/6 text-black appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        /> 
        <Image src="/position.svg" alt="assetIcon" width={22} height={22} />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-xs text-[#8f9ba7]">~${oracleStore.getAssetPrices(0)}</span>
        <div className="flex items-center">
          <span className="text-xs text-[#8f9ba7] mr-2">{exactBalance}</span>
          <WalletIcon width={16} height={16} className="text-text-100" />
        </div>
      </div>
      <div className="mt-6">
        <Slider   
          size="sm"
          step={1}
          showTooltip={true}
          maxValue={100} 
          minValue={0} 
          aria-label="Remove Liquidity Percentage"
          defaultValue={0}
          value={sliderValue}
          onChange={handleSliderChange}
          className="w-full" 
        />
      </div>
      <div className="flex justify-between w-full gap-4 mt-4">
        <SliderButton buttonName="25%" onClick={() => handleButtonClick(25)}/>
        <SliderButton buttonName="50%" onClick={() => handleButtonClick(50)}/>
        <SliderButton buttonName="75%" onClick={() => handleButtonClick(75)}/>
        <SliderButton buttonName="Max" onClick={() => handleButtonClick(100)}/>
      </div>
    </div>
  );
});

export default RemoveSliderDiv;