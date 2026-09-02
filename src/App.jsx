import { useState } from "react";

import Home from "./pages/home";

import NewActivity from "./pages/NewActivity";

import ActivityDetails from "./pages/ActivityDetails";

import Plots from "./pages/Plots";

import NewPlot from "./pages/NewPlot";

import Properties from "./pages/Properties";

import NewProperty from "./pages/NewProperty";

import Diary from "./pages/Diary";

import Library from "./pages/Library";

import NewProduct from "./pages/NewProduct";

import Pests from "./pages/Pests";

import NewPest from "./pages/NewPest";

import Diseases from "./pages/Diseases";

import NewDisease from "./pages/NewDisease";

import Cultures from "./pages/Cultures";

import NewCulture from "./pages/NewCulture";

import Reports from "./pages/Reports";

import "./styles/global.css";

import Management from "./pages/Management";

function App() {
  const [page, setPage] = useState("home");

  // =========================================================
  // ATIVIDADES
  // =========================================================

  const [activityToEdit, setActivityToEdit] = useState(null);

  const [activityToView, setActivityToView] = useState(null);

  function goToEditActivity(activity) {
    setActivityToEdit(activity);

    setPage("newActivity");
  }

  function goToActivityDetails(activity) {
    setActivityToView(activity);

    setPage("activityDetails");
  }

  function goToNewActivity() {
    setActivityToEdit(null);

    setPage("newActivity");
  }
  

  // =========================================================
  // HOME
  // =========================================================

  function goToHome() {
    setActivityToEdit(null);

    setActivityToView(null);

    setPropertyToEdit(null);

    setPlotToEdit(null);

    setProductToEdit(null);

    setPestToEdit(null);

    setDiseaseToEdit(null);

    setCultureToEdit(null);

    setPage("home");
  }

  // =========================================================
  // RELATÓRIOS
  // =========================================================

  function goToReports() {
    setPage("reports");
  }

  // =========================================================
  // DIÁRIO
  // =========================================================

  function goToDiary() {
    setPage("diary");
  }

  // =========================================================
  // PROPRIEDADES
  // =========================================================

  const [propertyToEdit, setPropertyToEdit] = useState(null);

  const [selectedProperty, setSelectedProperty] = useState(null);

  function goToProperties() {
    setPropertyToEdit(null);

    setPage("properties");
  }

  function goToNewProperty() {
    setPropertyToEdit(null);

    setPage("newProperty");
  }

  function goToEditProperty(property) {
    setPropertyToEdit(property);

    setPage("newProperty");
  }

  function goToPropertiesAfterSave() {
    setPropertyToEdit(null);

    setPage("properties");
  }

  // =========================================================
  // TALHÕES
  // =========================================================

  const [plotToEdit, setPlotToEdit] = useState(null);

  function goToPlots(property) {
    setSelectedProperty(property);

    setPlotToEdit(null);

    setPage("plots");
  }

  function goToNewPlot() {
    if (!selectedProperty) {
      return;
    }

    setPlotToEdit(null);

    setPage("newPlot");
  }

  function goToEditPlot(plot) {
    setPlotToEdit(plot);

    setPage("newPlot");
  }

  // =========================================================
  // BIBLIOTECA
  // =========================================================

  const [productToEdit, setProductToEdit] = useState(null);

  function goToLibrary() {
    setProductToEdit(null);

    setPage("library");
  }

  function goToNewProduct() {
    setProductToEdit(null);

    setPage("newProduct");
  }

  function goToEditProduct(product) {
    setProductToEdit(product);

    setPage("newProduct");
  }

  function goToLibraryAfterSave() {
    setProductToEdit(null);

    setPage("library");
  }

  // =========================================================
  // PRAGAS
  // =========================================================

  const [pestToEdit, setPestToEdit] = useState(null);

  function goToPests() {
    setPestToEdit(null);

    setPage("pests");
  }

  function goToNewPest() {
    setPestToEdit(null);

    setPage("newPest");
  }

  function goToEditPest(pest) {
    setPestToEdit(pest);

    setPage("newPest");
  }

  function goToPestsAfterSave() {
    setPestToEdit(null);

    setPage("pests");
  }

  // =========================================================
  // DOENÇAS
  // =========================================================

  const [diseaseToEdit, setDiseaseToEdit] = useState(null);

  function goToDiseases() {
    setDiseaseToEdit(null);

    setPage("diseases");
  }

  function goToNewDisease() {
    setDiseaseToEdit(null);

    setPage("newDisease");
  }

  function goToEditDisease(disease) {
    setDiseaseToEdit(disease);

    setPage("newDisease");
  }

  function goToDiseasesAfterSave() {
    setDiseaseToEdit(null);

    setPage("diseases");
  }

  // =========================================================
  // CULTURAS
  // =========================================================

  const [cultureToEdit, setCultureToEdit] = useState(null);

  function goToCultures() {
    setCultureToEdit(null);

    setPage("cultures");
  }

  function goToNewCulture() {
    setCultureToEdit(null);

    setPage("newCulture");
  }

  function goToEditCulture(culture) {
    setCultureToEdit(culture);

    setPage("newCulture");
  }

  function goToCulturesAfterSave() {
    setCultureToEdit(null);

    setPage("cultures");
  }
  function goToManagement() {
  setPage("management");
}

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="app">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="header">

        <div
          className="brand"
          onClick={goToHome}
          role="button"
          tabIndex={0}
        >

          <span className="logo-icon">
            🌱
          </span>

          <div>

            <h1>
              Caderno de Campo
            </h1>

            <p>
              Organize suas atividades de campo
            </p>

          </div>

        </div>

        <div className="connection-status">

          <span className="status-dot"></span>

          <span>
            Offline
          </span>

        </div>

      </header>

      {/* =====================================================
          HOME
      ===================================================== */}

      {page === "home" && (

        <Home
          onNewActivity={goToNewActivity}
          onEditActivity={goToEditActivity}
          onViewActivity={goToActivityDetails}
          onProperties={goToProperties}
          onDiary={goToDiary}
          onLibrary={goToLibrary}
          onReports={goToReports}
          onCultures={goToCultures}
          onManagement={goToManagement}
        />

      )}

      {/* =====================================================
          NOVA ATIVIDADE
      ===================================================== */}

      {page === "newActivity" && (

        <NewActivity
          onCancel={goToHome}
          onActivityCreated={goToHome}
          activityToEdit={activityToEdit}
        />

      )}

      {/* =====================================================
          DETALHES DA ATIVIDADE
      ===================================================== */}

      {page === "activityDetails" && (

        <ActivityDetails
          activity={activityToView}
          onBack={goToHome}
          onEdit={goToEditActivity}
        />

      )}

      {/* =====================================================
          PROPRIEDADES
      ===================================================== */}

      {page === "properties" && (

        <Properties
          onNewProperty={goToNewProperty}
          onEditProperty={goToEditProperty}
          onViewPlots={goToPlots}
        />

      )}

      {/* =====================================================
          NOVA PROPRIEDADE
      ===================================================== */}

      {page === "newProperty" && (

        <NewProperty
          onCancel={goToProperties}
          onPropertyCreated={goToPropertiesAfterSave}
          propertyToEdit={propertyToEdit}
        />

      )}

      {/* =====================================================
          TALHÕES
      ===================================================== */}

      {page === "plots" && (

        <Plots
          property={selectedProperty}
          onNewPlot={goToNewPlot}
          onEditPlot={goToEditPlot}
          onBack={goToProperties}
        />

      )}

      {/* =====================================================
          NOVO TALHÃO
      ===================================================== */}

      {page === "newPlot" && (

        <NewPlot
          property={selectedProperty}
          onCancel={() =>
            goToPlots(selectedProperty)
          }
          onPlotCreated={() =>
            goToPlots(selectedProperty)
          }
          plotToEdit={plotToEdit}
        />

      )}

      {/* =====================================================
          DIÁRIO
      ===================================================== */}

      {page === "diary" && (

        <Diary
          onNewActivity={goToNewActivity}
          onEditActivity={goToEditActivity}
          onViewActivity={goToActivityDetails}
          onBack={goToHome}
        />

      )}

      {/* =====================================================
          BIBLIOTECA
      ===================================================== */}

      {page === "library" && (

        <Library
          onNewProduct={goToNewProduct}
          onEditProduct={goToEditProduct}
          onBack={goToHome}
          onPests={goToPests}
          onDiseases={goToDiseases}
        />

      )}

      {/* =====================================================
          PRAGAS
      ===================================================== */}

      {page === "pests" && (

        <Pests
          onNewPest={goToNewPest}
          onEditPest={goToEditPest}
          onBack={goToLibrary}
        />

      )}

      {/* =====================================================
          NOVA PRAGA
      ===================================================== */}

      {page === "newPest" && (

        <NewPest
          onCancel={goToPests}
          onPestCreated={goToPestsAfterSave}
          pestToEdit={pestToEdit}
        />

      )}

      {/* =====================================================
          DOENÇAS
      ===================================================== */}

      {page === "diseases" && (

        <Diseases
          onNewDisease={goToNewDisease}
          onEditDisease={goToEditDisease}
          onBack={goToLibrary}
        />

      )}

      {/* =====================================================
          NOVA DOENÇA
      ===================================================== */}

      {page === "newDisease" && (

        <NewDisease
          onCancel={goToDiseases}
          onDiseaseCreated={goToDiseasesAfterSave}
          diseaseToEdit={diseaseToEdit}
        />

      )}

      {/* =====================================================
          CULTURAS
      ===================================================== */}

      {page === "cultures" && (

        <Cultures
          onNewCulture={goToNewCulture}
          onEditCulture={goToEditCulture}
          onBack={goToHome}
        />

      )}
      {page === "management" && (
  <Management
    onBack={goToHome}
  />
)}

      {/* =====================================================
          NOVA CULTURA
      ===================================================== */}

      {page === "newCulture" && (

        <NewCulture
          onCancel={goToCultures}
          onCultureCreated={goToCulturesAfterSave}
          cultureToEdit={cultureToEdit}
        />

      )}

      {/* =====================================================
          NOVO PRODUTO
      ===================================================== */}

      {page === "newProduct" && (

        <NewProduct
          onCancel={goToLibrary}
          onProductCreated={goToLibraryAfterSave}
          productToEdit={productToEdit}
        />

      )}

      {/* =====================================================
          RELATÓRIOS
      ===================================================== */}

      {page === "reports" && (

        <Reports
          onBack={goToHome}
        />

      )}

    </div>
  );
}

export default App;