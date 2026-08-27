
import { useEffect, useState } from "react";

import {
  getPlotsByProperty,
  deletePlot,
} from "../services/plotService";

import "../styles/plots.css";

function Plots({
  property,
  onNewPlot,
  onEditPlot,
  onBack,
}) {
  const [plots, setPlots] = useState([]);

  /* =========================================================
     CARREGAR TALHÕES
  ========================================================= */

  async function loadPlots() {
    if (!property?.id) {
      setPlots([]);
      return;
    }

    try {
      const data = await getPlotsByProperty(property.id);

      setPlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR TALHÕES:",
        error
      );

      setPlots([]);
    }
  }

  /* =========================================================
     CARREGAMENTO INICIAL
  ========================================================= */

  useEffect(() => {
    loadPlots();
  }, [property]);

  /* =========================================================
     EXCLUIR TALHÃO
  ========================================================= */

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este talhão?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePlot(id);

      await loadPlots();
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR TALHÃO:",
        error
      );

      alert(
        "Não foi possível excluir o talhão."
      );
    }
  }

  /* =========================================================
     TELA
  ========================================================= */

  return (
    <main className="plots-page">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="plots-heading">

        <div className="plots-heading-content">

          <span className="home-label">
            PROPRIEDADE
          </span>

          <h2>
            {property?.name || "Talhões"}
          </h2>

          <p>
            Gerencie os talhões desta propriedade.
          </p>

        </div>

        <button
          type="button"
          className="primary-button plots-new-button"
          onClick={onNewPlot}
          disabled={!property}
        >
          <span>＋</span>
          Novo talhão
        </button>

      </div>

      {/* =====================================================
          BOTÃO VOLTAR
      ===================================================== */}

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Voltar para propriedades
      </button>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section className="plots-content">

        {!property ? (

          /* =================================================
             NENHUMA PROPRIEDADE
          ================================================= */

          <div className="empty-state">

            <div className="empty-icon">
              🏡
            </div>

            <h3>
              Nenhuma propriedade selecionada
            </h3>

            <p>
              Selecione uma propriedade para
              visualizar seus talhões.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              Voltar para propriedades
            </button>

          </div>

        ) : plots.length === 0 ? (

          /* =================================================
             NENHUM TALHÃO
          ================================================= */

          <div className="empty-state">

            <div className="empty-icon">
              🌱
            </div>

            <h3>
              Nenhum talhão cadastrado
            </h3>

            <p>
              Esta propriedade ainda não possui
              talhões cadastrados.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onNewPlot}
            >
              ＋ Cadastrar primeiro talhão
            </button>

          </div>

        ) : (

          /* =================================================
             LISTA DE TALHÕES
          ================================================= */

          <div className="plots-list">

            {plots.map((plot) => (

              <article
                className="plot-card"
                key={plot.id}
              >

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div className="plot-card-content">

                  <div className="plot-icon">
                    🌱
                  </div>

                  <div className="plot-info">

                    <h3>
                      {plot.name ||
                        "Talhão sem nome"}
                    </h3>

                    <div className="plot-details">

                      {plot.culture && (
                        <span>
                          <strong>Cultura:</strong>{" "}
                          {plot.culture}
                        </span>
                      )}

                      {plot.area && (
                        <span>
                          <strong>Área:</strong>{" "}
                          {plot.area}
                        </span>
                      )}

                      {plot.soil && (
                        <span>
                          <strong>Solo:</strong>{" "}
                          {plot.soil}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

                {/* =================================================
                    AÇÕES
                ================================================= */}

                <div className="plot-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      onEditPlot(plot)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(plot.id)
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

export default Plots;