
export const CORE_VALUES = {
  premium_quality: {
    heading: "Premium Quality",
    description: "Finest materials selected for durability",
    icon: null,
  },
  handcrafted: {
    heading: "Handcrafted Excellence",
    description: "Expert artisans crafting each piece",
    icon: null,
  },
  quality_assured: {
    heading: "Quality Assured",
    description: "Every product passes rigorous testing",
    icon: null,
  },
  master_crafted: {
    heading: "Master Crafted",
    description: "Decades of expertise in every detail",
    icon: null,
  },

  // SUSTAINABILITY & ENVIRONMENT
  eco_conscious: {
    heading: "Eco-Conscious",
    description: "Commitment to environmental responsibility",
    icon: null,
  },
  sustainable_sourcing: {
    heading: "Sustainable Sourcing",
    description: "Responsibly sourced materials",
    icon: null,
  },
  carbon_neutral: {
    heading: "Carbon Neutral",
    description: "Offset carbon footprint in production",
    icon: null,
  },
  green_innovation: {
    heading: "Green Innovation",
    description: "Innovative sustainable practices",
    icon: null,
  },

  // LUXURY & ELEGANCE
  timeless_elegance: {
    heading: "Timeless Elegance",
    description: "Designs that transcend trends",
    icon: null,
  },
  luxury_experience: {
    heading: "Luxury Experience",
    description: "Premium feel in every interaction",
    icon: null,
  },
  sophisticated_design: {
    heading: "Sophisticated Design",
    description: "Refined and cultured aesthetics",
    icon: null,
  },
  exquisite_finish: {
    heading: "Exquisite Finish",
    description: "Meticulous attention to details",
    icon: null,
  },

  // INNOVATION & TECHNOLOGY
  cutting_edge: {
    heading: "Cutting Edge",
    description: "Latest technology and innovation",
    icon: null,
  },
  smart_technology: {
    heading: "Smart Technology",
    description: "Integrated intelligent solutions",
    icon: null,
  },
  innovative_design: {
    heading: "Innovative Design",
    description: "Breakthrough design concepts",
    icon: null,
  },
  future_ready: {
    heading: "Future Ready",
    description: "Designed for tomorrow's needs",
    icon: null,
  },

  // DURABILITY & RELIABILITY
  built_to_last: {
    heading: "Built to Last",
    description: "Engineered for longevity",
    icon: null,
  },
  lifetime_durability: {
    heading: "Lifetime Durability",
    description: "Guarantees lasting performance",
    icon: null,
  },
  reliable_performance: {
    heading: "Reliable Performance",
    description: "Consistent quality every time",
    icon: null,
  },
  tested_strength: {
    heading: "Tested Strength",
    description: "Proven durability through testing",
    icon: null,
  },

  // CUSTOMER FOCUS
  customer_first: {
    heading: "Customer First",
    description: "Your satisfaction is our priority",
    icon: null,
  },
  exceptional_service: {
    heading: "Exceptional Service",
    description: "Beyond expectations support",
    icon: null,
  },
  lifetime_support: {
    heading: "Lifetime Support",
    description: "We're here for you always",
    icon: null,
  },
  satisfaction_guarantee: {
    heading: "Satisfaction Guarantee",
    description: "100% customer satisfaction promise",
    icon: null,
  },

  // AESTHETICS & STYLE
  modern_aesthetic: {
    heading: "Modern Aesthetic",
    description: "Contemporary style for modern homes",
    icon: null,
  },
  minimalist_design: {
    heading: "Minimalist Design",
    description: "Clean lines and simple elegance",
    icon: null,
  },
  bold_statement: {
    heading: "Bold Statement",
    description: "Make your space stand out",
    icon: null,
  },
  versatile_style: {
    heading: "Versatile Style",
    description: "Complements any interior design",
    icon: null,
  },

  // PERFORMANCE & FUNCTION
  optimal_performance: {
    heading: "Optimal Performance",
    description: "Maximum efficiency and output",
    icon: null,
  },
  energy_efficient: {
    heading: "Energy Efficient",
    description: "Reduces energy consumption",
    icon: null,
  },
  space_saving: {
    heading: "Space Saving",
    description: "Maximizes your available space",
    icon: null,
  },
  multifunctional: {
    heading: "Multifunctional",
    description: "Serves multiple purposes seamlessly",
    icon: null,
  },

  // HEALTH & SAFETY
  health_conscious: {
    heading: "Health Conscious",
    description: "Safe materials for your family",
    icon: null,
  },
  safety_certified: {
    heading: "Safety Certified",
    description: "Meets all safety standards",
    icon: null,
  },
  hygienic_design: {
    heading: "Hygienic Design",
    description: "Easy to clean and maintain",
    icon: null,
  },
  non_toxic_materials: {
    heading: "Non-Toxic Materials",
    description: "100% safe for families",
    icon: null,
  },

  // HERITAGE & TRADITION
  heritage_brand: {
    heading: "Heritage Brand",
    description: "Decades of trusted tradition",
    icon: null,
  },
  family_owned: {
    heading: "Family Owned",
    description: "Proudly family-operated business",
    icon: null,
  },
  traditional_craft: {
    heading: "Traditional Craft",
    description: "Time-honored crafting techniques",
    icon: null,
  },
  legacy_quality: {
    heading: "Legacy Quality",
    description: "Multi-generational excellence",
    icon: null,
  },
};

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
  return Object.keys(CORE_VALUES);
};
