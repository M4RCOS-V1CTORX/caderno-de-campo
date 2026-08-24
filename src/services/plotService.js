import db from "../db";

export async function createPlot(plot) {
  return await db.plots.add({
    ...plot,
    synced: false,
    createdAt: Date.now(),
  });
}

export async function getPlots() {
  return await db.plots
    .orderBy("createdAt")
    .reverse()
    .toArray();
}

export async function getPlotsByProperty(propertyId) {
  return await db.plots
    .where("propertyId")
    .equals(propertyId)
    .reverse()
    .sortBy("createdAt");
}

export async function getPlotById(id) {
  return await db.plots.get(id);
}

export async function updatePlot(id, plot) {
  return await db.plots.update(id, {
    ...plot,
    synced: false,
  });
}

export async function deletePlot(id) {
  return await db.plots.delete(id);
}