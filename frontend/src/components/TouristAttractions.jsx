import React from 'react';

const TouristAttractions = ({ attractions }) => {
  return (
    <div className="mb-12 p-6 rounded-lg shadow-md info-card">
      <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">Tourist Attractions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attractions.map((attraction, index) => (
          <div key={index} className="p-4 rounded-md attraction-card shadow">
            <h3 className="text-lg font-medium">{attraction.name}</h3>
            <p className="text-sm opacity-75">{attraction.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(TouristAttractions); 