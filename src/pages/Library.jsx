import { useEffect, useMemo, useState } from "react";

import {
  getProducts,
  deleteProduct,
  addStock,
  removeStock,
  getStockMovements,
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

  // Modal de movimentação
  const [movementProduct, setMovementProduct] = useState(null);
  const [movementType, setMovementType] = useState("entrada");
  const [movementQuantity, setMovementQuantity] = useState("");
  const [movementReason, setMovementReason] = useState("");
  const [processingMovement, setProcessingMovement] = useState(false);

  // Modal de histórico
  const [historyProduct, setHistoryProduct] = useState(null);
  const [historyMovements, setHistoryMovements] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  /* =========================================================
     CARREGAR PRODUTOS
  ========================================================= */

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR PRODUTOS:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* =========================================================
     EXCLUIR
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmed) return;

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
  };

  /* =========================================================
     STATUS DO ESTOQUE
  ========================================================= */

  const getStockStatus = (product) => {
    const stock = Number(product.stock) || 0;
    const minimum = Number(product.minimumStock) || 0;

    if (stock <= 0) {
      return {
        label: "Esgotado",
        className: "empty",
      };
    }

    if (
      minimum > 0 &&
      stock <= minimum
    ) {
      return {
        label: "Estoque baixo",
        className: "low",
      };
    }

    return {
      label: "Estoque normal",
      className: "normal",
    };
  };

  /* =========================================================
     PESQUISA
  ========================================================= */

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      return (
        String(product.name || "")
          .toLowerCase()
          .includes(term) ||
        String(product.type || "")
          .toLowerCase()
          .includes(term) ||
        String(product.unit || "")
          .toLowerCase()
          .includes(term)
      );
    });
  }, [products, search]);

  /* =========================================================
     RESUMO
  ========================================================= */

  const stockSummary = useMemo(() => {
    let normal = 0;
    let low = 0;
    let empty = 0;

    products.forEach((product) => {
      const status =
        getStockStatus(product);

      if (status.className === "normal") {
        normal++;
      } else if (
        status.className === "low"
      ) {
        low++;
      } else {
        empty++;
      }
    });

    return {
      total: products.length,
      normal,
      low,
      empty,
    };
  }, [products]);

  /* =========================================================
     PRODUTOS QUE PRECISAM DE ATENÇÃO
  ========================================================= */

  const attentionProducts = useMemo(() => {
    return products
      .filter((product) => {
        const status =
          getStockStatus(product);

        return (
          status.className === "low" ||
          status.className === "empty"
        );
      })
      .sort((a, b) => {
        const stockA =
          Number(a.stock) || 0;

        const stockB =
          Number(b.stock) || 0;

        return stockA - stockB;
      });
  }, [products]);

  /* =========================================================
     ÚLTIMAS MOVIMENTAÇÕES
  ========================================================= */

  const recentMovements = useMemo(() => {
    const movements = [];

    products.forEach((product) => {
      const productMovements =
        Array.isArray(
          product.stockMovements
        )
          ? product.stockMovements
          : [];

      productMovements.forEach(
        (movement) => {
          movements.push({
            ...movement,
            productId: product.id,
            productName:
              product.name ||
              "Produto sem nome",
            productUnit:
              product.unit || "un",
          });
        }
      );
    });

    return movements
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 6);
  }, [products]);

  /* =========================================================
     ABRIR MOVIMENTAÇÃO
  ========================================================= */

  const openMovement = (
    product,
    type
  ) => {
    setMovementProduct(product);
    setMovementType(type);
    setMovementQuantity("");
    setMovementReason("");
    setProcessingMovement(false);
  };

  /* =========================================================
     FECHAR MOVIMENTAÇÃO
  ========================================================= */

  const closeMovement = () => {
    if (processingMovement) return;

    setMovementProduct(null);
    setMovementQuantity("");
    setMovementReason("");
  };

  /* =========================================================
     REGISTRAR MOVIMENTAÇÃO
  ========================================================= */

  const handleMovementSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (!movementProduct) return;

    const quantity =
      Number(movementQuantity);

    if (!quantity || quantity <= 0) {
      alert(
        "Informe uma quantidade válida."
      );

      return;
    }

    try {
      setProcessingMovement(true);

      const reason =
        movementReason.trim() ||
        (movementType === "entrada"
          ? "Entrada de estoque"
          : "Saída de estoque");

      if (
        movementType === "entrada"
      ) {
        await addStock(
          movementProduct.id,
          quantity,
          reason
        );
      } else {
        await removeStock(
          movementProduct.id,
          quantity,
          reason
        );
      }

      await loadProducts();

      setMovementProduct(null);
      setMovementQuantity("");
      setMovementReason("");
    } catch (error) {
      console.error(
        "ERRO AO MOVIMENTAR ESTOQUE:",
        error
      );

      alert(
        error?.message ||
          "Não foi possível atualizar o estoque."
      );
    } finally {
      setProcessingMovement(false);
    }
  };

  /* =========================================================
     ABRIR HISTÓRICO
  ========================================================= */

  const openHistory = async (
    product
  ) => {
    try {
      setHistoryProduct(product);
      setHistoryMovements([]);
      setLoadingHistory(true);

      const movements =
        await getStockMovements(
          product.id
        );

      setHistoryMovements(
        Array.isArray(movements)
          ? movements
          : []
      );
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR HISTÓRICO:",
        error
      );

      alert(
        "Não foi possível carregar o histórico."
      );

      setHistoryProduct(null);
    } finally {
      setLoadingHistory(false);
    }
  };

  /* =========================================================
     FECHAR HISTÓRICO
  ========================================================= */

  const closeHistory = () => {
    if (loadingHistory) return;

    setHistoryProduct(null);
    setHistoryMovements([]);
  };

  /* =========================================================
     DATA
  ========================================================= */

  const formatMovementDate = (
    date
  ) => {
    if (!date) {
      return "Data não informada";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Data não informada";
    }

    return parsedDate.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     PERCENTUAL DO ESTOQUE
  ========================================================= */

  const getStockPercentage = (
    product
  ) => {
    const stock =
      Number(product.stock) || 0;

    const minimum =
      Number(product.minimumStock) || 0;

    if (minimum <= 0) {
      return stock > 0 ? 100 : 0;
    }

    const percentage =
      (stock / minimum) * 100;

    return Math.min(
      Math.max(percentage, 0),
      100
    );
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="library-page">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <header className="library-heading">

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
            Biblioteca de insumos
          </h2>

          <p>
            Consulte produtos, controle o estoque
            e registre movimentações.
          </p>

        </div>

        <button
          type="button"
          className="library-primary-button"
          onClick={onNewProduct}
        >
          + Novo produto
        </button>

      </header>

      {/* =====================================================
          CATEGORIAS
      ===================================================== */}

      <section className="library-categories">

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
              Insumos e estoque
            </span>
          </div>
        </button>

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
              Pragas cadastradas
            </span>
          </div>
        </button>

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
              Doenças cadastradas
            </span>
          </div>
        </button>

      </section>

      {/* =====================================================
          RESUMO
      ===================================================== */}

      <section className="stock-summary">

        <div className="stock-summary-card">

          <span className="stock-summary-label">
            PRODUTOS
          </span>

          <strong>
            {stockSummary.total}
          </strong>

          <span className="stock-summary-description">
            cadastrados
          </span>

        </div>

        <div className="stock-summary-card stock-summary-normal">

          <span className="stock-summary-label">
            NORMAL
          </span>

          <strong>
            {stockSummary.normal}
          </strong>

          <span className="stock-summary-description">
            estoque adequado
          </span>

        </div>

        <div className="stock-summary-card stock-summary-low">

          <span className="stock-summary-label">
            ESTOQUE BAIXO
          </span>

          <strong>
            {stockSummary.low}
          </strong>

          <span className="stock-summary-description">
            atenção necessária
          </span>

        </div>

        <div className="stock-summary-card stock-summary-empty">

          <span className="stock-summary-label">
            ESGOTADOS
          </span>

          <strong>
            {stockSummary.empty}
          </strong>

          <span className="stock-summary-description">
            sem estoque
          </span>

        </div>

      </section>

      {/* =====================================================
          PAINEL DE ATENÇÃO
      ===================================================== */}

      {!loading &&
        attentionProducts.length > 0 && (

          <section className="stock-dashboard-panel">

            <div className="stock-dashboard-heading">

              <div>
                <span className="stock-dashboard-label">
                  ATENÇÃO AO ESTOQUE
                </span>

                <h3>
                  Produtos que precisam de reposição
                </h3>

                <p>
                  Confira os produtos abaixo do
                  estoque mínimo ou já esgotados.
                </p>
              </div>

              <div className="stock-dashboard-count">
                {attentionProducts.length}
              </div>

            </div>

            <div className="stock-attention-list">

              {attentionProducts
                .slice(0, 5)
                .map((product) => {

                  const status =
                    getStockStatus(
                      product
                    );

                  const stock =
                    Number(
                      product.stock
                    ) || 0;

                  const minimum =
                    Number(
                      product.minimumStock
                    ) || 0;

                  return (
                    <div
                      className="stock-attention-item"
                      key={product.id}
                    >

                      <div className="stock-attention-icon">
                        {status.className ===
                        "empty"
                          ? "🔴"
                          : "🟡"}
                      </div>

                      <div className="stock-attention-info">

                        <strong>
                          {product.name ||
                            "Produto sem nome"}
                        </strong>

                        <span>
                          {stock}{" "}
                          {product.unit ||
                            "un"}{" "}
                          disponíveis
                        </span>

                      </div>

                      <div className="stock-attention-minimum">

                        <span>
                          Mínimo
                        </span>

                        <strong>
                          {minimum}{" "}
                          {product.unit ||
                            "un"}
                        </strong>

                      </div>

                      <span
                        className={`stock-attention-status ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <button
                        type="button"
                        className="stock-attention-action"
                        onClick={() =>
                          openMovement(
                            product,
                            "entrada"
                          )
                        }
                      >
                        + Repor
                      </button>

                    </div>
                  );
                })}

            </div>

            {attentionProducts.length > 5 && (
              <div className="stock-dashboard-more">
                + {attentionProducts.length - 5}{" "}
                outros produtos precisam de atenção.
              </div>
            )}

          </section>
        )}

      {/* =====================================================
          PAINEL DE MOVIMENTAÇÕES
      ===================================================== */}

      {!loading &&
        recentMovements.length > 0 && (

          <section className="stock-dashboard-panel stock-movements-panel">

            <div className="stock-dashboard-heading">

              <div>
                <span className="stock-dashboard-label">
                  MOVIMENTAÇÕES
                </span>

                <h3>
                  Últimas movimentações
                </h3>

                <p>
                  Acompanhe as entradas e saídas
                  mais recentes do estoque.
                </p>
              </div>

              <div className="stock-dashboard-count">
                {recentMovements.length}
              </div>

            </div>

            <div className="recent-movements-list">

              {recentMovements.map(
                (movement, index) => {

                  const isEntry =
                    movement.type ===
                    "entrada";

                  return (
                    <div
                      className="recent-movement-item"
                      key={
                        movement.id ||
                        `${movement.date}-${index}`
                      }
                    >

                      <div
                        className={`recent-movement-icon ${
                          isEntry
                            ? "entrada"
                            : "saida"
                        }`}
                      >
                        {isEntry
                          ? "↓"
                          : "↑"}
                      </div>

                      <div className="recent-movement-main">

                        <div className="recent-movement-top">

                          <strong>
                            {movement.productName}
                          </strong>

                          <span
                            className={`recent-movement-quantity ${
                              isEntry
                                ? "entrada"
                                : "saida"
                            }`}
                          >
                            {isEntry
                              ? "+"
                              : "-"}
                            {Number(
                              movement.quantity
                            )}{" "}
                            {
                              movement.productUnit
                            }
                          </span>

                        </div>

                        <span className="recent-movement-reason">
                          {movement.reason ||
                            "Sem motivo informado"}
                        </span>

                        <small>
                          {formatMovementDate(
                            movement.date
                          )}
                        </small>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </section>
        )}

      {/* =====================================================
          PRODUTOS
      ===================================================== */}

      <section className="library-content">

        <div className="library-section-heading">

          <h3>
            Produtos
          </h3>

          <p>
            Controle a quantidade disponível de cada produto.
          </p>

        </div>

        <div className="library-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Pesquisar produto..."
          />

        </div>

        {/* ===================================================
            CARREGANDO
        =================================================== */}

        {loading && (

          <div className="library-empty">

            <div className="library-empty-icon">
              ⏳
            </div>

            <h3>
              Carregando produtos...
            </h3>

            <p>
              Aguarde enquanto carregamos os produtos cadastrados.
            </p>

          </div>

        )}

        {/* ===================================================
            VAZIO
        =================================================== */}

        {!loading &&
          filteredProducts.length === 0 && (

            <div className="library-empty">

              <div className="library-empty-icon">
                🧪
              </div>

              <h3>
                {search
                  ? "Nenhum produto encontrado"
                  : "Nenhum produto cadastrado"}
              </h3>

              <p>
                {search
                  ? "Tente pesquisar usando outro nome, tipo ou unidade."
                  : "Cadastre seu primeiro produto para começar a controlar o estoque."}
              </p>

              {!search && (
                <button
                  type="button"
                  className="library-primary-button"
                  onClick={onNewProduct}
                >
                  + Cadastrar produto
                </button>
              )}

            </div>
          )}

        {/* ===================================================
            LISTA
        =================================================== */}

        {!loading &&
          filteredProducts.length > 0 && (

            <div className="products-list">

              {filteredProducts.map(
                (product) => {

                  const status =
                    getStockStatus(
                      product
                    );

                  const stock =
                    Number(
                      product.stock
                    ) || 0;

                  const minimum =
                    Number(
                      product.minimumStock
                    ) || 0;

                  const percentage =
                    getStockPercentage(
                      product
                    );

                  return (

                    <article
                      className="product-card"
                      key={product.id}
                    >

                      {/* =================================
                          PRODUTO
                      ================================= */}

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

                      {/* =================================
                          ESTOQUE
                      ================================= */}

                      <div
                        className={`product-stock ${status.className}`}
                      >

                        <span className="product-stock-label">
                          ESTOQUE DISPONÍVEL
                        </span>

                        <div className="product-stock-value">

                          <strong>
                            {stock}
                          </strong>

                          <span>
                            {product.unit ||
                              "un"}
                          </span>

                        </div>

                        {/* BARRA DE ESTOQUE */}

                        <div className="product-stock-bar">

                          <div
                            className={`product-stock-bar-fill ${status.className}`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />

                        </div>

                        <div className="product-stock-meta">

                          <span>
                            Mínimo:{" "}
                            {minimum}{" "}
                            {product.unit ||
                              "un"}
                          </span>

                          <span
                            className={`stock-status-badge ${status.className}`}
                          >
                            <i />
                            {status.label}
                          </span>

                        </div>

                      </div>

                      {/* =================================
                          AÇÕES
                      ================================= */}

                      <div className="product-actions">

                        <button
                          type="button"
                          className="stock-entry-button"
                          onClick={() =>
                            openMovement(
                              product,
                              "entrada"
                            )
                          }
                        >
                          + Entrada
                        </button>

                        <button
                          type="button"
                          className="stock-exit-button"
                          onClick={() =>
                            openMovement(
                              product,
                              "saida"
                            )
                          }
                        >
                          − Saída
                        </button>

                        <button
                          type="button"
                          className="stock-history-button"
                          onClick={() =>
                            openHistory(
                              product
                            )
                          }
                        >
                          Histórico
                        </button>

                        <button
                          type="button"
                          className="library-secondary-button"
                          onClick={() =>
                            onEditProduct(
                              product
                            )
                          }
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="library-delete-button"
                          onClick={() =>
                            handleDelete(
                              product.id
                            )
                          }
                        >
                          Excluir
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

      </section>

      {/* =====================================================
          MODAL — MOVIMENTAÇÃO
      ===================================================== */}

      {movementProduct && (

        <div
          className="stock-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
                event.currentTarget &&
              !processingMovement
            ) {
              closeMovement();
            }

          }}
        >

          <div className="stock-modal">

            <div className="stock-modal-header">

              <div>

                <span className="stock-modal-label">
                  MOVIMENTAÇÃO DE ESTOQUE
                </span>

                <h3>
                  {movementType ===
                  "entrada"
                    ? "Entrada de produto"
                    : "Saída de produto"}
                </h3>

              </div>

              <button
                type="button"
                className="stock-modal-close"
                onClick={closeMovement}
                disabled={
                  processingMovement
                }
              >
                ×
              </button>

            </div>

            <div className="stock-modal-product">

              <div className="stock-modal-product-icon">
                🧪
              </div>

              <div>

                <strong>
                  {movementProduct.name}
                </strong>

                <span>
                  Estoque atual:{" "}
                  {Number(
                    movementProduct.stock
                  ) || 0}{" "}
                  {movementProduct.unit ||
                    "un"}
                </span>

              </div>

            </div>

            <form
              onSubmit={
                handleMovementSubmit
              }
            >

              <div className="stock-type-selector">

                <button
                  type="button"
                  className={
                    movementType ===
                    "entrada"
                      ? "active entrada"
                      : ""
                  }
                  onClick={() =>
                    setMovementType(
                      "entrada"
                    )
                  }
                  disabled={
                    processingMovement
                  }
                >
                  + Entrada
                </button>

                <button
                  type="button"
                  className={
                    movementType ===
                    "saida"
                      ? "active saida"
                      : ""
                  }
                  onClick={() =>
                    setMovementType(
                      "saida"
                    )
                  }
                  disabled={
                    processingMovement
                  }
                >
                  − Saída
                </button>

              </div>

              <div className="stock-form-field">

                <label htmlFor="movementQuantity">
                  Quantidade
                </label>

                <div className="stock-quantity-input">

                  <input
                    id="movementQuantity"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      movementQuantity
                    }
                    onChange={(event) =>
                      setMovementQuantity(
                        event.target.value
                      )
                    }
                    placeholder="0"
                    disabled={
                      processingMovement
                    }
                    autoFocus
                  />

                  <span>
                    {movementProduct.unit ||
                      "un"}
                  </span>

                </div>

              </div>

              <div className="stock-form-field">

                <label htmlFor="movementReason">
                  Motivo
                </label>

                <input
                  id="movementReason"
                  type="text"
                  value={movementReason}
                  onChange={(event) =>
                    setMovementReason(
                      event.target.value
                    )
                  }
                  placeholder={
                    movementType ===
                    "entrada"
                      ? "Ex.: Compra de insumos"
                      : "Ex.: Aplicação na lavoura"
                  }
                  disabled={
                    processingMovement
                  }
                />

              </div>

              <div className="stock-modal-actions">

                <button
                  type="button"
                  className="stock-cancel-button"
                  onClick={closeMovement}
                  disabled={
                    processingMovement
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className={
                    movementType ===
                    "entrada"
                      ? "stock-confirm-button entrada"
                      : "stock-confirm-button saida"
                  }
                  disabled={
                    processingMovement
                  }
                >
                  {processingMovement
                    ? "Salvando..."
                    : movementType ===
                      "entrada"
                    ? "Registrar entrada"
                    : "Registrar saída"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =====================================================
          MODAL — HISTÓRICO
      ===================================================== */}

      {historyProduct && (

        <div
          className="stock-modal-overlay"
          onMouseDown={(event) => {

            if (
              event.target ===
                event.currentTarget &&
              !loadingHistory
            ) {
              closeHistory();
            }

          }}
        >

          <div className="stock-history-modal">

            <div className="stock-modal-header">

              <div>

                <span className="stock-modal-label">
                  HISTÓRICO DE ESTOQUE
                </span>

                <h3>
                  Movimentações
                </h3>

              </div>

              <button
                type="button"
                className="stock-modal-close"
                onClick={closeHistory}
                disabled={
                  loadingHistory
                }
              >
                ×
              </button>

            </div>

            {/* =============================================
                PRODUTO
            ============================================= */}

            <div className="history-product-header">

              <div className="stock-modal-product-icon">
                🧪
              </div>

              <div>

                <strong>
                  {historyProduct.name}
                </strong>

                <span>
                  Estoque atual:{" "}
                  {Number(
                    historyProduct.stock
                  ) || 0}{" "}
                  {historyProduct.unit ||
                    "un"}
                </span>

              </div>

            </div>

            {/* =============================================
                CARREGANDO
            ============================================= */}

            {loadingHistory && (

              <div className="history-loading">

                <span>
                  ⏳
                </span>

                Carregando histórico...

              </div>

            )}

            {/* =============================================
                SEM MOVIMENTAÇÕES
            ============================================= */}

            {!loadingHistory &&
              historyMovements.length ===
                0 && (

                <div className="history-empty">

                  <div>
                    📋
                  </div>

                  <strong>
                    Nenhuma movimentação
                  </strong>

                  <span>
                    Este produto ainda não possui
                    movimentações registradas.
                  </span>

                </div>
              )}

            {/* =============================================
                LISTA
            ============================================= */}

            {!loadingHistory &&
              historyMovements.length >
                0 && (

                <div className="history-list">

                  {historyMovements.map(
                    (
                      movement,
                      index
                    ) => {

                      const isEntry =
                        movement.type ===
                        "entrada";

                      return (

                        <div
                          className="history-item"
                          key={
                            movement.id ||
                            `${movement.date}-${index}`
                          }
                        >

                          <div
                            className={
                              isEntry
                                ? "history-icon entrada"
                                : "history-icon saida"
                            }
                          >
                            {isEntry
                              ? "↓"
                              : "↑"}
                          </div>

                          <div className="history-main">

                            <div className="history-top">

                              <strong>
                                {isEntry
                                  ? "Entrada"
                                  : "Saída"}
                              </strong>

                              <span
                                className={
                                  isEntry
                                    ? "history-quantity entrada"
                                    : "history-quantity saida"
                                }
                              >
                                {isEntry
                                  ? "+"
                                  : "-"}
                                {Number(
                                  movement.quantity
                                )}{" "}
                                {historyProduct.unit ||
                                  "un"}
                              </span>

                            </div>

                            <p>
                              {movement.reason ||
                                "Sem motivo informado"}
                            </p>

                            <small>
                              {formatMovementDate(
                                movement.date
                              )}
                            </small>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>
              )}

            <div className="history-footer">

              <button
                type="button"
                className="stock-cancel-button"
                onClick={closeHistory}
                disabled={
                  loadingHistory
                }
              >
                Fechar
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

export default Library;