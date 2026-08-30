
import { useEffect, useState } from "react";

import {
  createProduct,
  updateProduct,
} from "../services/productService";

import "../styles/newProduct.css";

function NewProduct({
  onCancel,
  onProductCreated,
  productToEdit,
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [unit, setUnit] = useState("");
  const [notes, setNotes] = useState("");

  /* =========================================================
     PREENCHER FORMULÁRIO NA EDIÇÃO
  ========================================================= */

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setType(productToEdit.type || "");
      setUnit(productToEdit.unit || "");
      setNotes(productToEdit.notes || "");
    } else {
      setName("");
      setType("");
      setUnit("");
      setNotes("");
    }
  }, [productToEdit]);

  /* =========================================================
     SALVAR
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Informe o nome do produto.");
      return;
    }

    const product = {
      name: name.trim(),
      type: type.trim(),
      unit: unit.trim(),
      notes: notes.trim(),
    };

    try {
      /* =====================================================
         EDITAR
      ===================================================== */

      if (productToEdit) {
        await updateProduct(
          productToEdit.id,
          product
        );

        alert("Produto atualizado com sucesso!");
      }

      /* =====================================================
         NOVO PRODUTO
      ===================================================== */

      else {
        await createProduct(product);

        alert("Produto cadastrado com sucesso!");
      }

      /* =====================================================
         ATUALIZAR LISTA / VOLTAR
      ===================================================== */

      if (onProductCreated) {
        onProductCreated();
      } else if (onCancel) {
        onCancel();
      }

    } catch (error) {
      console.error(
        "ERRO AO SALVAR PRODUTO:",
        error
      );

      alert(
        "Erro ao salvar o produto. Veja o Console (F12)."
      );
    }
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="new-product">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <header className="page-heading">

        <div className="page-heading-content">

          <span className="home-label">
            BIBLIOTECA
          </span>

          <h2>
            {productToEdit
              ? "Editar produto"
              : "Novo produto"}
          </h2>

          <p>
            {productToEdit
              ? "Atualize as informações deste produto."
              : "Cadastre um produto para utilizar nos registros de campo."}
          </p>

        </div>

      </header>

      {/* =====================================================
          FORMULÁRIO
      ===================================================== */}

      <form
        className="product-form"
        onSubmit={handleSubmit}
      >

        {/* ===================================================
            INFORMAÇÕES
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              🧪
            </div>

            <div>

              <h3>
                Informações do produto
              </h3>

              <p>
                Preencha os dados principais do produto.
              </p>

            </div>

          </div>

          <div className="form-grid">

            {/* NOME */}

            <div className="form-group full">

              <label htmlFor="product-name">
                Nome do produto
              </label>

              <input
                id="product-name"
                type="text"
                placeholder="Ex.: Fertilizante NPK 20-05-20"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>

            {/* TIPO */}

            <div className="form-group">

              <label htmlFor="product-type">
                Tipo
              </label>

              <select
                id="product-type"
                value={type}
                onChange={(event) =>
                  setType(event.target.value)
                }
              >

                <option value="">
                  Selecione o tipo
                </option>

                <option value="Fertilizante">
                  Fertilizante
                </option>

                <option value="Defensivo">
                  Defensivo
                </option>

                <option value="Herbicida">
                  Herbicida
                </option>

                <option value="Fungicida">
                  Fungicida
                </option>

                <option value="Inseticida">
                  Inseticida
                </option>

                <option value="Adjuvante">
                  Adjuvante
                </option>

                <option value="Semente">
                  Semente
                </option>

                <option value="Outro">
                  Outro
                </option>

              </select>

            </div>

            {/* UNIDADE */}

            <div className="form-group">

              <label htmlFor="product-unit">
                Unidade
              </label>

              <select
                id="product-unit"
                value={unit}
                onChange={(event) =>
                  setUnit(event.target.value)
                }
              >

                <option value="">
                  Selecione a unidade
                </option>

                <option value="kg">
                  Quilograma (kg)
                </option>

                <option value="g">
                  Grama (g)
                </option>

                <option value="L">
                  Litro (L)
                </option>

                <option value="mL">
                  Mililitro (mL)
                </option>

                <option value="un">
                  Unidade (un)
                </option>

                <option value="saco">
                  Saco
                </option>

                <option value="caixa">
                  Caixa
                </option>

                <option value="outro">
                  Outro
                </option>

              </select>

            </div>

            {/* OBSERVAÇÕES */}

            <div className="form-group full">

              <label htmlFor="product-notes">
                Observações
              </label>

              <textarea
                id="product-notes"
                rows="5"
                placeholder="Adicione informações importantes sobre este produto..."
                value={notes}
                onChange={(event) =>
                  setNotes(event.target.value)
                }
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            AÇÕES
        =================================================== */}

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            {productToEdit
              ? "Salvar alterações"
              : "Salvar produto"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default NewProduct;

