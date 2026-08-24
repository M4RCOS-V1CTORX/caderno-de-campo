import { useEffect, useState } from "react";

import {
  createPlot,
  updatePlot,
} from "../services/plotService";

import "../styles/newPlot.css";

function NewPlot({
  property,
  onCancel,
  onPlotCreated,
  plotToEdit,
}) {
  const [name, setName] = useState("");
  const [culture, setCulture] = useState("");
  const [soil, setSoil] = useState("");
  const [area, setArea] = useState("");

  useEffect(() => {
    if (plotToEdit) {
      setName(plotToEdit.name || "");
      setCulture(plotToEdit.culture || "");
      setSoil(plotToEdit.soil || "");
      setArea(plotToEdit.area || "");
    } else {
      setName("");
      setCulture("");
      setSoil("");
      setArea("");
    }
  }, [plotToEdit]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!property?.id) {
      alert(
        "Nenhuma propriedade foi selecionada."
      );

      return;
    }

    const plot = {
      propertyId: property.id,
      name,
      culture,
      soil,
      area,
    };

    try {
      if (plotToEdit) {
        await updatePlot(
          plotToEdit.id,
          plot
        );

        alert(
          "Talhão atualizado com sucesso!"
        );
      } else {
        await createPlot(plot);

        alert(
          "Talhão cadastrado com sucesso!"
        );
      }

      if (onPlotCreated) {
        onPlotCreated();
      }
    } catch (error) {
      console.error(
        "ERRO AO SALVAR TALHÃO:",
        error
      );

      alert(
        "Erro ao salvar o talhão. Veja o Console (F12)."
      );
    }
  }

  return (
    <main className="new-plot">

      <div className="page-heading">

        <span className="home-label">
          TALHÕES
        </span>

        <h2>
          {plotToEdit
            ? "Editar talhão"
            : "Novo talhão"}
        </h2>

        <p>
          {property
            ? `Cadastre um talhão da propriedade ${property.name}.`
            : "Cadastre as informações do talhão."}
        </p>

      </div>

      <form
        className="plot-form"
        onSubmit={handleSubmit}
      >

        <div className="form-section">

          <h3>
            Informações do talhão
          </h3>

          <div className="form-grid">

            <div className="form-group full">

              <label>
                Propriedade
              </label>

              <div className="property-selected">

                <span>
                  🏡
                </span>

                <strong>
                  {property?.name ||
                    "Nenhuma propriedade selecionada"}
                </strong>

              </div>

            </div>

            <div className="form-group full">

              <label htmlFor="plot-name">
                Nome do talhão
              </label>

              <input
                id="plot-name"
                type="text"
                placeholder="Ex.: Talhão Norte"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="culture">
                Cultura
              </label>

              <input
                id="culture"
                type="text"
                placeholder="Ex.: Café"
                value={culture}
                onChange={(event) =>
                  setCulture(event.target.value)
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="area">
                Área
              </label>

              <input
                id="area"
                type="text"
                placeholder="Ex.: 12,5 ha"
                value={area}
                onChange={(event) =>
                  setArea(event.target.value)
                }
              />

            </div>

            <div className="form-group full">

              <label htmlFor="soil">
                Tipo de solo
              </label>

              <input
                id="soil"
                type="text"
                placeholder="Ex.: Latossolo"
                value={soil}
                onChange={(event) =>
                  setSoil(event.target.value)
                }
              />

            </div>

          </div>

        </div>

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
            disabled={!property}
          >
            {plotToEdit
              ? "Salvar alterações"
              : "Salvar talhão"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default NewPlot;