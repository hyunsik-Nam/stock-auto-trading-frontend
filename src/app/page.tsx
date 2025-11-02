import React from 'react';
import StockSearch from '@/components/panels/StockSearch';
import StockStatus from '@/components/panels/StockStatus';

const MainPage = () => {
  return (
    <div className="flex flex-col h-full gap-1">
      <div className="flex-1 border border-gray-200 rounded-lg">
        <StockSearch />
      </div>
      <div className="flex-1 border border-gray-200 rounded-lg">
        <StockStatus />
      </div>
    </div>
  );
};

export default MainPage;
