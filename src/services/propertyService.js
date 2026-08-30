import db from "../db";

export async function createProperty(property) {
  return await db.properties.add({
    ...property,
    synced: false,
    createdAt: Date.now(),
  });
}

export async function getProperties() {
  return await db.properties
    .orderBy("createdAt")
    .reverse()
    .toArray();
}

export async function getPropertyById(id) {
  return await db.properties.get(id);
}

export async function updateProperty(id, property) {
  return await db.properties.update(id, {
    ...property,
    synced: false,
  });
}

export async function deleteProperty(id) {
  return await db.properties.delete(id);
}