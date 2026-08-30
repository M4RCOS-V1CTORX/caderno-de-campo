import { useEffect, useMemo, useState } from "react";

import {
  getProperties,
  deleteProperty,
} from "../services/propertyService";

import { getPlotsByProperty } from "../services/plotService";

import "../styles/properties.css";

function Properties({
  onNewProperty,
  onEditProperty,
  onViewProperty,
  onViewPlots,
}) {
  const [properties, setProperties] = useState([]);
  const [plotCounts, setPlotCounts] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================================================
     CARREGAR PROPRIEDADES
  ========================================================= */

  async function loadProperties() {
    try {
      setLoading(true);

      const data = await getProperties();

      const propertyList = Array.isArray(data) ? data : [];

      setProperties(propertyList);

      /*
       * Carrega a quantidade de talhões
       * de cada propriedade.
       */

      const counts = {};

      await Promise.all(
        propertyList.map(async (property) => {
          try {
            const plots = await getPlotsByProperty(
              Number(property.id)
            );

            counts[property.id] = Array.isArray(plots)
              ? plots.length
              : 0;
          } catch (error) {
            console.error(
              `ERRO AO CARREGAR TALHÕES DA PROPRIEDADE ${property.id}:`,
              error
            );

            counts[property.id] = 0;
          }
        })
      );

      setPlotCounts(counts);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR PROPRIEDADES:",
        error
      );

      setProperties([]);
      setPlotCounts({});
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     CARREGAMENTO INICIAL
  ========================================================= */

  useEffect(() => {
    loadProperties();
  }, []);

  /* =========================================================
     ABRIR TALHÕES
  ========================================================= */

  function handleViewPlots(property) {
    /*
     * Primeiro tenta usar a função onViewPlots.
     * É a função principal usada pelo App.jsx.
     */

    if (onViewPlots) {
      onViewPlots(property);
      return;
    }

    /*
     * Mantém compatibilidade caso alguma versão
     * anterior do App.jsx esteja usando onViewProperty.
     */

    if (onViewProperty) {
      onViewProperty(property);
    }
  }

  /* =========================================================
     FILTRO DE PESQUISA
  ========================================================= */

  const filteredProperties = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    if (!normalizedSearch) {
      return properties;
    }

    return properties.filter((property) => {
      const name = String(
        property.name || ""
      ).toLowerCase();

      const location = String(
        property.location ||
          property.address ||
          property.city ||
          ""
      ).toLowerCase();

      return (
        name.includes(normalizedSearch) ||
        location.includes(normalizedSearch)
      );
    });
  }, [properties, search]);

  /* =========================================================
     EXCLUIR PROPRIEDADE
  ========================================================= */

  async function handleDeleteProperty(property) {
    const confirmed = window.confirm(
      `Deseja realmente excluir a propriedade "${property.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProperty(property.id);

      /*
       * Atualiza a tela imediatamente.
       */

      setProperties((currentProperties) =>
        currentProperties.filter(
          (item) => item.id !== property.id
        )
      );

      setPlotCounts((currentCounts) => {
        const updatedCounts = {
          ...currentCounts,
        };

        delete updatedCounts[property.id];

        return updatedCounts;
      });

      alert("Propriedade excluída com sucesso!");
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR PROPRIEDADE:",
        error
      );

      alert(
        "Não foi possível excluir a propriedade."
      );
    }
  }

  /* =========================================================
     LIMPAR PESQUISA
  ========================================================= */

  function clearSearch() {
    setSearch("");
  }

  /* =========================================================
     TOTAL DE TALHÕES
  ========================================================= */

  const totalPlots = Object.values(plotCounts).reduce(
    (total, count) => total + count,
    0
  );

  /* =========================================================
     TELA
  ========================================================= */

  return (
    <main className="properties">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="properties-header">

        <div className="properties-heading">

          <span className="home-label">
            CADASTROS
          </span>

          <h2>
            Propriedades
          </h2>

          <p>
            Gerencie as propriedades cadastradas no
            caderno de campo.
          </p>

        </div>

        <button
          type="button"
          className="primary-button properties-new-button"
          onClick={onNewProperty}
        >
          <span>＋</span>
          Nova propriedade
        </button>

      </div>

      {/* =====================================================
          RESUMO
      ===================================================== */}

      <section className="properties-summary">

        <div className="summary-card">

          <span className="summary-icon">
            🏡
          </span>

          <div>

            <strong>
              {properties.length}
            </strong>

            <p>
              {properties.length === 1
                ? "PROPRIEDADE CADASTRADA"
                : "PROPRIEDADES CADASTRADAS"}
            </p>

          </div>

        </div>

        <div className="summary-card">

          <span className="summary-icon">
            🌱
          </span>

          <div>

            <strong>
              {totalPlots}
            </strong>

            <p>
              {totalPlots === 1
                ? "TALHÃO CADASTRADO"
                : "TALHÕES CADASTRADOS"}
            </p>

          </div>

        </div>

      </section>

      {/* =====================================================
          LISTA
      ===================================================== */}

      <section className="properties-section">

        <div className="section-title">

          <div>

            <h3>
              Minhas propriedades
            </h3>

            <p>
              Consulte e gerencie seus locais de
              trabalho.
            </p>

          </div>

        </div>

        {/* ===================================================
            PESQUISA
        =================================================== */}

        <div className="property-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Pesquisar propriedade..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Limpar pesquisa"
            >
              ×
            </button>
          )}

        </div>

        {/* ===================================================
            CARREGANDO
        =================================================== */}

        {loading ? (

          <div className="properties-loading">

            <div className="loading-spinner"></div>

            <p>
              Carregando propriedades...
            </p>

          </div>

        ) : filteredProperties.length > 0 ? (

          <div className="properties-list">

            {filteredProperties.map((property) => (

              <article
                className="property-card"
                key={property.id}
              >

                {/* =================================================
                    ÍCONE
                ================================================= */}

                <div className="property-icon">
                  🏡
                </div>

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div className="property-info">

                  <h4>
                    {property.name ||
                      "Propriedade sem nome"}
                  </h4>

                  <p>
                    {property.location ||
                      property.address ||
                      property.city ||
                      "Localização não informada"}
                  </p>

                </div>

                {/* =================================================
                    META
                ================================================= */}

                <div className="property-meta">

                  <span className="plot-badge">

                    🌱{" "}

                    {plotCounts[property.id] || 0}{" "}

                    {plotCounts[property.id] === 1
                      ? "talhão"
                      : "talhões"}

                  </span>

                </div>

                {/* =================================================
                    AÇÕES
                ================================================= */}

                <div
                  className="property-actions"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                >

                  {/* TALHÕES */}

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      handleViewPlots(property)
                    }
                  >
                    Talhões
                  </button>

                  {/* EDITAR */}

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => {

                      if (onEditProperty) {
                        onEditProperty(property);
                      }

                    }}
                  >
                    Editar
                  </button>

                  {/* EXCLUIR */}

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDeleteProperty(property)
                    }
                  >
                    Excluir
                  </button>

                </div>

                {/* =================================================
                    SETA
                ================================================= */}

                <span className="property-arrow">
                  →
                </span>

              </article>

            ))}

          </div>

        ) : search ? (

          /* =================================================
             PESQUISA SEM RESULTADO
          ================================================= */

          <div className="properties-empty">

            <div className="empty-icon">
              ⌕
            </div>

            <h3>
              Nenhuma propriedade encontrada
            </h3>

            <p>
              Não encontramos nenhuma propriedade
              correspondente à sua pesquisa.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={clearSearch}
            >
              Limpar pesquisa
            </button>

          </div>

        ) : (

          /* =================================================
             NENHUMA PROPRIEDADE
          ================================================= */

          <div className="properties-empty">

            <div className="empty-icon">
              🏡
            </div>

            <h3>
              Nenhuma propriedade cadastrada
            </h3>

            <p>
              Cadastre sua primeira propriedade para
              começar a organizar os locais e talhões
              utilizados nas atividades de campo.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onNewProperty}
            >
              ＋ Nova propriedade
            </button>

          </div>

        )}

      </section>

    </main>
  );
}

export default Properties;