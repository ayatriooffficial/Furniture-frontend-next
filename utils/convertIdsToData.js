/**
 * Convert Feature IDs to Feature Objects
 * @param {string[]} featureIds - Array of feature IDs
 * @returns {object[]} Array of feature objects with title and description
 */
export const convertFeatureIdsToObjects = (featureIds = [], FEATURES = {}) => {
  if (!Array.isArray(featureIds) || featureIds.length === 0) {
    return [];
  }

  return featureIds
    .map((id) => {
      const feature = FEATURES[id];
      if (feature) {
        return {
          id,
          title: feature.title,
          description: feature.description,
          icon: feature.icon,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

/**
 * Convert Core Value IDs to Core Value Objects
 * @param {string[]} coreValueIds - Array of core value IDs
 * @returns {object[]} Array of core value objects with heading and description
 */
export const convertCoreValueIdsToObjects = (
  coreValueIds = [],
  CORE_VALUES = {},
) => {
  if (!Array.isArray(coreValueIds) || coreValueIds.length === 0) {
    return [];
  }

  return coreValueIds
    .map((id) => {
      const coreValue = CORE_VALUES[id];
      if (coreValue) {
        return {
          id,
          heading: coreValue.heading,
          text: coreValue.description,
          image: coreValue.icon,
        };
      }
      return null;
    })
    .filter((item) => item !== null);
};

/**
 * Smart converter - handles both old format (objects) and new format (IDs)
 */
export const smartConvertCoreValues = (coreValues, CORE_VALUES) => {
  if (!coreValues || coreValues.length === 0) {
    // Fallback: Return all available core values if none provided
    return Object.keys(CORE_VALUES).map((id) => ({
      id,
      heading: CORE_VALUES[id].heading,
      text: CORE_VALUES[id].description,
      image: CORE_VALUES[id].icon,
    }));
  }

  // If first item is an object with 'heading' property (old format from DB)
  if (typeof coreValues[0] === "object" && "heading" in coreValues[0]) {
    return coreValues; // Return as-is, already has the right format
  }

  // If items are strings (IDs - new format)
  if (typeof coreValues[0] === "string") {
    const converted = convertCoreValueIdsToObjects(coreValues, CORE_VALUES);
    // If conversion resulted in empty array, return all available values
    return converted.length > 0
      ? converted
      : Object.keys(CORE_VALUES).map((id) => ({
          id,
          heading: CORE_VALUES[id].heading,
          text: CORE_VALUES[id].description,
          image: CORE_VALUES[id].icon,
        }));
  }

  return coreValues;
};

/**
 * Smart converter - handles both old format (objects) and new format (IDs)
 */
export const smartConvertFeatures = (features, FEATURES) => {
  if (!features || features.length === 0) {
    return [];
  }

  // If first item is an object with 'title' property (old format from DB)
  if (typeof features[0] === "object" && "title" in features[0]) {
    return features; // Return as-is, already has the right format
  }

  // If items are strings (IDs - new format)
  if (typeof features[0] === "string") {
    return convertFeatureIdsToObjects(features, FEATURES);
  }

  return features;
};
