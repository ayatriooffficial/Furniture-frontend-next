export const CORE_VALUES = {
  // INSTALLATION & SETUP
  one_day_installation: {
    heading: "One Day Installation",
    description:
      "We committed to your satisfaction and helping you realize your dream home",
    icon: "/icons/instalation.svg",
  },

  // FREE SERVICES
  three_free_services: {
    heading: "3 Free Services",
    description:
      "We committed to offer maintenance / technical service on our product",
    icon: "/icons/3service.svg",
  },

  // WARRANTY OPTIONS
  warranty_programs: {
    heading: "5/10/15/20 Year Warranty",
    description: "As Ayatrio member, use warranty registration services",
    icon: "/icons/warranty registration.svg",
  },

  // TRIAL PERIOD
  trial_period: {
    heading: "45/60 Days Trial Period",
    description: "Use for 60 days, yet not satisfied pay you back",
    icon: "/icons/60 day trial prioed.svg",
  },

  // ECO-FRIENDLY
  eco_friendly: {
    heading: "100% Eco-Friendly",
    description:
      "We committed on natural or low-emission materials, emit fewer toxic substances",
    icon: "/icons/recyle.svg",
  },
};

// Configuration for core values with selectable options
export const CORE_VALUE_OPTIONS = {
  three_free_services: ["3", "5", "7"],
  warranty_programs: ["5", "10", "15", "20"],
  trial_period: ["45", "60"],
};

export const hasOptions = (coreValueId) => {
  return coreValueId in CORE_VALUE_OPTIONS;
};

export const CORE_VALUE_IDS = Object.keys(CORE_VALUES);

/**
 * HELPER FUNCTIONS
 */

export const getCoreValue = (coreValueId) => {
  return CORE_VALUES[coreValueId] || null;
};

export const getCoreValues = (coreValueIds = []) => {
  return coreValueIds
    .map((id) => ({ id, ...CORE_VALUES[id] }))
    .filter((cv) => cv.heading);
};

export const validateCoreValueIds = (coreValueIds) => {
  return coreValueIds.every((id) => id in CORE_VALUES);
};

export const getAvailableCoreValueIds = () => {
  return CORE_VALUE_IDS;
};
