
export const FEATURES = {
  // DURABILITY & QUALITY
  high_durability: {
    title: "High Durability",
    description: "Built for long-lasting performance",
    icon: "/features/durable.png",
  },
  premium_quality: {
    title: "Premium Quality",
    description: "Best-in-class materials and craftsmanship",
    icon: "/features/premium.png",
  },
  weatherproof: {
    title: "Weather Resistant",
    description: "Withstands extreme weather conditions",
    icon: "/features/rainprotection.png",
  },
  uv_resistant: {
    title: "UV Resistant",
    description: "Fades resistant for outdoor durability",
    icon: "/features/uvresistant.png",
  },

  // FINISH & AESTHETICS
  luxury_finish: {
    title: "Luxury Finish",
    description: "Premium polished surface",
     icon: "/features/finish.png",
  },
  glossy_finish: {
    title: "Glossy Finish",
    description: "High-shine reflective surface",
    icon: null,
  },
  matte_finish: {
    title: "Matte Finish",
    description: "Non-reflective elegant surface",
    icon: null,
  },
  textured_surface: {
    title: "Textured Surface",
    description: "Anti-slip textured finish",
    icon: "/icons/Slip Resistant.svg",
  },

  // MAINTENANCE & CARE
  easy_maintenance: {
    title: "Easy Maintenance",
    description: "Simple cleaning and upkeep",
    icon: "/icons/mantanace.svg",
  },
  stain_resistant: {
    title: "Stain Resistant",
    description: "Resists liquids and stains effectively",
    icon: null,
  },
  waterproof: {
    title: "Waterproof",
    description: "100% water resistant",
    icon: "/icons/waterproof.svg",
  },
  scratch_resistant: {
    title: "Scratch Resistant",
    description: "Durable against scratches and marks",
    icon: null,
  },

  // INSTALLATION & SETUP
  easy_installation: {
    title: "Easy Installation",
    description: "Quick and simple setup process",
    icon: "/icons/instalation.svg",
  },
  diy_friendly: {
    title: "DIY Friendly",
    description: "Can be installed without professionals",
    icon: null,
  },
  no_grout_required: {
    title: "No Grout Required",
    description: "Grout-free installation system",
    icon: null,
  },
  pre_assembled: {
    title: "Pre-Assembled",
    description: "Comes partially or fully assembled",
    icon: null,
  },

  // DIMENSIONS & SPACE
  compact_design: {
    title: "Compact Design",
    description: "Space-saving compact size",
    icon: null,
  },
  large_format: {
    title: "Large Format",
    description: "Extra-large size tiles or panels",
    icon: null,
  },
  lightweight: {
    title: "Lightweight",
    description: "Easy to handle and transport",
    icon: null,
  },
  deep_dimensions: {
    title: "Deep Dimensions",
    description: "Substantial depth for dimension",
    icon: null,
  },

  // ENVIRONMENTAL & HEALTH
  eco_friendly: {
    title: "Eco-Friendly",
    description: "Environmentally sustainable materials",
    icon: "/icons/recyle.svg",
  },
  low_voc: {
    title: "Low VOC",
    description: "Low volatile organic compounds",
    icon: null,
  },
  non_toxic: {
    title: "Non-Toxic",
    description: "Safe for families and pets",
    icon: null,
  },
  recyclable: {
    title: "Recyclable",
    description: "100% recyclable materials",
    icon: "/icons/recyle.svg",
  },

  // THERMAL & ACOUSTIC
  insulating: {
    title: "Insulating",
    description: "Provides thermal insulation",
    icon: null,
  },
  soundproof: {
    title: "Soundproof",
    description: "Reduces noise and sound",
    icon: null,
  },
  thermal_comfort: {
    title: "Thermal Comfort",
    description: "Maintains comfortable temperature",
    icon: null,
  },
  cool_to_touch: {
    title: "Cool to Touch",
    description: "Naturally cool surface",
    icon: null,
  },

  // SAFETY & COMPLIANCE
  slip_resistant: {
    title: "Slip Resistant",
    description: "Non-slip surface for safety",
    icon: "/icons/Slip Resistant.svg",
  },
  fire_resistant: {
    title: "Fire Resistant",
    description: "Meets fire safety standards",
    icon: null,
  },
  certified_safe: {
    title: "Certified Safe",
    description: "Certified by safety standards",
    icon: null,
  },

  // DESIGN & CUSTOMIZATION
  customizable: {
    title: "Customizable",
    description: "Available in multiple options",
    icon: null,
  },
  pattern_options: {
    title: "Pattern Options",
    description: "Multiple pattern variations",
    icon: null,
  },
  color_range: {
    title: "Wide Color Range",
    description: "Available in many colors",
    icon: null,
  },
  designer_collection: {
    title: "Designer Collection",
    description: "Exclusive designer-curated lines",
    icon: null,
  },

  // PERFORMANCE & DURABILITY
  fade_proof: {
    title: "Fade Proof",
    description: "Colors never fade or dull",
    icon: null,
  },
  anti_bacterial: {
    title: "Anti-Bacterial",
    description: "Inhibits bacterial growth",
    icon: null,
  },
  anti_fungal: {
    title: "Anti-Fungal",
    description: "Resists fungal growth",
    icon: null,
  },
  anti_mold: {
    title: "Anti-Mold",
    description: "Prevents mold formation",
    icon: null,
  },

  // LUXURY & PREMIUM
  marble_look: {
    title: "Marble Look",
    description: "Authentic marble appearance",
    icon: null,
  },
  wood_effect: {
    title: "Wood Effect",
    description: "Realistic wood grain finish",
    icon: null,
  },
  stone_texture: {
    title: "Stone Texture",
    description: "Natural stone appearance",
    icon: null,
  },
  handcrafted: {
    title: "Handcrafted",
    description: "Artisan-made with attention to detail",
    icon: null,
  },
};


export const getFeature = (featureId) => {
  return FEATURES[featureId] || null;
};

export const getFeatures = (featureIds = []) => {
  return featureIds
    .map((id) => ({ id, ...FEATURES[id] }))
    .filter((f) => f.title);
};

export const validateFeatureIds = (featureIds) => {
  return featureIds.every((id) => id in FEATURES);
};

export const getAvailableFeatureIds = () => {
  return Object.keys(FEATURES);
};
