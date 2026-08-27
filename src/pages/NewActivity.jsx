import { useEffect, useState } from "react";

import {
  createActivity,
  updateActivity,
} from "../services/activityService";

import { addPhoto } from "../services/photoService";
import { getProperties } from "../services/propertyService";
import { getPlotsByProperty } from "../services/plotService";

import "../styles/newActivity.css";

function NewActivity({
  onCancel,
  onActivityCreated,
  activityToEdit,
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [properties, setProperties] = useState([]);
  const [plots, setPlots] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [plotId, setPlotId] = useState("");

  const [photos, setPhotos] = useState([]);

  /* =========================================================
     CARREGAR PROPRIEDADES
  ========================================================= */

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();

        setProperties(data || []);
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR PROPRIEDADES:",
          error
        );

        setProperties([]);
      }
    }

    loadProperties();
  }, []);

  /* =========================================================
     CARREGAR TALHÕES
  ========================================================= */

  useEffect(() => {
    async function loadPlots() {
      if (!propertyId) {
        setPlots([]);
        setPlotId("");
        return;
      }

      try {
        const data = await getPlotsByProperty(
          Number(propertyId)
        );

        setPlots(data || []);
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR TALHÕES:",
          error
        );

        setPlots([]);
      }
    }

    loadPlots();
  }, [propertyId]);

  /* =========================================================
     PREENCHER FORMULÁRIO NA EDIÇÃO
  ========================================================= */

  useEffect(() => {
    if (activityToEdit) {
      setTitle(activityToEdit.title || "");
      setDate(activityToEdit.date || "");
      setLocation(activityToEdit.location || "");
      setDescription(
        activityToEdit.description || ""
      );

      setPropertyId(
        activityToEdit.propertyId !== null &&
        activityToEdit.propertyId !== undefined
          ? String(activityToEdit.propertyId)
          : ""
      );

      setPlotId(
        activityToEdit.plotId !== null &&
        activityToEdit.plotId !== undefined
          ? String(activityToEdit.plotId)
          : ""
      );

      /*
       * Fotos já salvas permanecem vinculadas
       * à atividade e serão exibidas na tela
       * de detalhes.
       *
       * Aqui entram somente novas fotos.
       */
      setPhotos([]);
    } else {
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
      setPropertyId("");
      setPlotId("");
      setPhotos([]);
    }
  }, [activityToEdit]);

  /* =========================================================
     PROPRIEDADE
  ========================================================= */

  function handlePropertyChange(event) {
    const value = event.target.value;

    setPropertyId(value);

    // Ao trocar a propriedade,
    // o talhão anterior deixa de ser válido.
    setPlotId("");
  }

  /* =========================================================
     FOTOS
  ========================================================= */

  function handlePhotoChange(event) {
    const selectedFiles = Array.from(
      event.target.files || []
    );

    if (selectedFiles.length === 0) {
      return;
    }

    setPhotos((currentPhotos) => [
      ...currentPhotos,
      ...selectedFiles,
    ]);

    // Permite selecionar novamente a mesma foto.
    event.target.value = "";
  }

  function removePhoto(index) {
    setPhotos((currentPhotos) =>
      currentPhotos.filter(
        (_, photoIndex) =>
          photoIndex !== index
      )
    );
  }

  /* =========================================================
     SALVAR
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    const activity = {
      title: title.trim(),
      date,
      location: location.trim(),
      description: description.trim(),

      propertyId: propertyId
        ? Number(propertyId)
        : null,

      plotId: plotId
        ? Number(plotId)
        : null,
    };

    try {
      let savedActivity;

      /* =====================================================
         EDITAR
      ===================================================== */

      if (activityToEdit) {
        await updateActivity(
          activityToEdit.id,
          activity
        );

        savedActivity = {
          ...activityToEdit,
          ...activity,
        };
      }

      /* =====================================================
         NOVA ATIVIDADE
      ===================================================== */

      else {
        savedActivity =
          await createActivity(activity);
      }

      /* =====================================================
         SALVAR NOVAS FOTOS
      ===================================================== */

      if (photos.length > 0) {
        for (const photo of photos) {
          await addPhoto(
            savedActivity.id,
            photo
          );
        }
      }

      /* =====================================================
         SUCESSO
      ===================================================== */

      alert(
        activityToEdit
          ? "Atividade atualizada com sucesso!"
          : "Atividade cadastrada com sucesso!"
      );

      if (onActivityCreated) {
        onActivityCreated();
      } else {
        onCancel();
      }
    } catch (error) {
      console.error(
        "ERRO AO SALVAR ATIVIDADE:",
        error
      );

      alert(
        "Erro ao salvar a atividade. Veja o Console (F12)."
      );
    }
  }

  /* =========================================================
     TELA
  ========================================================= */

  return (
    <main className="new-activity">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <header className="page-heading">

        <div className="page-heading-content">

          <span className="home-label">
            ATIVIDADES
          </span>

          <h2>
            {activityToEdit
              ? "Editar atividade"
              : "Nova atividade"}
          </h2>

          <p>
            {activityToEdit
              ? "Atualize as informações deste registro de campo."
              : "Registre uma nova atividade de campo."}
          </p>

        </div>

      </header>


      {/* =====================================================
          FORMULÁRIO
      ===================================================== */}

      <form
        className="activity-form"
        onSubmit={handleSubmit}
      >

        {/* ===================================================
            INFORMAÇÕES
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              📝
            </div>

            <div>
              <h3>
                Informações da atividade
              </h3>

              <p>
                Preencha os dados principais do registro.
              </p>
            </div>

          </div>


          <div className="form-grid">

            {/* NOME */}

            <div className="form-group full">

              <label htmlFor="title">
                Nome da atividade
              </label>

              <input
                id="title"
                type="text"
                placeholder="Ex.: Visita à propriedade"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
              />

            </div>


            {/* DATA */}

            <div className="form-group">

              <label htmlFor="date">
                Data
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
              />

            </div>


            {/* LOCAL */}

            <div className="form-group">

              <label htmlFor="location">
                Local
              </label>

              <input
                id="location"
                type="text"
                placeholder="Ex.: Fazenda Boa Vista"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />

            </div>


            {/* PROPRIEDADE */}

            <div className="form-group">

              <label htmlFor="property">
                Propriedade
              </label>

              <select
                id="property"
                value={propertyId}
                onChange={handlePropertyChange}
              >

                <option value="">
                  Selecione uma propriedade
                </option>

                {properties.map((property) => (
                  <option
                    key={property.id}
                    value={property.id}
                  >
                    {property.name}
                  </option>
                ))}

              </select>

            </div>


            {/* TALHÃO */}

            <div className="form-group">

              <label htmlFor="plot">
                Talhão
              </label>

              <select
                id="plot"
                value={plotId}
                onChange={(event) =>
                  setPlotId(event.target.value)
                }
                disabled={!propertyId}
              >

                <option value="">
                  {propertyId
                    ? "Selecione um talhão"
                    : "Selecione uma propriedade primeiro"}
                </option>

                {plots.map((plot) => (
                  <option
                    key={plot.id}
                    value={plot.id}
                  >
                    {plot.name}
                  </option>
                ))}

              </select>

            </div>


            {/* DESCRIÇÃO */}

            <div className="form-group full">

              <label htmlFor="description">
                Descrição
              </label>

              <textarea
                id="description"
                rows="6"
                placeholder="Descreva o que foi realizado, observações, ocorrências ou informações importantes..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* ===================================================
            FOTOS
        =================================================== */}

        <section className="form-section photos-form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              📷
            </div>

            <div>

              <h3>
                Fotos da atividade
              </h3>

              <p>
                Registre visualmente o que foi observado no campo.
              </p>

            </div>

          </div>


          {/* UPLOAD */}

          <label
            htmlFor="activity-photos"
            className="photo-upload-button"
          >

            <span className="photo-upload-icon">
              ＋
            </span>

            <span>
              Adicionar fotos
            </span>

          </label>


          <input
            id="activity-photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="photo-input"
          />


          {/* PRÉ-VISUALIZAÇÃO */}

          {photos.length > 0 && (

            <div className="photo-preview-area">

              <div className="photo-preview-heading">

                <span>
                  Fotos selecionadas
                </span>

                <span>
                  {photos.length}
                </span>

              </div>


              <div className="photo-preview-grid">

                {photos.map(
                  (photo, index) => {

                    const previewUrl =
                      URL.createObjectURL(
                        photo
                      );

                    return (

                      <div
                        className="photo-preview"
                        key={`${photo.name}-${index}`}
                      >

                        <img
                          src={previewUrl}
                          alt={
                            photo.name ||
                            "Pré-visualização"
                          }
                        />

                        <button
                          type="button"
                          className="remove-photo-button"
                          onClick={() =>
                            removePhoto(index)
                          }
                          aria-label="Remover foto"
                          title="Remover foto"
                        >
                          ×
                        </button>

                      </div>

                    );
                  }
                )}

              </div>

            </div>

          )}


          {/* CONTADOR */}

          {photos.length > 0 && (

            <p className="photos-selected-count">

              {photos.length}

              {photos.length === 1
                ? " foto pronta para ser salva"
                : " fotos prontas para serem salvas"}

            </p>

          )}

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

            {activityToEdit
              ? "Salvar alterações"
              : "Salvar atividade"}

          </button>

        </div>

      </form>

    </main>
  );
}

export default NewActivity;