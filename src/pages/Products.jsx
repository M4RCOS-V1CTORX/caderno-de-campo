
import { useEffect, useState } from "react";

import {
  getProducts,
  deleteProduct,
} from "../services/productService";

import "../styles/products.css";

function Products({
  onNewProduct,
  onEditProduct,
  onBack,
}) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  /* =========================================================
     CARREGAR PRODUTOS
  ========================================================= */

  async function loadProducts() {
    try {
      const data = await getProducts();

      setProducts(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR PRODUTOS:",
        error
      );

      setProducts([]);
    }
  }

  /* =========================================================
     CARREGAMENTO INICIAL
  ========================================================= */

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================================================
     EXCLUIR PRODUTO
  ========================================================= */

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);

      await loadProducts();
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR PRODUTO:",
        error
      );

      alert(
        "Não foi possível excluir o produto."
      );
    }
  }

  /* =========================================================
     FILTRAR PRODUTOS
  ========================================================= */

  const normalizedSearch =
    search.trim().toLowerCase();

  const filteredProducts =
    products.filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        product.type
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        product.unit
          ?.toLowerCase()
          .includes(normalizedSearch)
      );
    });

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="products-page">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="products-heading">

        <div className="products-heading-content">

          <span className="home-label">
            BIBLIOTECA
          </span>

          <h2>
            Produtos
          </h2>

          <p>
            Cadastre e gerencie os produtos
            utilizados nas atividades de campo.
          </p>

        </div>

        <button
          type="button"
          className="primary-button products-new-button"
          onClick={onNewProduct}
        >
          <span>＋</span>
          Novo produto
        </button>

      </div>

      {/* =====================================================
          VOLTAR
      ===================================================== */}

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Voltar
      </button>

      {/* =====================================================
          BUSCA
      ===================================================== */}

      <section className="products-toolbar">

        <div className="products-search">

          <span className="products-search-icon">
            🔎
          </span>

          <input
            type="search"
            placeholder="Buscar produto..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="products-search-clear"
              onClick={() => setSearch("")}
              aria-label="Limpar busca"
              title="Limpar busca"
            >
              ×
            </button>
          )}

        </div>

        <span className="products-counter">
          {filteredProducts.length}
          {filteredProducts.length === 1
            ? " produto"
            : " produtos"}
        </span>

      </section>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section className="products-content">

        {/* ===================================================
            NENHUM PRODUTO
        =================================================== */}

        {products.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🧪
            </div>

            <h3>
              Nenhum produto cadastrado
            </h3>

            <p>
              Cadastre seu primeiro produto
              para começar a montar a biblioteca.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onNewProduct}
            >
              ＋ Cadastrar primeiro produto
            </button>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* =================================================
             BUSCA SEM RESULTADO
          ================================================= */

          <div className="empty-state">

            <div className="empty-icon">
              🔎
            </div>

            <h3>
              Nenhum produto encontrado
            </h3>

            <p>
              Não encontramos produtos
              correspondentes à sua busca.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setSearch("")}
            >
              Limpar busca
            </button>

          </div>

        ) : (

          /* =================================================
             LISTA
          ================================================= */

          <div className="products-list">

            {filteredProducts.map((product) => (

              <article
                className="product-card"
                key={product.id}
              >

                {/* =========================================
                    INFORMAÇÕES
                ========================================= */}

                <div className="product-card-content">

                  <div className="product-icon">
                    🧪
                  </div>

                  <div className="product-info">

                    <h3>
                      {product.name ||
                        "Produto sem nome"}
                    </h3>

                    <div className="product-details">

                      {product.type && (
                        <span>
                          <strong>
                            Tipo:
                          </strong>{" "}
                          {product.type}
                        </span>
                      )}

                      {product.unit && (
                        <span>
                          <strong>
                            Unidade:
                          </strong>{" "}
                          {product.unit}
                        </span>
                      )}

                    </div>

                    {product.notes && (
                      <p className="product-notes">
                        {product.notes}
                      </p>
                    )}

                  </div>

                </div>

                {/* =========================================
                    AÇÕES
                ========================================= */}

                <div className="product-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      onEditProduct(product)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(product.id)
                    }
                  >
                    Excluir
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Products;

