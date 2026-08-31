import db from "../db";

<<<<<<< HEAD
/* =========================================================
   CRIAR ATIVIDADE
========================================================= */

export async function createActivity(activity) {
  const newActivity = {
    ...activity,

    propertyId: activity.propertyId
      ? Number(activity.propertyId)
      : null,

    plotId: activity.plotId
      ? Number(activity.plotId)
      : null,

    managementType:
      activity.managementType || "",

    managementStatus:
      activity.managementStatus || "",

    pest:
      activity.pest?.trim() || "",

    disease:
      activity.disease?.trim() || "",

    product:
      activity.product?.trim() || "",

    quantity:
      activity.quantity?.trim() || "",

    synced: false,

=======
export async function createActivity(activity) {
  const newActivity = {
    ...activity,
    propertyId: activity.propertyId
      ? Number(activity.propertyId)
      : null,
    plotId: activity.plotId
      ? Number(activity.plotId)
      : null,
    synced: false,
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
    createdAt: new Date().toISOString(),
  };

  const id = await db.activities.add(newActivity);

  console.log("ATIVIDADE SALVA:", id);

  return {
    id,
    ...newActivity,
  };
}

<<<<<<< HEAD
/* =========================================================
   BUSCAR ATIVIDADES
========================================================= */

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
export async function getActivities() {
  console.log("LENDO BANCO LOCAL...");

  const activities = await db.activities.toArray();

<<<<<<< HEAD
  console.log(
    "TOTAL NO BANCO:",
    activities.length
  );

  console.log(
    "DADOS DO BANCO:",
    activities
  );
=======
  console.log("TOTAL NO BANCO:", activities.length);
  console.log("DADOS DO BANCO:", activities);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

  return activities.sort((a, b) => {
    return (
      new Date(b.createdAt) -
      new Date(a.createdAt)
    );
  });
}

<<<<<<< HEAD
/* =========================================================
   BUSCAR ATIVIDADE POR ID
========================================================= */

export async function getActivityById(id) {
  return await db.activities.get(
    Number(id)
  );
}

/* =========================================================
   EXCLUIR ATIVIDADE
========================================================= */

export async function deleteActivity(id) {
  console.log(
    "EXCLUINDO ATIVIDADE:",
    id
  );

  await db.activities.delete(
    Number(id)
  );

  console.log(
    "ATIVIDADE EXCLUÍDA COM SUCESSO"
  );
}

/* =========================================================
   ATUALIZAR ATIVIDADE
========================================================= */

export async function updateActivity(
  id,
  activity
) {
  console.log(
    "ATUALIZANDO ATIVIDADE:",
    id
  );

  await db.activities.update(
    Number(id),
    {
      ...activity,

      propertyId:
        activity.propertyId
          ? Number(activity.propertyId)
          : null,

      plotId:
        activity.plotId
          ? Number(activity.plotId)
          : null,

      managementType:
        activity.managementType || "",

      managementStatus:
        activity.managementStatus || "",

      pest:
        activity.pest?.trim() || "",

      disease:
        activity.disease?.trim() || "",

      product:
        activity.product?.trim() || "",

      quantity:
        activity.quantity?.trim() || "",

      synced: false,
    }
  );

  console.log(
    "ATIVIDADE ATUALIZADA COM SUCESSO"
  );
=======
export async function getActivityById(id) {
  return await db.activities.get(Number(id));
}

export async function deleteActivity(id) {
  console.log("EXCLUINDO ATIVIDADE:", id);

  await db.activities.delete(Number(id));

  console.log("ATIVIDADE EXCLUÍDA COM SUCESSO");
}

export async function updateActivity(id, activity) {
  console.log("ATUALIZANDO ATIVIDADE:", id);

  await db.activities.update(Number(id), {
    ...activity,
    propertyId: activity.propertyId
      ? Number(activity.propertyId)
      : null,
    plotId: activity.plotId
      ? Number(activity.plotId)
      : null,
    synced: false,
  });

  console.log("ATIVIDADE ATUALIZADA COM SUCESSO");
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
}