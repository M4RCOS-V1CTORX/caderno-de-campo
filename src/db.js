import Dexie from "dexie";

const db = new Dexie("CadernoDeCampo");

db.version(1).stores({
  activities:
    "++id, title, date, location, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",
});

db.version(2).stores({
  activities:
    "++id, propertyId, plotId, title, date, location, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",
});

db.version(3).stores({
  activities:
    "++id, propertyId, plotId, title, date, managementType, managementStatus, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",
});

export default db;