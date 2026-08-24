import { useEffect, useState } from "react";

import {
  createProperty,
  updateProperty,
} from "../services/propertyService";

import "../styles/newProperty.css";

function NewProperty({
  onCancel,
  onPropertyCreated,
  propertyToEdit,
}) {
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name || "");
      setOwner(propertyToEdit.owner || "");
      setCity(propertyToEdit.city || "");
      setState(propertyToEdit.state || "");
    } else {
      setName("");
      setOwner("");
      setCity("");
      setState("");
    }
  }, [propertyToEdit]);

  async function handleSubmit(event) {
    event.preventDefault();

    const property = {
      name,
      owner,
      city,
      state,
    };

    try {
      if (propertyToEdit) {
        await updateProperty(propertyToEdit.id, property);

        alert("Propriedade atualizada com sucesso!");
      } else {
        await createProperty(property);

        alert("Propriedade cadastrada com sucesso!");
      }

      if (onPropertyCreated) {
        onPropertyCreated();
      } else {
        onCancel();
      }
    } catch (error) {
      console.error("ERRO AO SALVAR PROPRIEDADE:", error);

      alert(
        "Erro ao salvar a propriedade. Veja o Console (F12)."
      );
    }
  }

  return (
    <main className="new-property">

      <div className="page-heading">
        <span className="home-label">
          PROPRIEDADES
        </span>

        <h2>
          {propertyToEdit
            ? "Editar propriedade"
            : "Nova propriedade"}
        </h2>

        <p>
          {propertyToEdit
            ? "Atualize as informações da propriedade."
            : "Cadastre uma nova propriedade rural."}
        </p>
      </div>

      <form
        className="property-form"
        onSubmit={handleSubmit}
      >
        <div className="form-section">

          <h3>
            Informações da propriedade
          </h3>

          <div className="form-grid">

            <div className="form-group full">
              <label htmlFor="property-name">
                Nome da propriedade
              </label>

              <input
                id="property-name"
                type="text"
                placeholder="Ex.: Fazenda Boa Vista"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group full">
              <label htmlFor="owner">
                Proprietário
              </label>

              <input
                id="owner"
                type="text"
                placeholder="Ex.: João da Silva"
                value={owner}
                onChange={(event) =>
                  setOwner(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="city">
                Cidade
              </label>

              <input
                id="city"
                type="text"
                placeholder="Ex.: Jacobina"
                value={city}
                onChange={(event) =>
                  setCity(event.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="state">
                Estado
              </label>

              <input
                id="state"
                type="text"
                placeholder="Ex.: BA"
                maxLength="2"
                value={state}
                onChange={(event) =>
                  setState(event.target.value.toUpperCase())
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
          >
            {propertyToEdit
              ? "Salvar alterações"
              : "Salvar propriedade"}
          </button>

        </div>
      </form>
    </main>
  );
}

export default NewProperty;