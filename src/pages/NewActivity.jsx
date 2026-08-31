<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
import { useEffect, useState } from "react";

import {
  createActivity,
  updateActivity,
} from "../services/activityService";

import { addPhoto } from "../services/photoService";
import { getProperties } from "../services/propertyService";
import { getPlotsByProperty } from "../services/plotService";

<<<<<<< HEAD
import { getProducts } from "../services/productService";
import { getPests } from "../services/pestService";
import { getDiseases } from "../services/diseaseService";

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
  const [propertyId, setPropertyId] = useState("");
  const [plotId, setPlotId] = useState("");

  const [properties, setProperties] = useState([]);
  const [plots, setPlots] = useState([]);

  const [managementType, setManagementType] = useState("");
  const [managementStatus, setManagementStatus] = useState("");

  const [pest, setPest] = useState("");
  const [disease, setDisease] = useState("");

  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");

  const [products, setProducts] = useState([]);
  const [pests, setPests] = useState([]);
  const [diseases, setDiseases] = useState([]);
=======
  const [properties, setProperties] = useState([]);
  const [plots, setPlots] = useState([]);

  const [propertyId, setPropertyId] = useState("");
  const [plotId, setPlotId] = useState("");
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

  const [photos, setPhotos] = useState([]);

  /* =========================================================
<<<<<<< HEAD
     CARREGAR BIBLIOTECA
  ========================================================= */

  useEffect(() => {
    async function loadLibrary() {
      try {
        const [
          productsData,
          pestsData,
          diseasesData,
        ] = await Promise.all([
          getProducts(),
          getPests(),
          getDiseases(),
        ]);

        setProducts(
          Array.isArray(productsData)
            ? productsData
            : []
        );

        setPests(
          Array.isArray(pestsData)
            ? pestsData
            : []
        );

        setDiseases(
          Array.isArray(diseasesData)
            ? diseasesData
            : []
        );
      } catch (error) {
        console.error(
          "ERRO AO CARREGAR BIBLIOTECA:",
          error
        );

        setProducts([]);
        setPests([]);
        setDiseases([]);
      }
    }

    loadLibrary();
  }, []);

  /* =========================================================
=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
     CARREGAR PROPRIEDADES
  ========================================================= */

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();

<<<<<<< HEAD
        setProperties(
          Array.isArray(data)
            ? data
            : []
        );
=======
        setProperties(data || []);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
        setPlots(
          Array.isArray(data)
            ? data
            : []
        );
=======
        setPlots(data || []);
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
      setDescription(activityToEdit.description || "");
=======
      setDescription(
        activityToEdit.description || ""
      );
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

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

<<<<<<< HEAD
      setManagementType(
        activityToEdit.managementType || ""
      );

      setManagementStatus(
        activityToEdit.managementStatus || ""
      );

      setPest(
        activityToEdit.pest || ""
      );

      setDisease(
        activityToEdit.disease || ""
      );

      setProduct(
        activityToEdit.product || ""
      );

      setQuantity(
        activityToEdit.quantity || ""
      );

      /*
       * As fotos antigas continuam vinculadas
       * à atividade.
       *
       * Aqui entram somente novas fotos.
       */

=======
      /*
       * Fotos já salvas permanecem vinculadas
       * à atividade e serão exibidas na tela
       * de detalhes.
       *
       * Aqui entram somente novas fotos.
       */
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
      setPhotos([]);
    } else {
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");
<<<<<<< HEAD

      setPropertyId("");
      setPlotId("");

      setManagementType("");
      setManagementStatus("");

      setPest("");
      setDisease("");

      setProduct("");
      setQuantity("");

=======
      setPropertyId("");
      setPlotId("");
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD

      managementType:
        managementType.trim(),

      managementStatus,

      pest: pest.trim(),

      disease: disease.trim(),

      product: product.trim(),

      quantity: quantity.trim(),
=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
     RENDER
=======
     TELA
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
  ========================================================= */

  return (
    <main className="new-activity">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <header className="page-heading">
<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
      </header>

=======

      </header>


>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
          </div>

        </section>

        {/* ===================================================
            MANEJO
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              🔧
            </div>

            <div>
              <h3>
                Manejo
              </h3>

              <p>
                Informe o tipo e o andamento do manejo.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* TIPO DE MANEJO */}

            <div className="form-group">

              <label htmlFor="managementType">
                Tipo de manejo
              </label>

              <input
                id="managementType"
                type="text"
                placeholder="Ex.: Adubação"
                value={managementType}
                onChange={(event) =>
                  setManagementType(
                    event.target.value
                  )
                }
              />

            </div>

            {/* STATUS */}

            <div className="form-group">

              <label htmlFor="managementStatus">
                Status
              </label>

              <select
                id="managementStatus"
                value={managementStatus}
                onChange={(event) =>
                  setManagementStatus(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Selecione o status
                </option>

                <option value="Planejado">
                  Planejado
                </option>

                <option value="Em andamento">
                  Em andamento
                </option>

                <option value="Concluído">
                  Concluído
                </option>

              </select>

            </div>

          </div>

        </section>

        {/* ===================================================
            OCORRÊNCIAS
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              🔎
            </div>

            <div>
              <h3>
                Ocorrências
              </h3>

              <p>
                Registre pragas ou doenças observadas.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* PRAGA */}

            <div className="form-group">

              <label htmlFor="pest">
                Praga
              </label>

              <select
                id="pest"
                value={pest}
                onChange={(event) =>
                  setPest(event.target.value)
                }
              >

                <option value="">
                  Selecione uma praga
                </option>

                {pests.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

            {/* DOENÇA */}

            <div className="form-group">

              <label htmlFor="disease">
                Doença
              </label>

              <select
                id="disease"
                value={disease}
                onChange={(event) =>
                  setDisease(event.target.value)
                }
              >

                <option value="">
                  Selecione uma doença
                </option>

                {diseases.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

          </div>

        </section>

        {/* ===================================================
            PRODUTO
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              🧪
            </div>

            <div>
              <h3>
                Produto utilizado
              </h3>

              <p>
                Registre o produto e a quantidade utilizada.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* PRODUTO */}

            <div className="form-group">

              <label htmlFor="product">
                Produto
              </label>

              <select
                id="product"
                value={product}
                onChange={(event) =>
                  setProduct(event.target.value)
                }
              >

                <option value="">
                  Selecione um produto
                </option>

                {products.map((item) => (
                  <option
                    key={item.id}
                    value={item.name}
                  >
                    {item.name}
                  </option>
                ))}

              </select>

            </div>

            {/* QUANTIDADE */}

            <div className="form-group">

              <label htmlFor="quantity">
                Quantidade
              </label>

              <input
                id="quantity"
                type="text"
                placeholder="Ex.: 20 kg"
                value={quantity}
                onChange={(event) =>
                  setQuantity(event.target.value)
                }
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            DESCRIÇÃO
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              📝
            </div>

            <div>
              <h3>
                Observações
              </h3>

              <p>
                Descreva o que foi realizado ou observado.
              </p>
            </div>

          </div>

          <div className="form-grid">
=======

            {/* DESCRIÇÃO */}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
        {/* ===================================================
            FOTOS
        =================================================== */}

        <section className="form-section photos-form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              📷
            </div>

            <div>
<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
              <h3>
                Fotos da atividade
              </h3>

              <p>
                Registre visualmente o que foi observado no campo.
              </p>
<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
            </div>

          </div>

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          <input
            id="activity-photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="photo-input"
          />

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
              <div className="photo-preview-grid">

                {photos.map(
                  (photo, index) => {

                    const previewUrl =
                      URL.createObjectURL(
                        photo
                      );

                    return (
<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
                    );
                  }
                )}

              </div>

            </div>

          )}

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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

<<<<<<< HEAD
=======

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          <button
            type="submit"
            className="primary-button"
          >
<<<<<<< HEAD
            {activityToEdit
              ? "Salvar alterações"
              : "Salvar atividade"}
=======

            {activityToEdit
              ? "Salvar alterações"
              : "Salvar atividade"}

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
          </button>

        </div>

      </form>

    </main>
  );
}

<<<<<<< HEAD
export default NewActivity;
=======
export default NewActivity;
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
