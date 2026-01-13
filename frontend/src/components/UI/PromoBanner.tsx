import React from 'react';
import { useGetSettingsQuery } from '../../services/settingsApi';

const PromoBanner: React.FC = () => {
  const { data } = useGetSettingsQuery();
  if (!data || !data.promoEnabled || !data.promoText) return null;
  return (
    <div className="relative bg-gradient-to-r from-red-600 to-orange-500 text-white py-2 sm:py-3 text-center overflow-hidden">
      <div className="animate-pulse px-2">
        <span className="font-bold text-sm sm:text-base md:text-lg">{data.promoText}</span>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-slide"></div>
    </div>
  );
};

export default PromoBanner;

