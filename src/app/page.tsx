import React from 'react';
import StockSearch from '@/components/panels/StockSearch';
import StockStatus from '@/components/panels/StockStatus';

const MainPage = () => {
  return (
    <>
      <StockSearch />
      <StockStatus />
    </>
  );
};

export default MainPage;
