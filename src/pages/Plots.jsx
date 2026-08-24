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
}) {
  const [plots, setPlots] = useState([]);

  async function loadPlots() {
    if (!property?.id) {
      setPlots([]);
      return;
    }

    try {
      const data = await getPlotsByProperty(
        property.id
      );

      setPlots(data);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR TALHÕES:",
        error
      );
    }
  }

  useEffect(() => {
    loadPlots();
  }, [property]);

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

  return (
    <main className="plots-page">

      <div className="plots-heading">

        <div>

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
          className="primary-button"
          onClick={onNewPlot}
          disabled={!property}
        >
          + Novo talhão
        </button>

      </div>

      <section className="plots-content">

        {!property ? (

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

          </div>

        ) : plots.length === 0 ? (

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
              Cadastrar primeiro talhão
            </button>

          </div>

        ) : (

          <div className="plots-list">

            {plots.map((plot) => (

              <article
                className="plot-card"
                key={plot.id}
              >

                <div className="plot-card-content">

                  <div className="plot-icon">
                    🌱
                  </div>

                  <div className="plot-info">

                    <h3>
                      {plot.name}
                    </h3>

                    <div className="plot-details">

                      {plot.culture && (
                        <span>
                          Cultura: {plot.culture}
                        </span>
                      )}

                      {plot.area && (
                        <span>
                          Área: {plot.area}
                        </span>
                      )}

                      {plot.soil && (
                        <span>
                          Solo: {plot.soil}
                        </span>
                      )}

                    </div>

                  </div>

                </div>

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