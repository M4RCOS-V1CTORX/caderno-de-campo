
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
    "++id, propertyId, plotId, title, date, location, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",

  products:
    "++id, name, type, unit, synced, createdAt",
});

/*
=========================================================
  BIBLIOTECA
=========================================================
*/

db.version(4).stores({
  activities:
    "++id, propertyId, plotId, title, date, location, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",

  products:
    "++id, name, type, unit, synced, createdAt",

  library:
    "++id, name, type, description, unit, synced, createdAt",
});
db.version(4).stores({
  activities:
    "++id, propertyId, plotId, title, date, location, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",

  products:
    "++id, name, type, unit, synced, createdAt",

  pests:
    "++id, name, type, description, synced, createdAt",

  diseases:
    "++id, name, type, description, synced, createdAt",
});
db.version(4).stores({
  activities:
    "++id, propertyId, plotId, title, date, location, synced, createdAt",

  properties:
    "++id, name, owner, city, state, synced, createdAt",

  plots:
    "++id, propertyId, name, culture, soil, area, synced, createdAt",

  photos:
    "++id, activityId, createdAt",

  products:
    "++id, name, type, unit, synced, createdAt",

  pests:
    "++id, name, synced, createdAt",
});

export default db;

