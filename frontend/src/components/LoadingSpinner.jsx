import React from 'react';

const LoadingSpinner = ({ stateName }) => {
  return (
    <>
      <div className="relative">
        <div className="ashoka-loader"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-white rounded-full opacity-0 animate-ping"></div>
        </div>
      </div>
      <h2 className="mt-8 text-2xl font-bold">Discovering {stateName}</h2>
      <p className="mt-2 text-lg opacity-75">Loading cultural heritage and attractions...</p>
      <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 via-white to-green-600 animate-shimmer"></div>
      </div>
    </>
  );
};

export default React.memo(LoadingSpinner); 