import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { states as knowIndiaStates, uts as knowIndiaUTs } from 'knowindia';
import { useTheme } from "../context/ThemeContext";
import { standardizeStateName } from "../utils/stateCodeMapping";
import "./StatePage.css"; // Import the CSS file

const StatePage = () => {
  const { stateName } = useParams();
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  useEffect(() => {
    console.log("StatePage - stateName from URL:", stateName);
    
    // Format state name: replace hyphens with spaces and lowercase
    const formattedStateName = stateName
      .split("-")
      .join(" ")
      .toLowerCase();
    
    console.log("StatePage - formattedStateName:", formattedStateName);
    
    // Standardize the state name using our mapping utility
    const standardizedName = standardizeStateName(formattedStateName);
    console.log("StatePage - standardizedName:", standardizedName);
    
    // Get state data directly from the knowindia package
    try {
      const allStates = knowIndiaStates();
      const allUTs = knowIndiaUTs();
      
      let foundStateData = null;
      
      // Check in states
      for (const code in allStates) {
        if (allStates[code].name.toLowerCase() === standardizedName) {
          foundStateData = { ...allStates[code], code };
          console.log(`StatePage - Found exact match in states: ${code} - ${allStates[code].name}`);
          break;
        }
      }
      
      // Check in UTs if not found in states
      if (!foundStateData) {
        for (const code in allUTs) {
          if (allUTs[code].name.toLowerCase() === standardizedName) {
            foundStateData = { ...allUTs[code], code };
            console.log(`StatePage - Found exact match in UTs: ${code} - ${allUTs[code].name}`);
            break;
          }
        }
      }
      
      // If still not found, try a more flexible approach
      if (!foundStateData) {
        console.log("StatePage - Trying more flexible name matching");
        
        // Check if any state name contains the search term
        for (const code in allStates) {
          if (allStates[code].name.toLowerCase().includes(standardizedName)) {
            foundStateData = { ...allStates[code], code };
            console.log(`StatePage - Found partial match in states: ${code} - ${allStates[code].name}`);
            break;
          }
        }
        
        // Check UTs as well
        if (!foundStateData) {
          for (const code in allUTs) {
            if (allUTs[code].name.toLowerCase().includes(standardizedName)) {
              foundStateData = { ...allUTs[code], code };
              console.log(`StatePage - Found partial match in UTs: ${code} - ${allUTs[code].name}`);
              break;
            }
          }
        }
      }
      
      console.log("StatePage - foundStateData:", foundStateData);
      
      setStateData(foundStateData);
    } catch (error) {
      console.error("Error getting state data:", error);
    }
    
    setLoading(false);
  }, [stateName]);
  
  // Format state name for display: replace hyphens with spaces and capitalize each word
  const displayStateName = stateName
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (loading) {
    return (
      <div className={`state-page-wrapper min-h-[80vh] w-full flex flex-col items-center justify-center text-center py-20 ${isDark ? 'dark-mode' : 'light-mode'}`}>
        <div className="relative">
          <div className="ashoka-loader"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full opacity-0 animate-ping"></div>
          </div>
        </div>
        <h2 className="mt-8 text-2xl font-bold">Discovering {displayStateName}</h2>
        <p className="mt-2 text-lg opacity-75">Loading cultural heritage and attractions...</p>
        <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 via-white to-green-600 animate-shimmer"></div>
        </div>
      </div>
    );
  }

  if (!stateData) {
    return (
      <div className={`min-h-[80vh] w-full flex flex-col items-center justify-center text-center py-20 ${isDark ? 'dark-mode' : 'light-mode'}`}>
        <h1 className="text-3xl font-bold">{`Welcome to ${displayStateName}`}</h1>
        <p className={`text-lg mt-2 mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          We couldn't find detailed information about {displayStateName}. Please try another state or union territory.
        </p>
        
        {/* Debug section */}
        <div className={`mt-8 p-4 border rounded-lg max-w-2xl mx-auto ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className="text-xl font-semibold mb-2">Debug Information</h2>
          <p className="mb-2">State name from URL: <code className={`px-1 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>{stateName}</code></p>
          <p className="mb-2">Formatted state name: <code className={`px-1 py-0.5 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>{stateName.split("-").join(" ").toLowerCase()}</code></p>
          
          <div className="mt-4">
            <h3 className="font-medium mb-1">Available States:</h3>
            <div className={`grid grid-cols-2 gap-2 text-left text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {Object.entries(knowIndiaStates()).map(([code, data]) => (
                <div key={code} className={`p-1 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} rounded`}>
                  <strong>{code}:</strong> {data.name}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-medium mb-1">Available UTs:</h3>
            <div className={`grid grid-cols-2 gap-2 text-left text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {Object.entries(knowIndiaUTs()).map(([code, data]) => (
                <div key={code} className={`p-1 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'} rounded`}>
                  <strong>{code}:</strong> {data.name}
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              // Try to load all states and UTs data
              try {
                const allStates = knowIndiaStates();
                const allUTs = knowIndiaUTs();
                
                console.log("All states:", allStates);
                console.log("All UTs:", allUTs);
                
                // Try to find a match
                const searchName = stateName.split("-").join(" ").toLowerCase();
                
                for (const code in allStates) {
                  if (allStates[code].name.toLowerCase().includes(searchName)) {
                    console.log(`Found potential match in states: ${code} - ${allStates[code].name}`);
                    setStateData({ ...allStates[code], code });
                    return;
                  }
                }
                
                for (const code in allUTs) {
                  if (allUTs[code].name.toLowerCase().includes(searchName)) {
                    console.log(`Found potential match in UTs: ${code} - ${allUTs[code].name}`);
                    setStateData({ ...allUTs[code], code });
                    return;
                  }
                }
                
                alert("No matching state or UT found in the knowindia package.");
              } catch (error) {
                console.error("Error in debug button:", error);
                alert("Error loading data. Check console for details.");
              }
            }}
          >
            Try to Find State Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`state-page-wrapper min-h-[80vh] w-full py-12 px-4 ${isDark ? 'dark-mode' : 'light-mode'}`}>
      {/* Decorative floating elements */}
      <div className="floating-element floating-element-1"></div>
      <div className="floating-element floating-element-2"></div>
      
      <div className="max-w-6xl mx-auto state-page-content relative z-10">
        {/* Header */}
        <div className="state-header text-center mt-12 mb-12 p-8 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {stateData.name}
          </h1>
          <div className="w-32 h-1 bg-white/50 mx-auto mb-6"></div>
          <p className="text-xl max-w-3xl mx-auto">
            Explore the rich culture, heritage, and attractions of {stateData.name}
          </p>
        </div>

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

        <div className="decorative-line"></div>

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

        <div className="decorative-line"></div>

        {/* Tourist Attractions */}
        <div className="mb-12 p-6 rounded-lg shadow-md info-card">
          <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">Tourist Attractions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stateData.touristAttractions.map((attraction, index) => (
              <div key={index} className="p-4 rounded-md attraction-card shadow">
                <h3 className="text-lg font-medium">{attraction.name}</h3>
                <p className="text-sm opacity-75">{attraction.type}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="decorative-line"></div>

        {/* Interesting Facts */}
        <div className="p-6 rounded-lg shadow-md info-card">
          <h2 className="text-2xl font-semibold mb-4 section-header tricolor-accent">Interesting Facts</h2>
          <ul className="list-disc pl-5 space-y-2">
            {stateData.interestingFacts.map((fact, index) => (
              <li key={index} className="text-lg">{fact}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatePage;
