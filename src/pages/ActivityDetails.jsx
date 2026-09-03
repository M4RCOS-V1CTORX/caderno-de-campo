import { useEffect, useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Bug,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Image as ImageIcon,
  Layers3,
  Leaf,
  MapPin,
  Mountain,
  Package,
  Pencil,
  Ruler,
  Scale,
  Sprout,
  Wrench,
  X,
} from "lucide-react";

import { getPropertyById } from "../services/propertyService";
import { getPlotById } from "../services/plotService";
import { getPhotosByActivity } from "../services/photoService";
import {
  getProductById,
} from "../services/productService";
import { getCultures } from "../services/cultureService";

import "../styles/activityDetails.css";

function ActivityDetails({ activity, onBack, onEdit }) {
  const [property, setProperty] = useState(null);
  const [plot, setPlot] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [photoUrls, setPhotoUrls] = useState([]);
  const [productData, setProductData] = useState(null);
  const [cultureData, setCultureData] = useState(null);

  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadDetails() {
      try {
        if (activity?.propertyId) {
          const propertyResult = await getPropertyById(
            activity.propertyId
          );

          if (mounted) {
            setProperty(propertyResult || null);
          }
        } else {
          setProperty(null);
        }

        if (activity?.plotId) {
          const plotResult = await getPlotById(activity.plotId);

          if (mounted) {
            setPlot(plotResult || null);
          }
        } else {
          setPlot(null);
        }

        if (activity?.id) {
          const photosResult = await getPhotosByActivity(
            activity.id
          );

          if (mounted) {
            setPhotos(photosResult || []);
          }
        } else {
          setPhotos([]);
        }

        if (activity?.productId) {
          const productResult = await getProductById(
            activity.productId
          );

          if (mounted) {
            setProductData(productResult || null);
          }
        } else {
          setProductData(null);
        }

        const culturesResult = await getCultures();

        if (mounted && Array.isArray(culturesResult)) {
          const cultureName =
            activity?.selectedCulture ||
            activity?.culture ||
            plot?.culture;

          if (cultureName) {
            const foundCulture = culturesResult.find(
              (culture) =>
                String(culture.name || "")
                  .trim()
                  .toLowerCase() ===
                String(cultureName)
                  .trim()
                  .toLowerCase()
            );

            setCultureData(foundCulture || null);
          } else {
            setCultureData(null);
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
      mounted = false;
    };
  }, [activity]);

  useEffect(() => {
    let mounted = true;
    const urls = [];

    async function createPhotoUrls() {
      try {
        for (const photo of photos) {
          if (!photo?.file) continue;

          const url = URL.createObjectURL(photo.file);
          urls.push(url);
        }

        if (mounted) {
          setPhotoUrls(urls);
        }
      } catch (error) {
        console.error("ERRO AO CARREGAR FOTOS:", error);

        if (mounted) {
          setPhotoUrls([]);
        }
      }
    }

    createPhotoUrls();

    return () => {
      mounted = false;

      urls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [photos]);

  useEffect(() => {
    function handleKeyDown(event) {
      if (!selectedPhoto) return;

      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }

      if (event.key === "ArrowLeft") {
        handlePreviousPhoto();
      }

      if (event.key === "ArrowRight") {
        handleNextPhoto();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  function formatDate(date) {
    if (!date) return "Não informado";

    try {
      const parsedDate = new Date(date);

      if (Number.isNaN(parsedDate.getTime())) {
        return "Não informado";
      }

      return parsedDate.toLocaleDateString("pt-BR");
    } catch {
      return "Não informado";
    }
  }

  function normalizeStatus(status) {
    if (!status) return "Não informado";

    const normalized = String(status)
      .trim()
      .toLowerCase();

    if (
      normalized === "concluida" ||
      normalized === "concluído" ||
      normalized === "concluida"
    ) {
      return "Concluído";
    }

    if (
      normalized === "em andamento" ||
      normalized === "andamento" ||
      normalized === "in progress"
    ) {
      return "Em andamento";
    }

    if (
      normalized === "planejada" ||
      normalized === "planejado" ||
      normalized === "planned"
    ) {
      return "Planejado";
    }

    return status;
  }

  function getProductQuantity() {
    if (!activity) {
      return "Não informado";
    }

    if (
      activity.quantityValue !== undefined &&
      activity.quantityValue !== null &&
      activity.quantityValue !== ""
    ) {
      const unit = productData?.unit
        ? ` ${productData.unit}`
        : "";

      return `${activity.quantityValue}${unit}`;
    }

    if (
      activity.quantity !== undefined &&
      activity.quantity !== null &&
      activity.quantity !== ""
    ) {
      return String(activity.quantity);
    }

    return "Não informado";
  }

  function getCultureName() {
    return (
      activity?.selectedCulture ||
      activity?.culture ||
      plot?.culture ||
      cultureData?.name ||
      "Não informado"
    );
  }

  function getCultureVariety() {
    return (
      cultureData?.variety ||
      cultureData?.variedade ||
      activity?.variety ||
      "Não informado"
    );
  }

  function getCultureCycle() {
    return (
      cultureData?.cycle ||
      cultureData?.ciclo ||
      activity?.cycle ||
      "Não informado"
    );
  }

  function getPlotArea() {
    return (
      plot?.area ||
      activity?.area ||
      "Não informado"
    );
  }

  function getPlotSoil() {
    return (
      plot?.soil ||
      plot?.soilType ||
      activity?.soil ||
      "Não informado"
    );
  }

  function hasProduct() {
    return Boolean(
      activity?.productId ||
        activity?.product ||
        productData
    );
  }

  function openPhoto(index) {
    if (!photoUrls[index]) return;

    setSelectedPhoto(index);
  }

  function closePhoto() {
    setSelectedPhoto(null);
  }

  function handlePreviousPhoto() {
    if (photoUrls.length === 0 || selectedPhoto === null) {
      return;
    }

    setSelectedPhoto((current) => {
      if (current === 0) {
        return photoUrls.length - 1;
      }

      return current - 1;
    });
  }

  function handleNextPhoto() {
    if (photoUrls.length === 0 || selectedPhoto === null) {
      return;
    }

    setSelectedPhoto((current) => {
      if (current === photoUrls.length - 1) {
        return 0;
      }

      return current + 1;
    });
  }

  if (!activity) {
    return (
      <main className="activity-details">
        <div className="details-empty">
          <div className="details-empty-icon">
            <FileText size={26} />
          </div>

          <h2>Registro não encontrado</h2>

          <p>
            Não foi possível carregar os dados deste
            registro.
          </p>

          <button
            type="button"
            className="details-primary-button"
            onClick={onBack}
          >
            <ArrowLeft size={17} />
            Voltar
          </button>
        </div>
      </main>
    );
  }

  const status = normalizeStatus(activity.managementStatus);

  return (
    <main className="activity-details">
      <button
        type="button"
        className="details-back-button"
        onClick={onBack}
      >
        <ArrowLeft size={17} />
        Voltar para atividades
      </button>

      <section className="details-hero">
        <div className="details-hero-glow" />

        <div className="details-hero-content">
          <div className="details-eyebrow">
            <FileText size={14} />
            REGISTRO DE CAMPO
          </div>

          <h1>
            {activity.title || "Registro sem título"}
          </h1>

          <p>
            {activity.description ||
              "Detalhamento das informações registradas no campo."}
          </p>

          <div className="details-hero-meta">
            <span>
              <CalendarDays size={15} />
              {formatDate(activity.date)}
            </span>

            <span>
              <MapPin size={15} />
              {activity.location || "Local não informado"}
            </span>
          </div>
        </div>

        <div className="details-hero-side">
          <div className="details-status">
            <span className="details-status-dot" />
            <div>
              <small>STATUS DO REGISTRO</small>
              <strong>Registro salvo</strong>
            </div>
          </div>

          <div className="details-responsible">
            <span>RESPONSÁVEL TÉCNICA</span>
            <strong>Laís L. Andrade</strong>
          </div>
        </div>
      </section>

      <section className="details-summary">
        <div className="summary-item">
          <div className="summary-icon">
            <CalendarDays size={18} />
          </div>

          <div>
            <span>Data do registro</span>
            <strong>{formatDate(activity.date)}</strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">
            <MapPin size={18} />
          </div>

          <div>
            <span>Local</span>
            <strong>
              {activity.location || "Não informado"}
            </strong>
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-icon">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <span>Status</span>
            <strong>{status}</strong>
          </div>
        </div>
      </section>

      <div className="details-layout">
        <section className="details-card details-card-wide">
          <div className="details-card-header">
            <div className="details-card-title">
              <div className="details-card-icon">
                <Mountain size={18} />
              </div>

              <div>
                <span>INFORMAÇÕES DO CAMPO</span>
                <h2>Localização e cultura</h2>
              </div>
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-item-icon">
                <Building2 size={17} />
              </div>

              <div>
                <span>Propriedade</span>
                <strong>
                  {property?.name || "Não informado"}
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <Mountain size={17} />
              </div>

              <div>
                <span>Talhão</span>
                <strong>
                  {plot?.name || "Não informado"}
                </strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <Sprout size={17} />
              </div>

              <div>
                <span>Cultura</span>
                <strong>{getCultureName()}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <Leaf size={17} />
              </div>

              <div>
                <span>Variedade</span>
                <strong>{getCultureVariety()}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <Clock3 size={17} />
              </div>

              <div>
                <span>Ciclo</span>
                <strong>{getCultureCycle()}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <Ruler size={17} />
              </div>

              <div>
                <span>Área</span>
                <strong>{getPlotArea()}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <Layers3 size={17} />
              </div>

              <div>
                <span>Solo</span>
                <strong>{getPlotSoil()}</strong>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-item-icon">
                <MapPin size={17} />
              </div>

              <div>
                <span>Local do registro</span>
                <strong>
                  {activity.location || "Não informado"}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section className="details-card">
          <div className="details-card-header">
            <div className="details-card-title">
              <div className="details-card-icon">
                <Wrench size={18} />
              </div>

              <div>
                <span>MANEJO</span>
                <h2>Informações do manejo</h2>
              </div>
            </div>
          </div>

          <div className="details-list">
            <div className="details-list-row">
              <span>Tipo de manejo</span>
              <strong>
                {activity.managementType ||
                  "Não informado"}
              </strong>
            </div>

            <div className="details-list-row">
              <span>Status</span>
              <strong className="status-value">
                {status}
              </strong>
            </div>

            <div className="details-list-row">
              <span>Data planejada</span>
              <strong>
                {formatDate(activity.plannedDate)}
              </strong>
            </div>

            <div className="details-list-row">
              <span>Data de conclusão</span>
              <strong>
                {formatDate(activity.completedDate)}
              </strong>
            </div>
          </div>
        </section>

        <section className="details-card">
          <div className="details-card-header">
            <div className="details-card-title">
              <div className="details-card-icon">
                <Bug size={18} />
              </div>

              <div>
                <span>OCORRÊNCIAS</span>
                <h2>Pragas e doenças</h2>
              </div>
            </div>
          </div>

          <div className="details-list">
            <div className="details-list-row">
              <span>Praga identificada</span>
              <strong>
                {activity.pest || "Nenhuma informada"}
              </strong>
            </div>

            <div className="details-list-row">
              <span>Doença identificada</span>
              <strong>
                {activity.disease ||
                  "Nenhuma informada"}
              </strong>
            </div>
          </div>
        </section>

        <section className="details-card">
          <div className="details-card-header">
            <div className="details-card-title">
              <div className="details-card-icon">
                <Package size={18} />
              </div>

              <div>
                <span>INSUMO</span>
                <h2>Produto utilizado</h2>
              </div>
            </div>
          </div>

          {hasProduct() ? (
            <div className="product-detail">
              <div className="product-main">
                <div className="product-icon">
                  <Package size={20} />
                </div>

                <div>
                  <span>PRODUTO</span>
                  <strong>
                    {productData?.name ||
                      activity.product ||
                      "Produto informado"}
                  </strong>
                </div>
              </div>

              <div className="product-quantity">
                <Scale size={17} />

                <div>
                  <span>QUANTIDADE</span>
                  <strong>{getProductQuantity()}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div className="details-no-data">
              <Package size={20} />
              <span>
                Nenhum produto foi associado a este
                registro.
              </span>
            </div>
          )}
        </section>

        <section className="details-card details-card-wide">
          <div className="details-card-header">
            <div className="details-card-title">
              <div className="details-card-icon">
                <FileText size={18} />
              </div>

              <div>
                <span>REGISTRO</span>
                <h2>Observações</h2>
              </div>
            </div>
          </div>

          <div className="details-description">
            {activity.description ? (
              <p>{activity.description}</p>
            ) : (
              <div className="details-no-data">
                <FileText size={20} />
                <span>
                  Nenhuma observação foi adicionada a este
                  registro.
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="details-card details-card-wide">
          <div className="details-card-header">
            <div className="details-card-title">
              <div className="details-card-icon">
                <Camera size={18} />
              </div>

              <div>
                <span>REGISTRO VISUAL</span>
                <h2>Fotos do campo</h2>
              </div>
            </div>

            <span className="photo-count">
              {photoUrls.length}{" "}
              {photoUrls.length === 1
                ? "foto"
                : "fotos"}
            </span>
          </div>

          {photoUrls.length > 0 ? (
            <div className="details-photo-grid">
              {photoUrls.map((url, index) => (
                <button
                  type="button"
                  className="details-photo"
                  key={`${url}-${index}`}
                  onClick={() => openPhoto(index)}
                >
                  <img
                    src={url}
                    alt={`Foto do registro ${index + 1}`}
                  />

                  <span className="photo-overlay">
                    <ImageIcon size={20} />
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="details-no-photos">
              <div className="details-no-photos-icon">
                <Camera size={24} />
              </div>

              <div>
                <strong>Nenhuma foto registrada</strong>
                <span>
                  As fotos adicionadas ao registro aparecerão
                  nesta seção.
                </span>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="details-actions">
        <button
          type="button"
          className="details-secondary-button"
          onClick={onBack}
        >
          <ArrowLeft size={17} />
          Voltar
        </button>

        <button
          type="button"
          className="details-primary-button"
          onClick={() => onEdit(activity)}
        >
          <Pencil size={17} />
          Editar registro
          <ArrowRight size={16} />
        </button>
      </div>

      <footer className="details-footer">
        <div>
          <strong>CADERNO DE CAMPO</strong>
          <span>Gestão agrícola inteligente</span>
        </div>

        <div className="details-footer-responsible">
          <span>RESPONSÁVEL TÉCNICA</span>
          <strong>Laís L. Andrade</strong>
        </div>
      </footer>

      {selectedPhoto !== null &&
        photoUrls[selectedPhoto] && (
          <div
            className="photo-lightbox"
            onClick={closePhoto}
            role="dialog"
            aria-modal="true"
            aria-label="Visualização da foto"
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={closePhoto}
              aria-label="Fechar"
            >
              <X size={22} />
            </button>

            {photoUrls.length > 1 && (
              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                onClick={(event) => {
                  event.stopPropagation();
                  handlePreviousPhoto();
                }}
                aria-label="Foto anterior"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            <div
              className="lightbox-content"
              onClick={(event) => event.stopPropagation()}
            >
              <img
                src={photoUrls[selectedPhoto]}
                alt={`Foto ${selectedPhoto + 1} do registro`}
              />

              <div className="lightbox-counter">
                {selectedPhoto + 1} / {photoUrls.length}
              </div>
            </div>

            {photoUrls.length > 1 && (
              <button
                type="button"
                className="lightbox-nav lightbox-next"
                onClick={(event) => {
                  event.stopPropagation();
                  handleNextPhoto();
                }}
                aria-label="Próxima foto"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>
        )}
    </main>
  );
}

export default ActivityDetails;