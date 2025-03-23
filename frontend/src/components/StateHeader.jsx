import React from 'react';

const StateHeader = ({ stateData }) => {
  return (
    <div className="state-header text-center mt-12 mb-12 p-8 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {stateData.name}
      </h1>
      <div className="w-32 h-1 bg-white/50 mx-auto mb-6"></div>
      <p className="text-xl max-w-3xl mx-auto">
        Explore the rich culture, heritage, and attractions of {stateData.name}
      </p>
    </div>
  );
};

export default React.memo(StateHeader); 