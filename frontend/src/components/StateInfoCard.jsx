import React from 'react';

const StateInfoCard = ({ stateData }) => {
  return (
    <>
      {/* About Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12 p-6 rounded-lg shadow-md info-card">
        <div className="flex-grow">
          <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">About {stateData.name}</h2>
          <p className="text-lg leading-relaxed mb-4">
            {stateData.name} is known for its {stateData.famousFor.slice(0, 3).join(", ")}.
            With a population of {stateData.population} and covering an area of {stateData.area},
            it is one of India's diverse and culturally rich {stateData.code && stateData.code.length === 2 ? "states" : "union territories"}.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="font-semibold">Capital</div>
              <div>{stateData.capital}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Languages</div>
              <div>{stateData.officialLanguages.length > 1 
                ? `${stateData.officialLanguages[0]} +${stateData.officialLanguages.length - 1}` 
                : stateData.officialLanguages[0]}
              </div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Literacy</div>
              <div>{stateData.literacyRate}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold">Code</div>
              <div>{stateData.code || "N/A"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-lg shadow-md info-card">
          <h2 className="text-xl font-semibold mb-4 section-header tricolor-accent">Basic Information</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="font-medium mr-2">Capital:</span>
              <span>{stateData.capital}</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">Area:</span>
              <span>{stateData.area}</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">Population:</span>
              <span>{stateData.population}</span>
            </li>
            <li className="flex items-start">
              <span className="font-medium mr-2">Literacy Rate:</span>
              <span>{stateData.literacyRate}</span>
            </li>
          </ul>
        </div>

        <div className="p-6 rounded-lg shadow-md info-card">
          <h2 className="text-xl font-semibold mb-4 section-header tricolor-accent">Languages & Symbols</h2>
          <ul className="space-y-2">
            <li className="flex flex-col">
              <span className="font-medium">Official Languages:</span>
              <span>{stateData.officialLanguages.join(", ")}</span>
            </li>
            {stateData.stateAnimal && (
              <li className="flex items-start">
                <span className="font-medium mr-2">State Animal:</span>
                <span>{stateData.stateAnimal}</span>
              </li>
            )}
            {stateData.utAnimal && (
              <li className="flex items-start">
                <span className="font-medium mr-2">UT Animal:</span>
                <span>{stateData.utAnimal}</span>
              </li>
            )}
            {stateData.stateBird && (
              <li className="flex items-start">
                <span className="font-medium mr-2">State Bird:</span>
                <span>{stateData.stateBird}</span>
              </li>
            )}
            {stateData.utBird && (
              <li className="flex items-start">
                <span className="font-medium mr-2">UT Bird:</span>
                <span>{stateData.utBird}</span>
              </li>
            )}
            {stateData.stateFlower && (
              <li className="flex items-start">
                <span className="font-medium mr-2">State Flower:</span>
                <span>{stateData.stateFlower}</span>
              </li>
            )}
            {stateData.utFlower && (
              <li className="flex items-start">
                <span className="font-medium mr-2">UT Flower:</span>
                <span>{stateData.utFlower}</span>
              </li>
            )}
            {stateData.stateTree && (
              <li className="flex items-start">
                <span className="font-medium mr-2">State Tree:</span>
                <span>{stateData.stateTree}</span>
              </li>
            )}
            {stateData.utTree && (
              <li className="flex items-start">
                <span className="font-medium mr-2">UT Tree:</span>
                <span>{stateData.utTree}</span>
              </li>
            )}
          </ul>
        </div>

        <div className="p-6 rounded-lg shadow-md info-card">
          <h2 className="text-xl font-semibold mb-4 section-header tricolor-accent">Famous For</h2>
          <ul className="list-disc pl-5 space-y-1">
            {stateData.famousFor.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* History */}
      <div className="mb-12 p-6 rounded-lg shadow-md info-card">
        <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">History</h2>
        <p className="text-lg leading-relaxed">{stateData.history}</p>
      </div>

      {/* Culture Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Festivals */}
        <div className="p-6 rounded-lg shadow-md info-card">
          <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">Festivals</h2>
          <ul className="list-disc pl-5 space-y-2">
            {stateData.festivals.map((festival, index) => (
              <li key={index} className="text-lg">{festival}</li>
            ))}
          </ul>
        </div>

        {/* Cuisine */}
        <div className="p-6 rounded-lg shadow-md info-card">
          <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">Cuisine</h2>
          <ul className="list-disc pl-5 space-y-2">
            {stateData.cuisine.map((dish, index) => (
              <li key={index} className="text-lg">{dish}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default React.memo(StateInfoCard); 