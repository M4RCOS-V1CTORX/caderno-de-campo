import { useEffect, useState } from "react";

import {
  createActivity,
  updateActivity,
} from "../services/activityService";

import { addPhoto } from "../services/photoService";

import { getProperties } from "../services/propertyService";

import { getPlotsByProperty } from "../services/plotService";

import {
  getProducts,
  getProductById,
  addStock,
  removeStock,
} from "../services/productService";

import { getPests } from "../services/pestService";

import { getDiseases } from "../services/diseaseService";

import "../styles/newActivity.css";

function NewActivity({
  onCancel,
  onActivityCreated,
  activityToEdit,
}) {
  /* =========================================================
     ESTADOS PRINCIPAIS
  ========================================================= */

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const [propertyId, setPropertyId] = useState("");
  const [plotId, setPlotId] = useState("");

  const [properties, setProperties] = useState([]);
  const [plots, setPlots] = useState([]);

  /* =========================================================
     MANEJO
  ========================================================= */

  const [managementType, setManagementType] =
    useState("");

  const [managementStatus, setManagementStatus] =
    useState("");

  /* =========================================================
     OCORRÊNCIAS
  ========================================================= */

  const [pest, setPest] = useState("");
  const [disease, setDisease] = useState("");

  /* =========================================================
     PRODUTOS / ESTOQUE
  ========================================================= */

  const [product, setProduct] = useState("");
  const [productId, setProductId] = useState("");

  const [quantity, setQuantity] = useState("");
  const [quantityValue, setQuantityValue] =
    useState("");

  const [products, setProducts] = useState([]);

  const [pests, setPests] = useState([]);
  const [diseases, setDiseases] = useState([]);

  /* =========================================================
     FOTOS
  ========================================================= */

  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] =
    useState([]);

  /* =========================================================
     CONTROLE DE SALVAMENTO
  ========================================================= */

  const [saving, setSaving] = useState(false);

  /* =========================================================
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
     CARREGAR PROPRIEDADES
  ========================================================= */

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();

        setProperties(
          Array.isArray(data)
            ? data
            : []
        );
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
        const data =
          await getPlotsByProperty(
            Number(propertyId)
          );

        setPlots(
          Array.isArray(data)
            ? data
            : []
        );
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
      setTitle(
        activityToEdit.title || ""
      );

      setDate(
        activityToEdit.date || ""
      );

      setLocation(
        activityToEdit.location || ""
      );

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

      setProductId(
        activityToEdit.productId
          ? String(activityToEdit.productId)
          : ""
      );

      setQuantity(
        activityToEdit.quantity || ""
      );

      setQuantityValue(
        activityToEdit.quantityValue !==
          undefined &&
          activityToEdit.quantityValue !== null
          ? String(
              activityToEdit.quantityValue
            )
          : ""
      );

      setPhotos([]);
    } else {
      setTitle("");
      setDate("");
      setLocation("");
      setDescription("");

      setPropertyId("");
      setPlotId("");

      setManagementType("");
      setManagementStatus("");

      setPest("");
      setDisease("");

      setProduct("");
      setProductId("");

      setQuantity("");
      setQuantityValue("");

      setPhotos([]);
    }
  }, [activityToEdit]);

  /* =========================================================
     COMPATIBILIDADE COM DIÁRIOS ANTIGOS
  ========================================================= */

  useEffect(() => {
    if (!activityToEdit) {
      return;
    }

    if (
      !productId &&
      activityToEdit.product &&
      products.length > 0
    ) {
      const matchingProduct =
        products.find(
          (item) =>
            String(item.name)
              .trim()
              .toLowerCase() ===
            String(
              activityToEdit.product
            )
              .trim()
              .toLowerCase()
        );

      if (matchingProduct) {
        setProductId(
          String(matchingProduct.id)
        );
      }
    }
  }, [
    activityToEdit,
    products,
    productId,
  ]);

  /* =========================================================
     CRIAR PRÉ-VISUALIZAÇÕES DAS FOTOS
  ========================================================= */

  useEffect(() => {
    const previews = photos.map(
      (photo) => ({
        file: photo,
        url: URL.createObjectURL(photo),
      })
    );

    setPhotoPreviews(previews);

    return () => {
      previews.forEach(
        (preview) => {
          URL.revokeObjectURL(
            preview.url
          );
        }
      );
    };
  }, [photos]);

  /* =========================================================
     PROPRIEDADE
  ========================================================= */

  function handlePropertyChange(event) {
    const value =
      event.target.value;

    setPropertyId(value);

    setPlotId("");
  }

  /* =========================================================
     PRODUTO
  ========================================================= */

  function handleProductChange(event) {
    const selectedId =
      event.target.value;

    setProductId(selectedId);

    if (!selectedId) {
      setProduct("");
      setQuantity("");
      setQuantityValue("");
      return;
    }

    const selectedProduct =
      products.find(
        (item) =>
          String(item.id) ===
          String(selectedId)
      );

    if (!selectedProduct) {
      setProduct("");
      return;
    }

    setProduct(
      selectedProduct.name
    );
  }

  function handleQuantityChange(event) {
    const value =
      event.target.value;

    setQuantityValue(value);

    const selectedProduct =
      products.find(
        (item) =>
          String(item.id) ===
          String(productId)
      );

    if (
      selectedProduct &&
      value !== ""
    ) {
      setQuantity(
        `${value} ${
          selectedProduct.unit || ""
        }`.trim()
      );
    } else {
      setQuantity(value);
    }
  }

  /* =========================================================
     FOTOS
  ========================================================= */

  function handlePhotoChange(event) {
    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    if (
      selectedFiles.length === 0
    ) {
      return;
    }

    setPhotos(
      (currentPhotos) => [
        ...currentPhotos,
        ...selectedFiles,
      ]
    );

    event.target.value = "";
  }

  function removePhoto(index) {
    setPhotos(
      (currentPhotos) =>
        currentPhotos.filter(
          (_, photoIndex) =>
            photoIndex !== index
        )
    );
  }

  /* =========================================================
     VERIFICAR ESTOQUE
  ========================================================= */

  async function validateStockForNewActivity() {
    if (!productId) {
      return null;
    }

    const amount =
      Number(quantityValue);

    if (!amount || amount <= 0) {
      throw new Error(
        "Informe uma quantidade válida para o produto."
      );
    }

    const selectedProduct =
      await getProductById(
        productId
      );

    if (!selectedProduct) {
      throw new Error(
        "O produto selecionado não foi encontrado no estoque."
      );
    }

    const currentStock =
      Number(
        selectedProduct.stock
      ) || 0;

    if (amount > currentStock) {
      throw new Error(
        `Estoque insuficiente para "${selectedProduct.name}". Disponível: ${currentStock} ${selectedProduct.unit || ""}.`
      );
    }

    return selectedProduct;
  }

  /* =========================================================
     PRODUTO SELECIONADO
  ========================================================= */

  const selectedProduct =
    products.find(
      (item) =>
        String(item.id) ===
        String(productId)
    );

  /* =========================================================
     PROPRIEDADE SELECIONADA
  ========================================================= */

  const selectedProperty =
    properties.find(
      (item) =>
        String(item.id) ===
        String(propertyId)
    );

  /* =========================================================
     TALHÃO SELECIONADO
  ========================================================= */

  const selectedPlot =
    plots.find(
      (item) =>
        String(item.id) ===
        String(plotId)
    );

  /* =========================================================
     INFORMAÇÕES DA ORIGEM DO ESTOQUE
  ========================================================= */

  function getStockMetadata() {
    return {
      source: "diario",

      activityId:
        activityToEdit?.id || null,

      activityTitle:
        title?.trim() || "",

      propertyId:
        propertyId
          ? Number(propertyId)
          : null,

      propertyName:
        selectedProperty?.name || "",

      plotId:
        plotId
          ? Number(plotId)
          : null,

      plotName:
        selectedPlot?.name || "",
    };
  }

  /* =========================================================
     AJUSTAR ESTOQUE NA EDIÇÃO
  ========================================================= */

  async function adjustStockForEdit() {
    /*
      Se o registro antigo não possui
      productId ou quantityValue,
      não fazemos ajuste retroativo.
    */

    if (
      !activityToEdit ||
      !activityToEdit.productId ||
      activityToEdit.quantityValue ===
        undefined ||
      activityToEdit.quantityValue ===
        null
    ) {
      /*
        Se o usuário adicionou um produto
        novo a um registro antigo,
        tratamos como nova saída.
      */

      if (productId) {
        const newAmount =
          Number(quantityValue);

        if (
          !newAmount ||
          newAmount <= 0
        ) {
          throw new Error(
            "Informe uma quantidade válida para o produto."
          );
        }

        const newProduct =
          await getProductById(
            productId
          );

        if (!newProduct) {
          throw new Error(
            "Produto selecionado não encontrado."
          );
        }

        const currentStock =
          Number(
            newProduct.stock
          ) || 0;

        if (
          newAmount >
          currentStock
        ) {
          throw new Error(
            `Estoque insuficiente para "${newProduct.name}". Disponível: ${currentStock} ${newProduct.unit || ""}.`
          );
        }

        await removeStock(
          newProduct.id,
          newAmount,
          `Uso no diário: ${title.trim()}`,
          getStockMetadata()
        );

        return {
          type: "new",

          productId:
            newProduct.id,

          quantity:
            newAmount,
        };
      }

      return null;
    }

    const oldProductId =
      Number(
        activityToEdit.productId
      );

    const oldQuantity =
      Number(
        activityToEdit.quantityValue
      ) || 0;

    const newProductId =
      productId
        ? Number(productId)
        : null;

    const newQuantity =
      productId
        ? Number(quantityValue) || 0
        : 0;

    /* =======================================================
       REMOVER PRODUTO DO DIÁRIO
    ======================================================= */

    if (!newProductId) {
      if (
        oldProductId &&
        oldQuantity > 0
      ) {
        await addStock(
          oldProductId,
          oldQuantity,
          `Estorno de uso do diário: ${title.trim()}`,
          getStockMetadata()
        );

        return {
          type: "remove",

          productId:
            oldProductId,

          quantity:
            oldQuantity,
        };
      }

      return null;
    }

    /* =======================================================
       PRODUTO NÃO MUDOU
    ======================================================= */

    if (
      oldProductId ===
      newProductId
    ) {
      const difference =
        newQuantity -
        oldQuantity;

      if (difference === 0) {
        return null;
      }

      /* =====================================================
         AUMENTOU A QUANTIDADE
      ===================================================== */

      if (difference > 0) {
        const currentProduct =
          await getProductById(
            newProductId
          );

        if (!currentProduct) {
          throw new Error(
            "Produto não encontrado."
          );
        }

        const currentStock =
          Number(
            currentProduct.stock
          ) || 0;

        if (
          difference >
          currentStock
        ) {
          throw new Error(
            `Estoque insuficiente para aumentar a quantidade. Disponível: ${currentStock} ${currentProduct.unit || ""}.`
          );
        }

        await removeStock(
          newProductId,
          difference,
          `Ajuste de uso no diário: ${title.trim()}`,
          getStockMetadata()
        );

        return {
          type: "increase",

          productId:
            newProductId,

          quantity:
            difference,
        };
      }

      /* =====================================================
         DIMINUIU A QUANTIDADE
      ===================================================== */

      const returnedQuantity =
        Math.abs(
          difference
        );

      await addStock(
        newProductId,
        returnedQuantity,
        `Estorno de quantidade no diário: ${title.trim()}`,
        getStockMetadata()
      );

      return {
        type: "decrease",

        productId:
          newProductId,

        quantity:
          returnedQuantity,
      };
    }

    /* =======================================================
       PRODUTO MUDOU
    ======================================================= */

    if (
      oldProductId &&
      oldQuantity > 0
    ) {
      await addStock(
        oldProductId,
        oldQuantity,
        `Estorno por troca de produto no diário: ${title.trim()}`,
        getStockMetadata()
      );
    }

    if (
      !newQuantity ||
      newQuantity <= 0
    ) {
      return {
        type: "change-remove-new",

        oldProductId,

        oldQuantity,
      };
    }

    const newProduct =
      await getProductById(
        newProductId
      );

    if (!newProduct) {
      /*
        Tenta restaurar o estado anterior.
      */

      if (
        oldProductId &&
        oldQuantity > 0
      ) {
        await removeStock(
          oldProductId,
          oldQuantity,
          `Reversão de troca de produto no diário: ${title.trim()}`,
          getStockMetadata()
        );
      }

      throw new Error(
        "Novo produto não encontrado."
      );
    }

    const currentStock =
      Number(
        newProduct.stock
      ) || 0;

    if (
      newQuantity >
      currentStock
    ) {
      /*
        Devolve o produto antigo
        caso a troca não possa
        ser concluída.
      */

      if (
        oldProductId &&
        oldQuantity > 0
      ) {
        await removeStock(
          oldProductId,
          oldQuantity,
          `Reversão de troca de produto no diário: ${title.trim()}`,
          getStockMetadata()
        );
      }

      throw new Error(
        `Estoque insuficiente para "${newProduct.name}". Disponível: ${currentStock} ${newProduct.unit || ""}.`
      );
    }

    await removeStock(
      newProductId,
      newQuantity,
      `Uso no diário: ${title.trim()}`,
      getStockMetadata()
    );

    return {
      type: "change",

      oldProductId,

      oldQuantity,

      newProductId,

      newQuantity,
    };
  }

  /* =========================================================
     DESFAZER AJUSTE DE ESTOQUE EM CASO DE ERRO
  ========================================================= */

  async function rollbackStockAdjustment(
    adjustment
  ) {
    if (!adjustment) {
      return;
    }

    try {
      if (
        adjustment.type ===
        "new"
      ) {
        await addStock(
          adjustment.productId,
          adjustment.quantity,
          `Estorno por erro ao salvar diário: ${title.trim()}`,
          getStockMetadata()
        );
      }

      if (
        adjustment.type ===
        "remove"
      ) {
        await removeStock(
          adjustment.productId,
          adjustment.quantity,
          `Reversão de estorno por erro no diário: ${title.trim()}`,
          getStockMetadata()
        );
      }

      if (
        adjustment.type ===
        "increase"
      ) {
        await addStock(
          adjustment.productId,
          adjustment.quantity,
          `Estorno de ajuste por erro no diário: ${title.trim()}`,
          getStockMetadata()
        );
      }

      if (
        adjustment.type ===
        "decrease"
      ) {
        await removeStock(
          adjustment.productId,
          adjustment.quantity,
          `Reversão de ajuste por erro no diário: ${title.trim()}`,
          getStockMetadata()
        );
      }

      if (
        adjustment.type ===
        "change"
      ) {
        if (
          adjustment.newProductId &&
          adjustment.newQuantity >
            0
        ) {
          await addStock(
            adjustment.newProductId,
            adjustment.newQuantity,
            `Estorno por erro ao salvar troca no diário: ${title.trim()}`,
            getStockMetadata()
          );
        }

        if (
          adjustment.oldProductId &&
          adjustment.oldQuantity >
            0
        ) {
          await removeStock(
            adjustment.oldProductId,
            adjustment.oldQuantity,
            `Reversão por erro ao salvar troca no diário: ${title.trim()}`,
            getStockMetadata()
          );
        }
      }

      if (
        adjustment.type ===
        "change-remove-new"
      ) {
        if (
          adjustment.oldProductId &&
          adjustment.oldQuantity >
            0
        ) {
          await removeStock(
            adjustment.oldProductId,
            adjustment.oldQuantity,
            `Reversão por erro na troca do diário: ${title.trim()}`,
            getStockMetadata()
          );
        }
      }
    } catch (
      rollbackError
    ) {
      console.error(
        "ERRO AO REVERTER ESTOQUE:",
        rollbackError
      );
    }
  }

  /* =========================================================
     SALVAR
  ========================================================= */

  async function handleSubmit(event) {
    event.preventDefault();

    if (saving) {
      return;
    }

    if (productId) {
      const amount =
        Number(quantityValue);

      if (
        !amount ||
        amount <= 0
      ) {
        alert(
          "Informe uma quantidade válida para o produto utilizado."
        );

        return;
      }
    }

    const selectedProduct =
      productId
        ? products.find(
            (item) =>
              String(item.id) ===
              String(productId)
          )
        : null;

    const formattedQuantity =
      selectedProduct &&
      quantityValue !== ""
        ? `${quantityValue} ${
            selectedProduct.unit ||
            ""
          }`.trim()
        : quantity;

    const activity = {
      title:
        title.trim(),

      date,

      location:
        location.trim(),

      description:
        description.trim(),

      propertyId:
        propertyId
          ? Number(propertyId)
          : null,

      plotId:
        plotId
          ? Number(plotId)
          : null,

      managementType:
        managementType.trim(),

      managementStatus,

      pest:
        pest.trim(),

      disease:
        disease.trim(),

      /*
        Mantemos o nome para
        compatibilidade.
      */
      product:
        selectedProduct?.name ||
        product.trim(),

      /*
        Vínculo com o estoque.
      */
      productId:
        productId
          ? Number(productId)
          : null,

      /*
        Texto antigo.
      */
      quantity:
        formattedQuantity,

      /*
        Valor numérico.
      */
      quantityValue:
        productId
          ? Number(
              quantityValue
            )
          : null,
    };

    let stockAdjustment =
      null;

    try {
      setSaving(true);

      let savedActivity;

      /* =====================================================
         NOVA ATIVIDADE
      ===================================================== */

      if (!activityToEdit) {
        /*
          Primeiro verifica o estoque.
        */

        if (productId) {
          await validateStockForNewActivity();
        }

        /*
          Salva o diário.
        */

        savedActivity =
          await createActivity(
            activity
          );

        /*
          Registra a saída no estoque
          com rastreabilidade.
        */

        if (productId) {
          const amount =
            Number(
              quantityValue
            );

          await removeStock(
            productId,
            amount,
            `Uso no diário: ${title.trim()}`,
            {
              ...getStockMetadata(),

              /*
                Agora conseguimos guardar
                o ID real da atividade criada.
              */
              activityId:
                savedActivity?.id ||
                null,
            }
          );

          stockAdjustment = {
            type: "new",

            productId:
              Number(productId),

            quantity:
              amount,
          };
        }
      }

      /* =====================================================
         EDITAR ATIVIDADE
      ===================================================== */

      else {
        /*
          Ajusta o estoque pela diferença.
        */

        stockAdjustment =
          await adjustStockForEdit();

        /*
          Atualiza o diário.
        */

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

      /*
        Se o estoque já foi alterado
        e alguma etapa posterior falhou,
        tenta desfazer.
      */

      if (stockAdjustment) {
        await rollbackStockAdjustment(
          stockAdjustment
        );
      }

      alert(
        error?.message ||
          "Erro ao salvar a atividade. Veja o Console (F12)."
      );
    } finally {
      setSaving(false);
    }
  }

  /* =========================================================
     RENDER
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
                  setTitle(
                    event.target.value
                  )
                }
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="date">
                Data
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
                required
              />

            </div>

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
                  setLocation(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="form-group">

              <label htmlFor="property">
                Propriedade
              </label>

              <select
                id="property"
                value={propertyId}
                onChange={
                  handlePropertyChange
                }
              >

                <option value="">
                  Selecione uma propriedade
                </option>

                {properties.map(
                  (property) => (
                    <option
                      key={
                        property.id
                      }
                      value={
                        property.id
                      }
                    >
                      {property.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label htmlFor="plot">
                Talhão
              </label>

              <select
                id="plot"
                value={plotId}
                onChange={(event) =>
                  setPlotId(
                    event.target.value
                  )
                }
                disabled={!propertyId}
              >

                <option value="">
                  {propertyId
                    ? "Selecione um talhão"
                    : "Selecione uma propriedade primeiro"}
                </option>

                {plots.map(
                  (plot) => (
                    <option
                      key={plot.id}
                      value={plot.id}
                    >
                      {plot.name}
                    </option>
                  )
                )}

              </select>

            </div>

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

            <div className="form-group">

              <label htmlFor="managementStatus">
                Status
              </label>

              <select
                id="managementStatus"
                value={
                  managementStatus
                }
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

            <div className="form-group">

              <label htmlFor="pest">
                Praga
              </label>

              <select
                id="pest"
                value={pest}
                onChange={(event) =>
                  setPest(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Selecione uma praga
                </option>

                {pests.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label htmlFor="disease">
                Doença
              </label>

              <select
                id="disease"
                value={disease}
                onChange={(event) =>
                  setDisease(
                    event.target.value
                  )
                }
              >

                <option value="">
                  Selecione uma doença
                </option>

                {diseases.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.name}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

        </section>

        {/* ===================================================
            PRODUTO / ESTOQUE
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
                Registre o produto e a quantidade retirada do estoque.
              </p>

            </div>

          </div>

          <div className="form-grid">

            <div className="form-group">

              <label htmlFor="product">
                Produto
              </label>

              <select
                id="product"
                value={productId}
                onChange={
                  handleProductChange
                }
              >

                <option value="">
                  Nenhum produto
                </option>

                {products.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>

            <div className="form-group">

              <label htmlFor="quantity">
                Quantidade utilizada
              </label>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >

                <input
                  id="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ex.: 20"
                  value={quantityValue}
                  onChange={
                    handleQuantityChange
                  }
                  disabled={!productId}
                />

                {selectedProduct && (
                  <span
                    style={{
                      whiteSpace:
                        "nowrap",
                      fontWeight: "600",
                      color: "#555",
                    }}
                  >
                    {selectedProduct.unit}
                  </span>
                )}

              </div>

              {selectedProduct && (
                <small
                  style={{
                    display: "block",
                    marginTop: "6px",
                    color: "#666",
                  }}
                >
                  Estoque disponível:{" "}

                  <strong>
                    {
                      Number(
                        selectedProduct.stock
                      ) || 0
                    }{" "}
                    {
                      selectedProduct.unit
                    }
                  </strong>
                </small>
              )}

            </div>

          </div>

        </section>

        {/* ===================================================
            OBSERVAÇÕES
        =================================================== */}

        <section className="form-section">

          <div className="form-section-header">

            <div className="form-section-icon">
              📋
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
            onChange={
              handlePhotoChange
            }
            className="photo-input"
          />

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

                {photoPreviews.map(
                  (
                    preview,
                    index
                  ) => (
                    <div
                      className="photo-preview"
                      key={`${preview.file.name}-${index}`}
                    >

                      <img
                        src={preview.url}
                        alt={
                          preview.file
                            .name ||
                          "Pré-visualização"
                        }
                      />

                      <button
                        type="button"
                        className="remove-photo-button"
                        onClick={() =>
                          removePhoto(
                            index
                          )
                        }
                        aria-label="Remover foto"
                        title="Remover foto"
                      >
                        ×
                      </button>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

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
              : activityToEdit
                ? "Salvar alterações"
                : "Salvar atividade"}
          </button>

        </div>

      </form>

    </main>
  );
}

export default NewActivity;