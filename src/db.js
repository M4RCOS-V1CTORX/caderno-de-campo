<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
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
=======
export default db;
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
