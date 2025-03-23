/**
 * Mapping between state codes used in the India map component and the knowindia package
 * 
 * The India map component uses some different state codes than the knowindia package.
 * This mapping helps convert between the two.
 */

// Map component code -> knowindia package code
export const mapToKnowIndia = {
  'OR': 'OD', // Odisha
  'CT': 'CG', // Chhattisgarh
  'UT': 'UK', // Uttarakhand
};

// knowindia package code -> Map component code
export const knowIndiaToMap = {
  'OD': 'OR', // Odisha
  'CG': 'CT', // Chhattisgarh
  'UK': 'UT', // Uttarakhand
};

// Map component state name -> knowindia package state name
export const stateNameMapping = {
  'odisha': 'odisha',
  'orissa': 'odisha', // Alternative name
  'chhattisgarh': 'chhattisgarh',
  'uttarakhand': 'uttarakhand',
  'uttaranchal': 'uttarakhand', // Alternative name
};

/**
 * Convert a map component state code to a knowindia package state code
 * @param {string} mapCode - The state code used in the map component
 * @returns {string} - The corresponding state code in the knowindia package
 */
export const convertMapCodeToKnowIndia = (mapCode) => {
  return mapToKnowIndia[mapCode] || mapCode;
};

/**
 * Convert a knowindia package state code to a map component state code
 * @param {string} knowIndiaCode - The state code used in the knowindia package
 * @returns {string} - The corresponding state code in the map component
 */
export const convertKnowIndiaCodeToMap = (knowIndiaCode) => {
  return knowIndiaToMap[knowIndiaCode] || knowIndiaCode;
};

/**
 * Convert a state name to the standardized name used in the knowindia package
 * @param {string} stateName - The state name to convert
 * @returns {string} - The standardized state name
 */
export const standardizeStateName = (stateName) => {
  const lowerCaseName = stateName.toLowerCase();
  return stateNameMapping[lowerCaseName] || lowerCaseName;
}; 