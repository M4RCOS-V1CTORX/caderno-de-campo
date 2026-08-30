import db from "../db";

/* =========================================================
   CRIAR PRODUTO
========================================================= */

export async function createProduct(product) {
  const newProduct = {
    ...product,
    name: product.name?.trim() || "",
    type: product.type?.trim() || "",
    unit: product.unit?.trim() || "",
    synced: false,
    createdAt: Date.now(),
  };

  const id = await db.products.add(newProduct);

  return {
    id,
    ...newProduct,
  };
}

/* =========================================================
   BUSCAR TODOS OS PRODUTOS
========================================================= */

export async function getProducts() {
  return await db.products
    .orderBy("createdAt")
    .reverse()
    .toArray();
}

/* =========================================================
   BUSCAR PRODUTO POR ID
========================================================= */

export async function getProductById(id) {
  return await db.products.get(Number(id));
}

/* =========================================================
   ATUALIZAR PRODUTO
========================================================= */

export async function updateProduct(id, product) {
  return await db.products.update(Number(id), {
    ...product,
    name: product.name?.trim() || "",
    type: product.type?.trim() || "",
    unit: product.unit?.trim() || "",
    synced: false,
  });
}

/* =========================================================
   EXCLUIR PRODUTO
========================================================= */

export async function deleteProduct(id) {
  return await db.products.delete(Number(id));
}