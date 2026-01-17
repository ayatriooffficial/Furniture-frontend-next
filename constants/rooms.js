export const ROOMS = {
  bedroom: {
    name: "Bedroom",
    icon: "/icons/rooms/bedroom.svg",
    description: "Perfect for bedroom spaces and sleep areas",
  },
  kitchen: {
    name: "Kitchen",
    icon: "/icons/rooms/kitchen.svg",
    description: "Ideal for kitchen and dining spaces",
  },
  bathroom: {
    name: "Bathroom",
    icon: "/icons/rooms/bathroom.svg",
    description: "Suitable for bathroom environments",
  },
  office: {
    name: "Office",
    icon: "/icons/rooms/office.svg",
    description: "Great for office and workspace",
  },
  hallway: {
    name: "Hallway",
    icon: "/icons/rooms/hallway.svg",
    description: "Works well in hallways and corridors",
  },
  entryway: {
    name: "Entryway",
    icon: "/icons/rooms/entryway.svg",
    description: "Welcomes guests in entryways",
  },
  patio: {
    name: "Patio",
    icon: "/icons/rooms/patio.svg",
    description: "Perfect for outdoor patio areas",
  },
  basement: {
    name: "Basement",
    icon: "/icons/rooms/basement.svg",
    description: "Designed for basement spaces",
  },
  dining_room: {
    name: "Dining Room",
    icon: "/icons/rooms/dining_room.svg",
    description: "Essential for dining spaces",
  },
  living_room: {
    name: "Living Room",
    icon: "/icons/rooms/living_room.svg",
    description: "Ideal for living room settings",
  },
};

export const getRoom = (roomId) => {
  return ROOMS[roomId] || null;
};

export const getRooms = (roomIds = []) => {
  return roomIds.map((id) => ({ id, ...ROOMS[id] })).filter((r) => r.name);
};

export const validateRoomIds = (roomIds) => {
  return roomIds.every((id) => id in ROOMS);
};

export const getAvailableRoomIds = () => {
  return Object.keys(ROOMS);
};
