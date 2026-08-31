<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
          const propertyId =
            Number(activity.propertyId);
=======
          const propertyId = Number(activity.propertyId);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

          if (!Number.isNaN(propertyId)) {
            const propertyData =
              await getPropertyById(propertyId);

            if (!cancelled) {
<<<<<<< HEAD
              setProperty(
                propertyData || null
              );
=======
              setProperty(propertyData || null);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
          const plotId =
            Number(activity.plotId);
=======
          const plotId = Number(activity.plotId);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

          if (!Number.isNaN(plotId)) {
            const plotData =
              await getPlotById(plotId);

            if (!cancelled) {
<<<<<<< HEAD
              setPlot(
                plotData || null
              );
=======
              setPlot(plotData || null);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
            await getPhotosByActivity(
              activity.id
            );

          if (!cancelled) {
            setPhotos(
              photoData || []
            );
=======
            await getPhotosByActivity(activity.id);

          if (!cancelled) {
            setPhotos(photoData || []);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
  /* =========================================================
     CULTURA
  ========================================================= */

  const culture =
    plot?.culture ||
    "Cultura não informada";

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="activity-details">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}
=======
  return (
    <main className="activity-details">

      {/* =========================================
          CABEÇALHO
      ========================================== */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

      <header className="details-header">

        <div className="details-header-content">

          <span className="details-eyebrow">
            REGISTRO DE CAMPO
          </span>

          <h2>
<<<<<<< HEAD
            {activity.title ||
              "Atividade sem título"}
=======
            {activity.title}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          </h2>

          <p>
            Detalhes completos da atividade registrada.
          </p>

        </div>

        <div className="details-header-badge">
<<<<<<< HEAD

          <span className="details-status-dot" />

          Registro salvo

=======
          <span className="details-status-dot" />
          Registro salvo
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
        </div>

      </header>

<<<<<<< HEAD
      {/* =====================================================
          RESUMO PRINCIPAL
      ===================================================== */}
=======

      {/* =========================================
          RESUMO PRINCIPAL
      ========================================== */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

      <section className="activity-summary">

        <div className="summary-main">

          <div className="summary-icon">
            📋
          </div>

          <div>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            <span className="summary-label">
              ATIVIDADE
            </span>

            <strong>
<<<<<<< HEAD
              {activity.title ||
                "Atividade sem título"}
            </strong>

            <span className="summary-date">
              Registrada em{" "}
              {formatDate(
                activity.date
              )}
            </span>

=======
              {activity.title}
            </strong>

            <span className="summary-date">
              Registrada em {formatDate(activity.date)}
            </span>
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          </div>

        </div>

        <div className="summary-divider" />

        <div className="summary-location">

          <span className="summary-mini-icon">
            📍
          </span>

          <div>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            <span className="summary-label">
              LOCAL
            </span>

            <strong>
              {activity.location ||
                "Local não informado"}
            </strong>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          </div>

        </div>

      </section>

<<<<<<< HEAD
      {/* =====================================================
          INFORMAÇÕES
      ===================================================== */}
=======

      {/* =========================================
          INFORMAÇÕES
      ========================================== */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

      <section className="details-card information-card">

        <div className="card-heading">

          <div className="card-heading-icon">
            ◈
          </div>

          <div>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            <h3>
              Informações da atividade
            </h3>

            <p>
              Dados relacionados ao registro de campo.
            </p>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          </div>

        </div>

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
                {formatDate(
                  activity.date
                )}
=======
                {formatDate(activity.date)}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
              </strong>

            </div>

          </div>

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
          {/* CULTURA */}

          <div className="detail-item">

            <div className="detail-icon">
              🌾
            </div>

            <div className="detail-content">

              <span className="detail-label">
                Cultura
              </span>

              <strong>
                {culture}
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MANEJO
      ===================================================== */}

      {(activity.managementType ||
        activity.managementStatus) && (

        <section className="details-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🔧
            </div>

            <div>

              <h3>
                Manejo
              </h3>

              <p>
                Informações sobre o manejo realizado.
              </p>

            </div>

          </div>

          <div className="details-grid">

            {/* TIPO */}

            {activity.managementType && (

              <div className="detail-item">

                <div className="detail-icon">
                  🔧
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    Tipo de manejo
                  </span>

                  <strong>
                    {activity.managementType}
                  </strong>

                </div>

              </div>

            )}

            {/* STATUS */}

            {activity.managementStatus && (

              <div className="detail-item">

                <div className="detail-icon">
                  🚦
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    Status
                  </span>

                  <strong
                    className={`management-status status-${normalizeStatus(
                      activity.managementStatus
                    )}`}
                  >
                    {activity.managementStatus}
                  </strong>

                </div>

              </div>

            )}

          </div>

        </section>
      )}

      {/* =====================================================
          OCORRÊNCIAS
      ===================================================== */}

      {(activity.pest ||
        activity.disease) && (

        <section className="details-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🔎
            </div>

            <div>

              <h3>
                Ocorrências
              </h3>

              <p>
                Problemas observados durante a atividade.
              </p>

            </div>

          </div>

          <div className="details-grid">

            {/* PRAGA */}

            {activity.pest && (

              <div className="detail-item">

                <div className="detail-icon">
                  🐛
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    Praga
                  </span>

                  <strong>
                    {activity.pest}
                  </strong>

                </div>

              </div>

            )}

            {/* DOENÇA */}

            {activity.disease && (

              <div className="detail-item">

                <div className="detail-icon">
                  🦠
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    Doença
                  </span>

                  <strong>
                    {activity.disease}
                  </strong>

                </div>

              </div>

            )}

          </div>

        </section>
      )}

      {/* =====================================================
          PRODUTO
      ===================================================== */}

      {(activity.product ||
        activity.quantity) && (

        <section className="details-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🧪
            </div>

            <div>

              <h3>
                Produto utilizado
              </h3>

              <p>
                Informações do produto utilizado no campo.
              </p>

            </div>

          </div>

          <div className="details-grid">

            {/* PRODUTO */}

            {activity.product && (

              <div className="detail-item">

                <div className="detail-icon">
                  🧪
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    Produto
                  </span>

                  <strong>
                    {activity.product}
                  </strong>

                </div>

              </div>

            )}

            {/* QUANTIDADE */}

            {activity.quantity && (

              <div className="detail-item">

                <div className="detail-icon">
                  📏
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    Quantidade
                  </span>

                  <strong>
                    {activity.quantity}
                  </strong>

                </div>

              </div>

            )}

          </div>

        </section>
      )}

      {/* =====================================================
          DESCRIÇÃO
      ===================================================== */}

      <section className="details-card">
=======
        </div>


        {/* =====================================
            DESCRIÇÃO
        ====================================== */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

        <div className="detail-description">

          <div className="description-heading">

            <div className="description-icon">
              📝
            </div>

            <div>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
              <span className="detail-label">
                DESCRIÇÃO
              </span>

              <strong>
                Observações da atividade
              </strong>
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            </div>

          </div>

          <div className="description-content">

            {activity.description ? (
<<<<<<< HEAD

              <p>
                {activity.description}
              </p>

            ) : (

              <p className="description-empty">
                Nenhuma descrição foi adicionada
                a esta atividade.
              </p>

=======
              <p>
                {activity.description}
              </p>
            ) : (
              <p className="description-empty">
                Nenhuma descrição foi adicionada a
                esta atividade.
              </p>
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            )}

          </div>

        </div>

      </section>

<<<<<<< HEAD
      {/* =====================================================
          FOTOS
      ===================================================== */}
=======

      {/* =========================================
          FOTOS
      ========================================== */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

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
<<<<<<< HEAD

              {photos.length}

              {photos.length === 1
                ? " foto"
                : " fotos"}

=======
              {photos.length}
              {photos.length === 1
                ? " foto"
                : " fotos"}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            </span>

          </div>

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          <div className="details-photo-grid">

            {photos.map((photo) => {

              const imageUrl =
<<<<<<< HEAD
                URL.createObjectURL(
                  photo.file
                );
=======
                URL.createObjectURL(photo.file);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

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
<<<<<<< HEAD

                    <span>
                      Foto da atividade
                    </span>

=======
                    <span>
                      Foto da atividade
                    </span>
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
                  </div>

                </div>

              );
            })}

          </div>

        </section>

      )}

<<<<<<< HEAD
      {/* =====================================================
          AÇÕES
      ===================================================== */}
=======

      {/* =========================================
          AÇÕES
      ========================================== */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

      <footer className="details-actions">

        <button
          type="button"
          className="secondary-button details-back-button"
          onClick={onBack}
        >
<<<<<<< HEAD

          <span>
            ←
          </span>

          Voltar

=======
          <span>←</span>
          Voltar
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
        </button>

        <button
          type="button"
          className="primary-button details-edit-button"
<<<<<<< HEAD
          onClick={() =>
            onEdit(activity)
          }
        >

          <span>
            ✎
          </span>

          Editar atividade

=======
          onClick={() => onEdit(activity)}
        >
          <span>✎</span>
          Editar atividade
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
        </button>

      </footer>

    </main>
  );
}

<<<<<<< HEAD
/* =========================================================
   FORMATAÇÃO DA DATA
========================================================= */
=======

/* =========================================
   FORMATAÇÃO DA DATA
========================================= */
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

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

<<<<<<< HEAD
/* =========================================================
   NORMALIZAR STATUS PARA CSS
========================================================= */

function normalizeStatus(status) {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export default ActivityDetails;
=======
export default ActivityDetails;
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
