import { useEffect, useState } from "react";

import { getPropertyById } from "../services/propertyService";
import { getPlotById } from "../services/plotService";
import { getPhotosByActivity } from "../services/photoService";

import "../styles/activityDetails.css";

function ActivityDetails({
  activity,
  onBack,
  onEdit,
}) {
  const [property, setProperty] = useState(null);
  const [plot, setPlot] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      if (!activity) {
        setProperty(null);
        setPlot(null);
        setPhotos([]);
        return;
      }

      setProperty(null);
      setPlot(null);
      setPhotos([]);

      try {
        /* ================================
           PROPRIEDADE
        ================================= */

        if (
          activity.propertyId !== null &&
          activity.propertyId !== undefined
        ) {
          const propertyId = Number(activity.propertyId);

          if (!Number.isNaN(propertyId)) {
            const propertyData =
              await getPropertyById(propertyId);

            if (!cancelled) {
              setProperty(propertyData || null);
            }
          }
        }

        /* ================================
           TALHÃO
        ================================= */

        if (
          activity.plotId !== null &&
          activity.plotId !== undefined
        ) {
          const plotId = Number(activity.plotId);

          if (!Number.isNaN(plotId)) {
            const plotData =
              await getPlotById(plotId);

            if (!cancelled) {
              setPlot(plotData || null);
            }
          }
        }

        /* ================================
           FOTOS
        ================================= */

        if (
          activity.id !== null &&
          activity.id !== undefined
        ) {
          const photoData =
            await getPhotosByActivity(activity.id);

          if (!cancelled) {
            setPhotos(photoData || []);
          }
        }
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR DETALHES DA ATIVIDADE:",
          error
        );
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [activity]);

  if (!activity) {
    return null;
  }

  return (
    <main className="activity-details">

      {/* =========================================
          CABEÇALHO
      ========================================== */}

      <header className="details-header">

        <div className="details-header-content">

          <span className="details-eyebrow">
            REGISTRO DE CAMPO
          </span>

          <h2>
            {activity.title}
          </h2>

          <p>
            Detalhes completos da atividade registrada.
          </p>

        </div>

        <div className="details-header-badge">
          <span className="details-status-dot" />
          Registro salvo
        </div>

      </header>


      {/* =========================================
          RESUMO PRINCIPAL
      ========================================== */}

      <section className="activity-summary">

        <div className="summary-main">

          <div className="summary-icon">
            📋
          </div>

          <div>
            <span className="summary-label">
              ATIVIDADE
            </span>

            <strong>
              {activity.title}
            </strong>

            <span className="summary-date">
              Registrada em {formatDate(activity.date)}
            </span>
          </div>

        </div>

        <div className="summary-divider" />

        <div className="summary-location">

          <span className="summary-mini-icon">
            📍
          </span>

          <div>
            <span className="summary-label">
              LOCAL
            </span>

            <strong>
              {activity.location ||
                "Local não informado"}
            </strong>
          </div>

        </div>

      </section>


      {/* =========================================
          INFORMAÇÕES
      ========================================== */}

      <section className="details-card information-card">

        <div className="card-heading">

          <div className="card-heading-icon">
            ◈
          </div>

          <div>
            <h3>
              Informações da atividade
            </h3>

            <p>
              Dados relacionados ao registro de campo.
            </p>
          </div>

        </div>


        <div className="details-grid">

          {/* DATA */}

          <div className="detail-item">

            <div className="detail-icon">
              📅
            </div>

            <div className="detail-content">

              <span className="detail-label">
                Data
              </span>

              <strong>
                {formatDate(activity.date)}
              </strong>

            </div>

          </div>


          {/* LOCAL */}

          <div className="detail-item">

            <div className="detail-icon">
              📍
            </div>

            <div className="detail-content">

              <span className="detail-label">
                Local
              </span>

              <strong>
                {activity.location ||
                  "Local não informado"}
              </strong>

            </div>

          </div>


          {/* PROPRIEDADE */}

          <div className="detail-item">

            <div className="detail-icon">
              🏡
            </div>

            <div className="detail-content">

              <span className="detail-label">
                Propriedade
              </span>

              <strong>
                {property?.name ||
                  "Propriedade não informada"}
              </strong>

            </div>

          </div>


          {/* TALHÃO */}

          <div className="detail-item">

            <div className="detail-icon">
              🌱
            </div>

            <div className="detail-content">

              <span className="detail-label">
                Talhão
              </span>

              <strong>
                {plot?.name ||
                  "Talhão não informado"}
              </strong>

            </div>

          </div>

        </div>


        {/* =====================================
            DESCRIÇÃO
        ====================================== */}

        <div className="detail-description">

          <div className="description-heading">

            <div className="description-icon">
              📝
            </div>

            <div>
              <span className="detail-label">
                DESCRIÇÃO
              </span>

              <strong>
                Observações da atividade
              </strong>
            </div>

          </div>

          <div className="description-content">

            {activity.description ? (
              <p>
                {activity.description}
              </p>
            ) : (
              <p className="description-empty">
                Nenhuma descrição foi adicionada a
                esta atividade.
              </p>
            )}

          </div>

        </div>

      </section>


      {/* =========================================
          FOTOS
      ========================================== */}

      {photos.length > 0 && (

        <section className="details-card photos-details">

          <div className="photos-heading">

            <div className="card-heading">

              <div className="card-heading-icon photo-card-icon">
                📷
              </div>

              <div>

                <h3>
                  Fotos da atividade
                </h3>

                <p>
                  Registros visuais associados ao campo.
                </p>

              </div>

            </div>

            <span className="photos-count">
              {photos.length}
              {photos.length === 1
                ? " foto"
                : " fotos"}
            </span>

          </div>


          <div className="details-photo-grid">

            {photos.map((photo) => {

              const imageUrl =
                URL.createObjectURL(photo.file);

              return (

                <div
                  className="details-photo"
                  key={photo.id}
                >

                  <img
                    src={imageUrl}
                    alt={
                      photo.name ||
                      "Foto da atividade"
                    }
                  />

                  <div className="photo-overlay">
                    <span>
                      Foto da atividade
                    </span>
                  </div>

                </div>

              );
            })}

          </div>

        </section>

      )}


      {/* =========================================
          AÇÕES
      ========================================== */}

      <footer className="details-actions">

        <button
          type="button"
          className="secondary-button details-back-button"
          onClick={onBack}
        >
          <span>←</span>
          Voltar
        </button>

        <button
          type="button"
          className="primary-button details-edit-button"
          onClick={() => onEdit(activity)}
        >
          <span>✎</span>
          Editar atividade
        </button>

      </footer>

    </main>
  );
}


/* =========================================
   FORMATAÇÃO DA DATA
========================================= */

function formatDate(date) {
  if (!date) {
    return "Sem data";
  }

  const [year, month, day] =
    date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

export default ActivityDetails;