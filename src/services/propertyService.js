<<<<<<< HEAD

import db from "../db";

/* =========================================================
   CRIAR PROPRIEDADE
========================================================= */

export async function createProperty(property) {
  const newProperty = {
    ...property,
    synced: false,
    createdAt: Date.now(),
  };

  const id = await db.properties.add(newProperty);

  return {
    id,
    ...newProperty,
  };
}

/* =========================================================
   BUSCAR TODAS AS PROPRIEDADES
========================================================= */

=======
import db from "../db";

export async function createProperty(property) {
  return await db.properties.add({
    ...property,
    synced: false,
    createdAt: Date.now(),
  });
}

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
export async function getProperties() {
  return await db.properties
    .orderBy("createdAt")
    .reverse()
    .toArray();
}

<<<<<<< HEAD
/* =========================================================
   BUSCAR PROPRIEDADE POR ID
========================================================= */

export async function getPropertyById(id) {
  return await db.properties.get(Number(id));
}

/* =========================================================
   ATUALIZAR PROPRIEDADE
========================================================= */

export async function updateProperty(id, property) {
  return await db.properties.update(Number(id), {
=======
export async function getPropertyById(id) {
  return await db.properties.get(id);
}

export async function updateProperty(id, property) {
  return await db.properties.update(id, {
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
    ...property,
    synced: false,
  });
}

<<<<<<< HEAD
/* =========================================================
   EXCLUIR PROPRIEDADE
========================================================= */

export async function deleteProperty(id) {
  return await db.properties.delete(Number(id));
}

=======
export async function deleteProperty(id) {
  return await db.properties.delete(id);
}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
