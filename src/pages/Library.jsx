import { useEffect, useState } from "react";

import {
  getProducts,
  deleteProduct,
} from "../services/productService";

import "../styles/library.css";

function Library({
  onNewProduct,
  onEditProduct,
  onBack,
  onPests,
  onDiseases,
}) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================================================
     CARREGAR PRODUTOS
  ========================================================= */

  async function loadProducts() {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR PRODUTOS:",
        error
      );

      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     CARREGAMENTO INICIAL
  ========================================================= */

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================================================
     FILTRO
  ========================================================= */

  const filteredProducts = products.filter(
    (product) => {
      const term = search
        .toLowerCase()
        .trim();

      if (!term) {
        return true;
      }

      return (
        product.name
          ?.toLowerCase()
          .includes(term) ||
        product.type
          ?.toLowerCase()
          .includes(term) ||
        product.unit
          ?.toLowerCase()
          .includes(term)
      );
    }
  );

  /* =========================================================
     EXCLUIR
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
     TELA
  ========================================================= */

  return (
    <main className="library-page">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <section className="library-heading">

        <div className="library-heading-content">

          <button
            type="button"
            className="library-back-button"
            onClick={onBack}
          >
            ← Voltar
          </button>

          <span className="library-label">
            BIBLIOTECA
          </span>

          <h2>
            Biblioteca
          </h2>

          <p>
            Gerencie produtos, pragas e doenças
            utilizados nos registros de campo.
          </p>

        </div>

        <button
          type="button"
          className="library-primary-button"
          onClick={onNewProduct}
        >
          + Novo produto
        </button>

      </section>

      {/* =====================================================
    CATEGORIAS
===================================================== */}

<section className="library-categories">

  {/* PRODUTOS */}
  <button
    type="button"
    className="library-category active"
  >
    <div className="library-category-icon">
      🧪
    </div>

    <div>
      <strong>
        Produtos
      </strong>

      <span>
        {products.length} cadastrados
      </span>
    </div>
  </button>


  {/* PRAGAS */}
  <button
    type="button"
    className="library-category"
    onClick={onPests}
  >
    <div className="library-category-icon">
      🐛
    </div>

    <div>
      <strong>
        Pragas
      </strong>

      <span>
        Gerenciar pragas
      </span>
    </div>
  </button>


  {/* DOENÇAS */}
  <button
    type="button"
    className="library-category"
    onClick={onDiseases}
  >
    <div className="library-category-icon">
      🦠
    </div>

    <div>
      <strong>
        Doenças
      </strong>

      <span>
        Cadastrar e consultar doenças
      </span>
    </div>
  </button>

</section>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section className="library-content">

        <div className="library-section-heading">

          <div>
            <h3>
              Produtos
            </h3>

            <p>
              Cadastre e consulte os produtos
              utilizados nas atividades.
            </p>
          </div>

        </div>

        {/* ===================================================
            PESQUISA
        =================================================== */}

        <div className="library-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            placeholder="Pesquisar produto..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>

        {/* ===================================================
            CARREGANDO
        =================================================== */}

        {loading ? (

          <div className="library-empty">

            <div className="library-empty-icon">
              ⏳
            </div>

            <h3>
              Carregando biblioteca
            </h3>

            <p>
              Aguarde enquanto buscamos os produtos.
            </p>

          </div>

        ) : products.length === 0 ? (

          /* =================================================
             NENHUM PRODUTO
          ================================================= */

          <div className="library-empty">

            <div className="library-empty-icon">
              🧪
            </div>

            <h3>
              Nenhum produto cadastrado
            </h3>

            <p>
              Cadastre seu primeiro produto para
              começar a montar sua biblioteca.
            </p>

            <button
              type="button"
              className="library-primary-button"
              onClick={onNewProduct}
            >
              + Cadastrar primeiro produto
            </button>

          </div>

        ) : filteredProducts.length === 0 ? (

          /* =================================================
             PESQUISA SEM RESULTADO
          ================================================= */

          <div className="library-empty">

            <div className="library-empty-icon">
              🔎
            </div>

            <h3>
              Nenhum produto encontrado
            </h3>

            <p>
              Tente pesquisar utilizando outro termo.
            </p>

          </div>

        ) : (

          /* =================================================
             LISTA DE PRODUTOS
          ================================================= */

          <div className="products-list">

            {filteredProducts.map(
              (product) => (

                <article
                  className="product-card"
                  key={product.id}
                >

                  <div className="product-card-content">

                    <div className="product-icon">
                      🧪
                    </div>

                    <div className="product-info">

                      <h4>
                        {product.name ||
                          "Produto sem nome"}
                      </h4>

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

                    </div>

                  </div>

                  <div className="product-actions">

                    <button
                      type="button"
                      className="library-secondary-button"
                      onClick={() =>
                        onEditProduct(product)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="library-delete-button"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Excluir
                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

export default Library;