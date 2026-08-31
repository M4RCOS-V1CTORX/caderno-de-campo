import { useState } from "react";

import Home from "./pages/home";
import NewActivity from "./pages/NewActivity";
import ActivityDetails from "./pages/activityDetails";
<<<<<<< HEAD

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


=======
import Plots from "./pages/Plots";
import NewPlot from "./pages/NewPlot";
import Properties from "./pages/Properties";
import NewProperty from "./pages/NewProperty";

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
import "./styles/global.css";

function App() {
  const [page, setPage] = useState("home");

  const [activityToEdit, setActivityToEdit] = useState(null);
  const [activityToView, setActivityToView] = useState(null);
<<<<<<< HEAD

  const [plotToEdit, setPlotToEdit] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const [propertyToEdit, setPropertyToEdit] = useState(null);

  const [productToEdit, setProductToEdit] = useState(null);

  const [pestToEdit, setPestToEdit] = useState(null);

  const [diseaseToEdit, setDiseaseToEdit] = useState(null);

  // =========================================================
  // ATIVIDADES
  // =========================================================

=======
  const [plotToEdit, setPlotToEdit] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyToEdit, setPropertyToEdit] = useState(null);

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
  function goToEditActivity(activity) {
    setActivityToEdit(activity);
    setPage("newActivity");
  }

  function goToActivityDetails(activity) {
    setActivityToView(activity);
    setPage("activityDetails");
  }

<<<<<<< HEAD
=======
  function goToHome() {
    setActivityToEdit(null);
    setActivityToView(null);
    setPropertyToEdit(null);

    setPage("home");
  }

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
  function goToNewActivity() {
    setActivityToEdit(null);
    setPage("newActivity");
  }

<<<<<<< HEAD
  // =========================================================
  // DIÁRIO
  // =========================================================

  function goToDiary() {
    setPage("diary");
  }

  // =========================================================
  // PROPRIEDADES
  // =========================================================

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
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
<<<<<<< HEAD

  // =========================================================
  // TALHÕES
  // =========================================================

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

function goToPests() {
  setPage("pests");
}

function goToNewPest() {
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

function goToDiseases() {
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
// DOENÇAS
// =========================================================

function goToDiseases() {
  setDiseaseToEdit(null);
  setPage("diseases");
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

    setPage("home");
  }

  // =========================================================
  // RENDER
  // =========================================================

=======
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

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
  return (
    <div className="app">

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

<<<<<<< HEAD
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
        />
      )}

      {/* =====================================================
          NOVA ATIVIDADE
      ===================================================== */}

=======
      {page === "home" && (
        <Home
  onNewActivity={goToNewActivity}
  onEditActivity={goToEditActivity}
  onViewActivity={goToActivityDetails}
  onProperties={goToProperties}
/>
      )}

>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
      {page === "newActivity" && (
        <NewActivity
          onCancel={goToHome}
          onActivityCreated={goToHome}
          activityToEdit={activityToEdit}
        />
      )}

<<<<<<< HEAD
      {/* =====================================================
          DETALHES DA ATIVIDADE
      ===================================================== */}

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
      {page === "activityDetails" && (
        <ActivityDetails
          activity={activityToView}
          onBack={goToHome}
          onEdit={goToEditActivity}
        />
      )}
<<<<<<< HEAD

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
=======
      {page === "plots" && (
  <Plots
  property={selectedProperty}
  onNewPlot={goToNewPlot}
  onEditPlot={goToEditPlot}
  onBack={goToProperties}
/>
)}

{page === "newPlot" && (
  <NewPlot
    property={selectedProperty}
    onCancel={() => goToPlots(selectedProperty)}
    onPlotCreated={() => goToPlots(selectedProperty)}
    plotToEdit={plotToEdit}
  />
)}

      {page === "properties" && (
  <Properties
    onNewProperty={goToNewProperty}
    onEditProperty={goToEditProperty}
    onViewPlots={goToPlots}
  />
)}
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7

      {page === "newProperty" && (
        <NewProperty
          onCancel={goToProperties}
          onPropertyCreated={goToPropertiesAfterSave}
          propertyToEdit={propertyToEdit}
        />
      )}

<<<<<<< HEAD
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
          onCancel={() => goToPlots(selectedProperty)}
          onPlotCreated={() => goToPlots(selectedProperty)}
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
      {page === "pests" && (
  <Pests
    onNewPest={goToNewPest}
    onEditPest={goToEditPest}
    onBack={goToLibrary}
  />
)}

{page === "newPest" && (
  <NewPest
    onCancel={goToPests}
    onPestCreated={goToPestsAfterSave}
    pestToEdit={pestToEdit}
  />
)}
{page === "diseases" && (
  <Diseases
    onNewDisease={goToNewDisease}
    onEditDisease={goToEditDisease}
    onBack={goToLibrary}
  />
)}
{page === "newDisease" && (
  <NewDisease
    onCancel={goToDiseases}
    onDiseaseCreated={goToDiseasesAfterSave}
    diseaseToEdit={diseaseToEdit}
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

=======
>>>>>>> 1a50bfbf5bd6e360b7dd9a807481a9661ef5ead7
    </div>
  );
}

export default App;