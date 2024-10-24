import React from "react";
import Image from "next/image";
import { PoolDetailProps } from "@utils/interface";
import DrawAssetIcon from "@components/AssetIcon/DrawAssetIcon";

const PoolNameDiv = React.memo(({ assets }: Pick<PoolDetailProps, 'assets'>) => (
  <div className="flex-shrink-0 flex flex-row items-center justify-start rounded-xl text-base text-black py-2 px-4 space-x-2 w-auto">
    {assets.map((asset, index) => (
      <React.Fragment key={index}>
        {asset.icon ? (
          <Image src={asset.icon} alt={asset.symbol} width={16} height={16} priority={index === 0} />
        ) : (
          <DrawAssetIcon assetName={asset.name} className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[8px]" />
        )}
        <span>{asset.symbol}</span>
        {index < assets.length - 1 && <span className="mx-1 text-gray-500">/</span>}
      </React.Fragment>
    ))}
  </div>
));

export default PoolNameDiv;