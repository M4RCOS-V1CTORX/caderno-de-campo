import db from "../database/db";

export async function createActivity(activity) {
  const newActivity = {
    ...activity,
    synced: false,
    createdAt: new Date().toISOString(),
  };

  const id = await db.activities.add(newActivity);

  console.log("ATIVIDADE SALVA:", id);

  return {
    id,
    ...newActivity,
  };
}

export async function getActivities() {
  console.log("LENDO BANCO LOCAL...");

  const activities = await db.activities.toArray();

  console.log("TOTAL NO BANCO:", activities.length);
  console.log("DADOS DO BANCO:", activities);

  return activities.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}
export async function deleteActivity(id) {
  console.log("EXCLUINDO ATIVIDADE:", id);

  await db.activities.delete(id);

  console.log("ATIVIDADE EXCLUÍDA COM SUCESSO");
}
export async function updateActivity(id, activity) {
  console.log("ATUALIZANDO ATIVIDADE:", id);

  await db.activities.update(id, {
    ...activity,
    synced: false,
  });

  console.log("ATIVIDADE ATUALIZADA COM SUCESSO");
}