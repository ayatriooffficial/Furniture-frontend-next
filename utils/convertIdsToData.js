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
 * Smart converter - handles both old format (objects/arrays) and new format (object/Map with values)
 */
export const smartConvertCoreValues = (coreValues, CORE_VALUES) => {

  // Handle empty/null case
  if (!coreValues) {
    return [];
  }

  // LEGACY: Array format - CHECK THIS FIRST before object check
  if (Array.isArray(coreValues)) {
    // Empty array
    if (coreValues.length === 0) {
      return [];
    }

    // Old format: array of objects with 'heading' property (legacy DB format)
    if (
      typeof coreValues[0] === "object" &&
      coreValues[0] !== null &&
      "heading" in coreValues[0]
    ) {
      return coreValues; // Return as-is, already has the right format
    }

    // Old format: array of string IDs
    if (typeof coreValues[0] === "string") {
      return convertCoreValueIdsToObjects(coreValues, CORE_VALUES);
    }
  }

  // NEW FORMAT: Object/Map with key-value pairs { "warranty_programs": "10", "one_day_installation": null }
  if (typeof coreValues === "object" && !Array.isArray(coreValues)) {
    // Check if it's a Map object from MongoDB
    const entries =
      coreValues instanceof Map
        ? Array.from(coreValues.entries())
        : Object.entries(coreValues);

    return entries
      .map(([id, selectedValue]) => {
        const coreValue = CORE_VALUES[id];
        if (!coreValue) return null;

        // Generate dynamic heading based on selected value
        let heading = coreValue.heading;
        let icon = coreValue.icon;

        if (selectedValue) {
          if (id === "warranty_programs") {
            heading = `${selectedValue} Year Warranty`;
            if (selectedValue === "5") {
              icon = "/icons/5 year warrante.svg";
            } else if (selectedValue === "10") {
              icon = "/icons/10 year warrante.svg";
            } else if (selectedValue === "15") {
              icon = "/icons/15 year warrante.svg";
            } else  {
              // 20 year specific icon not found, keeping default
              icon = "/icons/warranty registration.svg";
            }
          } else if (id === "trial_period") {
            heading = `${selectedValue} Days Trial Period`;
            if (selectedValue === "45") {
              icon = "/icons/45 day trial prioed.svg";
            } else if (selectedValue === "60") {
              icon = "/icons/60 day trial prioed.svg";
            }
          } else if (id === "three_free_services") {
            heading = `${selectedValue} Free Services`;
          }
        }

        return {
          id,
          heading,
          text: coreValue.description,
          image: icon,
          selectedValue, // Include selected value for reference
        };
      })
      .filter((item) => item !== null);
  }

  return [];
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
