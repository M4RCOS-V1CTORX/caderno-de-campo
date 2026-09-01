import { useEffect, useState } from "react";

import { getPropertyById } from "../services/propertyService";
import { getPlotById } from "../services/plotService";
import { getPhotosByActivity } from "../services/photoService";
import { getProductById } from "../services/productService";

import "../styles/activityDetails.css";

function ActivityDetails({ activity, onBack, onEdit }) {
  const [property, setProperty] = useState(null);
  const [plot, setPlot] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [productData, setProductData] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  /* =========================================================
     CARREGAR DADOS
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    async function loadDetails() {
      if (!activity) {
        setProperty(null);
        setPlot(null);
        setPhotos([]);
        setProductData(null);
        return;
      }

      try {
        setProperty(null);
        setPlot(null);
        setPhotos([]);
        setProductData(null);

        if (activity.propertyId) {
          const propertyData = await getPropertyById(
            activity.propertyId
          );

          if (!cancelled) {
            setProperty(propertyData || null);
          }
        }

        if (activity.plotId) {
          const plotData = await getPlotById(
            activity.plotId
          );

          if (!cancelled) {
            setPlot(plotData || null);
          }
        }

        if (activity.id) {
          const photosData = await getPhotosByActivity(
            activity.id
          );

          if (!cancelled) {
            setPhotos(photosData || []);
          }
        }

        /* =====================================================
           CARREGAR PRODUTO

           Registros novos possuem productId.
           Registros antigos continuam funcionando apenas
           com o nome salvo em activity.product.
        ===================================================== */

        if (activity.productId) {
          const product = await getProductById(
            activity.productId
          );

          if (!cancelled) {
            setProductData(product || null);
          }
        }
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR DETALHES:",
          error
        );
      }
    }

    loadDetails();

    return () => {
      cancelled = true;
    };
  }, [activity]);

  /* =========================================================
     CRIAR URLS DAS FOTOS
  ========================================================= */

  useEffect(() => {
    const urls = photos
      .filter((photo) => photo?.file)
      .map((photo) => ({
        ...photo,
        url: URL.createObjectURL(photo.file),
      }));

    setPhotoUrls(urls);

    return () => {
      urls.forEach((photo) => {
        URL.revokeObjectURL(photo.url);
      });
    };
  }, [photos]);

  /* =========================================================
     TECLADO DA GALERIA
  ========================================================= */

  useEffect(() => {
    if (selectedPhotoIndex === null) {
      return;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setSelectedPhotoIndex((current) => {
          if (photoUrls.length === 0) {
            return null;
          }

          if (current === 0) {
            return photoUrls.length - 1;
          }

          return current - 1;
        });
      }

      if (event.key === "ArrowRight") {
        setSelectedPhotoIndex((current) => {
          if (photoUrls.length === 0) {
            return null;
          }

          if (current === photoUrls.length - 1) {
            return 0;
          }

          return current + 1;
        });
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedPhotoIndex, photoUrls.length]);

  /* =========================================================
     FUNÇÕES DA GALERIA
  ========================================================= */

  function openPhoto(index) {
    setSelectedPhotoIndex(index);
  }

  function closePhoto() {
    setSelectedPhotoIndex(null);
  }

  function previousPhoto() {
    setSelectedPhotoIndex((current) => {
      if (photoUrls.length === 0) {
        return null;
      }

      if (current === 0) {
        return photoUrls.length - 1;
      }

      return current - 1;
    });
  }

  function nextPhoto() {
    setSelectedPhotoIndex((current) => {
      if (photoUrls.length === 0) {
        return null;
      }

      if (current === photoUrls.length - 1) {
        return 0;
      }

      return current + 1;
    });
  }

  /* =========================================================
     FORMATADORES
  ========================================================= */

  function formatDate(date) {
    if (!date) return "Sem data";

    const [year, month, day] = date.split("-");

    if (!year || !month || !day) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  function normalizeStatus(status) {
    return status
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
  }

  /* =========================================================
     QUANTIDADE DO PRODUTO
  ========================================================= */

  function getProductQuantity() {
    /*
      Registro novo:
      quantityValue = "20"
      productData.unit = "kg"

      Registro antigo:
      quantity = "20 kg"
    */

    if (activity.quantityValue) {
      const numericQuantity = Number(
        activity.quantityValue
      );

      if (!Number.isNaN(numericQuantity)) {
        const unit =
          productData?.unit ||
          "";

        return unit
          ? `${numericQuantity} ${unit}`
          : `${numericQuantity}`;
      }
    }

    return activity.quantity || "Não informado";
  }

  /* =========================================================
     PRODUTO SELECIONADO
  ========================================================= */

  const hasProduct = Boolean(
    activity.product ||
    activity.productId
  );

  /* =========================================================
     FOTO SELECIONADA
  ========================================================= */

  const selectedPhoto =
    selectedPhotoIndex !== null
      ? photoUrls[selectedPhotoIndex]
      : null;

  /* =========================================================
     RENDER
  ========================================================= */

  if (!activity) {
    return null;
  }

  return (
    <main className="activity-details">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <header className="details-header">
        <div className="details-header-content">
          <span className="details-eyebrow">
            REGISTRO DE CAMPO
          </span>

          <h2>{activity.title}</h2>

          {activity.description && (
            <p>{activity.description}</p>
          )}
        </div>

        <div className="details-header-badge">
          <span className="details-status-dot"></span>
          Registro salvo
        </div>
      </header>

      {/* =====================================================
          RESUMO
      ===================================================== */}

      <section className="activity-summary">

        <div className="summary-main">
          <div className="summary-icon">
            📋
          </div>

          <div>
            <span className="summary-label">
              ATIVIDADE
            </span>

            <strong className="summary-date">
              {activity.title}
            </strong>
          </div>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-main">
          <div className="summary-mini-icon">
            📅
          </div>

          <div>
            <span className="summary-label">
              DATA
            </span>

            <strong className="summary-date">
              {formatDate(activity.date)}
            </strong>
          </div>
        </div>

        {activity.location && (
          <>
            <div className="summary-divider"></div>

            <div className="summary-location">
              <span className="summary-label">
                LOCAL
              </span>

              <strong>
                {activity.location}
              </strong>
            </div>
          </>
        )}
      </section>

      {/* =====================================================
          INFORMAÇÕES
      ===================================================== */}

      <section className="details-card information-card">

        <div className="card-heading">

          <div className="card-heading-icon">
            📍
          </div>

          <div>
            <h3>
              Informações do registro
            </h3>

            <p>
              Localização e vínculo da atividade
            </p>
          </div>

        </div>

        <div className="details-grid">

          <div className="detail-item">
            <div className="detail-icon">
              📅
            </div>

            <div className="detail-content">
              <span className="detail-label">
                DATA
              </span>

              <strong>
                {formatDate(activity.date)}
              </strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              📍
            </div>

            <div className="detail-content">
              <span className="detail-label">
                LOCAL
              </span>

              <strong>
                {activity.location ||
                  "Não informado"}
              </strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              🏡
            </div>

            <div className="detail-content">
              <span className="detail-label">
                PROPRIEDADE
              </span>

              <strong>
                {property?.name ||
                  "Não informado"}
              </strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              🌱
            </div>

            <div className="detail-content">
              <span className="detail-label">
                TALHÃO
              </span>

              <strong>
                {plot?.name ||
                  "Não informado"}
              </strong>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              🌾
            </div>

            <div className="detail-content">
              <span className="detail-label">
                CULTURA
              </span>

              <strong>
                {plot?.culture ||
                  "Não informado"}
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
              🛠️
            </div>

            <div>
              <h3>Manejo</h3>

              <p>
                Informações sobre o manejo realizado
              </p>
            </div>

          </div>

          <div className="details-grid">

            {activity.managementType && (
              <div className="detail-item">

                <div className="detail-icon">
                  🛠️
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    TIPO DE MANEJO
                  </span>

                  <strong>
                    {activity.managementType}
                  </strong>

                </div>
              </div>
            )}

            {activity.managementStatus && (
              <div className="detail-item">

                <div className="detail-icon">
                  📊
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    STATUS
                  </span>

                  <strong
                    className={`status-${normalizeStatus(
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
              ⚠️
            </div>

            <div>
              <h3>Ocorrências</h3>

              <p>
                Pragas e doenças identificadas
              </p>
            </div>

          </div>

          <div className="details-grid">

            {activity.pest && (
              <div className="detail-item">

                <div className="detail-icon">
                  🐛
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    PRAGA
                  </span>

                  <strong>
                    {activity.pest}
                  </strong>

                </div>
              </div>
            )}

            {activity.disease && (
              <div className="detail-item">

                <div className="detail-icon">
                  🦠
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    DOENÇA
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
          PRODUTO / ESTOQUE
      ===================================================== */}

      {hasProduct ? (

        <section className="details-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🧴
            </div>

            <div>
              <h3>
                Produto utilizado
              </h3>

              <p>
                Produto retirado do estoque
                para este registro
              </p>
            </div>

          </div>

          <div className="details-grid">

            {/* PRODUTO */}

            <div className="detail-item">

              <div className="detail-icon">
                🧴
              </div>

              <div className="detail-content">

                <span className="detail-label">
                  PRODUTO
                </span>

                <strong>
                  {productData?.name ||
                    activity.product ||
                    "Não informado"}
                </strong>

              </div>

            </div>

            {/* QUANTIDADE */}

            <div className="detail-item">

              <div className="detail-icon">
                ⚖️
              </div>

              <div className="detail-content">

                <span className="detail-label">
                  QUANTIDADE UTILIZADA
                </span>

                <strong>
                  {getProductQuantity()}
                </strong>

              </div>

            </div>

            {/* UNIDADE */}

            {productData?.unit && (
              <div className="detail-item">

                <div className="detail-icon">
                  📏
                </div>

                <div className="detail-content">

                  <span className="detail-label">
                    UNIDADE
                  </span>

                  <strong>
                    {productData.unit}
                  </strong>

                </div>

              </div>
            )}

            {/* ESTOQUE */}

            <div className="detail-item">

              <div className="detail-icon">
                📦
              </div>

              <div className="detail-content">

                <span className="detail-label">
                  ESTOQUE
                </span>

                <strong>
                  Retirado do estoque
                </strong>

              </div>

            </div>

          </div>

          {/* AVISO DO MOVIMENTO */}

          <div
            style={{
              marginTop: "18px",
              padding: "14px 16px",
              borderRadius: "10px",
              background: "#f4f8f4",
              border: "1px solid #dce9dc",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <span
              style={{
                fontSize: "20px",
              }}
            >
              📦
            </span>

            <span
              style={{
                fontSize: "14px",
                lineHeight: "1.4",
              }}
            >
              <strong>
                Movimentação de estoque registrada.
              </strong>
              <br />

              A quantidade utilizada nesta atividade
              foi descontada do estoque do produto.
            </span>

          </div>

        </section>

      ) : (

        /* =====================================================
           SEM PRODUTO
        ===================================================== */

        <section className="details-card">

          <div className="card-heading">

            <div className="card-heading-icon">
              🧴
            </div>

            <div>
              <h3>
                Produto utilizado
              </h3>

              <p>
                Controle de consumo de produtos
              </p>
            </div>

          </div>

          <div
            style={{
              padding: "18px",
              borderRadius: "10px",
              background: "#f7f7f7",
              border: "1px solid #e5e5e5",
              color: "#666",
            }}
          >
            Nenhum produto foi utilizado
            neste registro.
          </div>

        </section>
      )}

      {/* =====================================================
          DESCRIÇÃO
      ===================================================== */}

      <section className="details-card">

        <div className="card-heading">

          <div className="card-heading-icon">
            📝
          </div>

          <div>
            <h3>Observações</h3>

            <p>
              Informações adicionais do registro
            </p>
          </div>

        </div>

        <div className="detail-description">

          <div className="description-heading">

            <div className="description-icon">
              📝
            </div>

          </div>

          <div className="description-content">

            {activity.description ? (

              <p>
                {activity.description}
              </p>

            ) : (

              <span className="description-empty">
                Nenhuma observação foi adicionada
                a este registro.
              </span>

            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          FOTOS
      ===================================================== */}

      {photoUrls.length > 0 && (

        <section className="details-card photos-details">

          <div className="photos-heading">

            <div className="card-heading">

              <div className="card-heading-icon">
                📷
              </div>

              <div>
                <h3>
                  Fotos do registro
                </h3>

                <p>
                  Imagens anexadas à atividade
                </p>
              </div>

            </div>

            <span className="photos-count">

              {photoUrls.length}{" "}

              {photoUrls.length === 1
                ? "foto"
                : "fotos"}

            </span>

          </div>

          <div className="details-photo-grid">

            {photoUrls.map((photo, index) => (

              <button
                type="button"
                className="details-photo"
                key={photo.id || index}
                onClick={() => openPhoto(index)}
                aria-label={`Abrir foto ${
                  index + 1
                }`}
              >

                <img
                  src={photo.url}
                  alt={
                    photo.name ||
                    `Foto ${index + 1}`
                  }
                />

                <span className="photo-card-icon">
                  🔍
                </span>

              </button>

            ))}

          </div>

        </section>
      )}

      {/* =====================================================
          AÇÕES
      ===================================================== */}

      <div className="details-actions">

        <button
          type="button"
          className="details-back-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <button
          type="button"
          className="details-edit-button"
          onClick={() => onEdit(activity)}
        >
          ✎ Editar registro
        </button>

      </div>

      {/* =====================================================
          LIGHTBOX / FOTO AMPLIADA
      ===================================================== */}

      {selectedPhoto && (

        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Visualização da foto"
          onClick={closePhoto}
        >

          <button
            type="button"
            className="photo-lightbox-close"
            onClick={closePhoto}
            aria-label="Fechar visualização"
          >
            ×
          </button>

          {photoUrls.length > 1 && (

            <button
              type="button"
              className="photo-lightbox-nav photo-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                previousPhoto();
              }}
              aria-label="Foto anterior"
            >
              ‹
            </button>

          )}

          <div
            className="photo-lightbox-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <img
              className="photo-lightbox-image"
              src={selectedPhoto.url}
              alt={
                selectedPhoto.name ||
                `Foto ${
                  selectedPhotoIndex + 1
                }`
              }
            />

            <div className="photo-lightbox-footer">

              <span className="photo-lightbox-counter">
                {selectedPhotoIndex + 1} /{" "}
                {photoUrls.length}
              </span>

              {selectedPhoto.name && (

                <span className="photo-lightbox-name">
                  {selectedPhoto.name}
                </span>

              )}

            </div>

          </div>

          {photoUrls.length > 1 && (

            <button
              type="button"
              className="photo-lightbox-nav photo-lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                nextPhoto();
              }}
              aria-label="Próxima foto"
            >
              ›
            </button>

          )}

        </div>

      )}

    </main>
  );
}

export default ActivityDetails;