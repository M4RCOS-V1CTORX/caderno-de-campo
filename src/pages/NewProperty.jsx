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
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [saving, setSaving] = useState(false);

  /* =========================================================
     PREENCHER FORMULÁRIO AO EDITAR
  ========================================================= */

  useEffect(() => {
    if (propertyToEdit) {
      setName(propertyToEdit.name || "");
      setLocation(
        propertyToEdit.location ||
          propertyToEdit.address ||
          ""
      );
      setDescription(
        propertyToEdit.description || ""
      );
    } else {
      setName("");
      setLocation("");
      setDescription("");
    }
  }, [propertyToEdit]);

  /* =========================================================
     SALVAR
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    const property = {
      name: name.trim(),
      location: location.trim(),
      description: description.trim(),
    };

    if (!property.name) {
      alert("Informe o nome da propriedade.");
      return;
    }

    try {
      setSaving(true);

      let savedProperty;

      /* =====================================================
         EDITAR
      ===================================================== */

      if (propertyToEdit) {
        await updateProperty(
          propertyToEdit.id,
          property
        );

        savedProperty = {
          ...propertyToEdit,
          ...property,
        };
      }

      /* =====================================================
         NOVA PROPRIEDADE
      ===================================================== */

      else {
        savedProperty =
          await createProperty(property);
      }

      /* =====================================================
         SUCESSO
      ===================================================== */

      alert(
        propertyToEdit
          ? "Propriedade atualizada com sucesso!"
          : "Propriedade cadastrada com sucesso!"
      );

      if (onPropertyCreated) {
        onPropertyCreated(savedProperty);
      } else if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error(
        "ERRO AO SALVAR PROPRIEDADE:",
        error
      );

      alert(
        "Erro ao salvar a propriedade. Veja o Console (F12)."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     TELA
  ========================================================= */

  return (
    <main className="new-property">
      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="page-heading">
        <span className="home-label">
          CADASTROS
        </span>

        <h2>
          {propertyToEdit
            ? "Editar propriedade"
            : "Nova propriedade"}
        </h2>

        <p>
          Cadastre uma propriedade para organizar
          seus locais e atividades de campo.
        </p>
      </div>

      {/* =====================================================
          FORMULÁRIO
      ===================================================== */}

      <form
        className="property-form"
        onSubmit={handleSubmit}
      >
        {/* ===================================================
            INFORMAÇÕES
        =================================================== */}

        <section className="property-form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              🏡
            </div>

            <div>
              <h3>
                Informações da propriedade
              </h3>

              <p>
                Informe os dados básicos do local.
              </p>
            </div>
          </div>

          <div className="property-form-grid">
            {/* =================================================
                NOME
            ================================================= */}

            <div className="property-form-group full">
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
                maxLength={100}
                autoComplete="off"
                required
              />
            </div>

            {/* =================================================
                LOCALIZAÇÃO
            ================================================= */}

            <div className="property-form-group full">
              <label htmlFor="property-location">
                Localização
              </label>

              <input
                id="property-location"
                type="text"
                placeholder="Ex.: Zona Rural, Jacobina - BA"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                maxLength={150}
                autoComplete="off"
              />

              <span className="field-hint">
                Informe cidade, região ou outra
                referência para localizar a propriedade.
              </span>
            </div>

            {/* =================================================
                DESCRIÇÃO
            ================================================= */}

            <div className="property-form-group full">
              <label htmlFor="property-description">
                Descrição
              </label>

              <textarea
                id="property-description"
                rows="5"
                placeholder="Adicione informações importantes sobre a propriedade..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                maxLength={1000}
              />

              <div className="character-counter">
                {description.length}/1000
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            INFORMAÇÃO SOBRE TALHÕES
        =================================================== */}

        <section className="property-info-box">
          <div className="property-info-icon">
            🌱
          </div>

          <div>
            <strong>
              Talhões
            </strong>

            <p>
              Depois de cadastrar a propriedade,
              você poderá adicionar e organizar os
              talhões pertencentes a ela.
            </p>
          </div>
        </section>

        {/* ===================================================
            AÇÕES
        =================================================== */}

        <div className="property-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Salvando..."
              : propertyToEdit
              ? "Salvar alterações"
              : "Salvar propriedade"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewProperty;