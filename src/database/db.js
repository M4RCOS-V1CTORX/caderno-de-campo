import Dexie from "dexie";

const db = new Dexie("CadernoDeCampo");

db.version(1).stores({
  activities: "++id, title, date, location, synced, createdAt",
});

export default db;