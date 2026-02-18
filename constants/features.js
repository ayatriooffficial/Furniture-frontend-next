
export const FEATURES = {
  // DURABILITY & QUALITY
  high_durability: {
    title: "High Durability",
    description: "Built for long-lasting performance",
    icon: "/icons/quality.svg",
  },
  premium_quality: {
    title: "Premium Quality",
    description: "Best-in-class materials and craftsmanship",
    icon: "/icons/star full black.svg",
  },
  weatherproof: {
    title: "Weather Resistant",
    description: "Withstands extreme weather conditions",
    icon: "/icons/waterproof.svg",
  },
  uv_resistant: {
    title: "UV Resistant",
    description: "Fades resistant for outdoor durability",
    icon: "/icons/vision.svg",
  },

  // FINISH & AESTHETICS
  luxury_finish: {
    title: "Luxury Finish",
    description: "Premium polished surface",
     icon: "/icons/star full black.svg",
  },
  glossy_finish: {
    title: "Glossy Finish",
    description: "High-shine reflective surface",
    icon: "/icons/star full black.svg",
  },
  matte_finish: {
    title: "Matte Finish",
    description: "Non-reflective elegant surface",
    icon: "/icons/star full white.svg",
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
    icon: "/icons/mantanance.svg",
  },
  stain_resistant: {
    title: "Stain Resistant",
    description: "Resists liquids and stains effectively",
    icon: "/icons/Slip Resistant.svg",
  },
  waterproof: {
    title: "Waterproof",
    description: "100% water resistant",
    icon: "/icons/waterproof.svg",
  },
  scratch_resistant: {
    title: "Scratch Resistant",
    description: "Durable against scratches and marks",
    icon: "/icons/quality.svg",
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
    icon: "/icons/assemble.svg",
  },
  no_grout_required: {
    title: "No Grout Required",
    description: "Grout-free installation system",
    icon: "/icons/assemble.svg",
  },
  pre_assembled: {
    title: "Pre-Assembled",
    description: "Comes partially or fully assembled",
    icon: "/icons/assemble.svg",
  },

  // DIMENSIONS & SPACE
  compact_design: {
    title: "Compact Design",
    description: "Space-saving compact size",
    icon: "/icons/maserment.svg",
  },
  large_format: {
    title: "Large Format",
    description: "Extra-large size tiles or panels",
    icon: "/icons/maserment.svg",
  },
  lightweight: {
    title: "Lightweight",
    description: "Easy to handle and transport",
    icon: "/icons/maserment.svg",
  },
  deep_dimensions: {
    title: "Deep Dimensions",
    description: "Substantial depth for dimension",
    icon: "/icons/3d.svg",
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
    icon: "/icons/recyle.svg",
  },
  non_toxic: {
    title: "Non-Toxic",
    description: "Safe for families and pets",
    icon: "/icons/recyle.svg",
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
    icon: "/icons/home_store_icon.svg",
  },
  soundproof: {
    title: "Soundproof",
    description: "Reduces noise and sound",
    icon: "/icons/quality.svg",
  },
  thermal_comfort: {
    title: "Thermal Comfort",
    description: "Maintains comfortable temperature",
    icon: "/icons/home_store_icon.svg",
  },
  cool_to_touch: {
    title: "Cool to Touch",
    description: "Naturally cool surface",
    icon: "/icons/Slip Resistant.svg",
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
    icon: "/icons/quality.svg",
  },
  certified_safe: {
    title: "Certified Safe",
    description: "Certified by safety standards",
    icon: "/icons/FSC Certificate.svg",
  },

  // DESIGN & CUSTOMIZATION
  customizable: {
    title: "Customizable",
    description: "Available in multiple options",
    icon: "/icons/planning and consultation.svg",
  },
  pattern_options: {
    title: "Pattern Options",
    description: "Multiple pattern variations",
    icon: "/icons/menu.svg",
  },
  color_range: {
    title: "Wide Color Range",
    description: "Available in many colors",
    icon: "/icons/planning and consultation.svg",
  },
  designer_collection: {
    title: "Designer Collection",
    description: "Exclusive designer-curated lines",
    icon: "/icons/star full black.svg",
  },

  // PERFORMANCE & DURABILITY
  fade_proof: {
    title: "Fade Proof",
    description: "Colors never fade or dull",
    icon: "/icons/quality.svg",
  },
  anti_bacterial: {
    title: "Anti-Bacterial",
    description: "Inhibits bacterial growth",
    icon: "/icons/recyle.svg",
  },
  anti_fungal: {
    title: "Anti-Fungal",
    description: "Resists fungal growth",
    icon: "/icons/recyle.svg",
  },
  anti_mold: {
    title: "Anti-Mold",
    description: "Prevents mold formation",
    icon: "/icons/recyle.svg",
  },

  // LUXURY & PREMIUM
  marble_look: {
    title: "Marble Look",
    description: "Authentic marble appearance",
    icon: "/icons/furnishing.svg",
  },
  wood_effect: {
    title: "Wood Effect",
    description: "Realistic wood grain finish",
    icon: "/icons/FSC Certificate.svg",
  },
  stone_texture: {
    title: "Stone Texture",
    description: "Natural stone appearance",
    icon: "/icons/furnishing.svg",
  },
  handcrafted: {
    title: "Handcrafted",
    description: "Artisan-made with attention to detail",
    icon: "/icons/assemble.svg",
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
