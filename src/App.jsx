import { useState } from "react";

import Home from "./pages/home";
import NewActivity from "./pages/NewActivity";
import ActivityDetails from "./pages/activityDetails";
import Plots from "./pages/Plots";
import NewPlot from "./pages/NewPlot";
import Properties from "./pages/Properties";
import NewProperty from "./pages/NewProperty";
import Diary from "./pages/Diary";

import "./styles/global.css";

function App() {
  const [page, setPage] = useState("home");

  const [activityToEdit, setActivityToEdit] = useState(null);
  const [activityToView, setActivityToView] = useState(null);
  const [plotToEdit, setPlotToEdit] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyToEdit, setPropertyToEdit] = useState(null);

  function goToEditActivity(activity) {
    setActivityToEdit(activity);
    setPage("newActivity");
  }

  function goToActivityDetails(activity) {
    setActivityToView(activity);
    setPage("activityDetails");
  }
  function goToDiary() {
  setPage("diary");
}

  function goToHome() {
    setActivityToEdit(null);
    setActivityToView(null);
    setPropertyToEdit(null);

    setPage("home");
  }

  function goToNewActivity() {
    setActivityToEdit(null);
    setPage("newActivity");
  }

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

      {page === "home" && (
        <Home
  onNewActivity={goToNewActivity}
  onEditActivity={goToEditActivity}
  onViewActivity={goToActivityDetails}
  onProperties={goToProperties}
  onDiary={goToDiary}
/>
      )}

      {page === "newActivity" && (
        <NewActivity
          onCancel={goToHome}
          onActivityCreated={goToHome}
          activityToEdit={activityToEdit}
        />
      )}

      {page === "activityDetails" && (
        <ActivityDetails
          activity={activityToView}
          onBack={goToHome}
          onEdit={goToEditActivity}
        />
      )}
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

{page === "diary" && (
  <Diary
    onNewActivity={goToNewActivity}
    onEditActivity={goToEditActivity}
    onViewActivity={goToActivityDetails}
    onBack={goToHome}
  />
)}

      {page === "properties" && (
  <Properties
    onNewProperty={goToNewProperty}
    onEditProperty={goToEditProperty}
    onViewPlots={goToPlots}
  />
)}

      {page === "newProperty" && (
        <NewProperty
          onCancel={goToProperties}
          onPropertyCreated={goToPropertiesAfterSave}
          propertyToEdit={propertyToEdit}
        />
      )}

    </div>
  );
}

export default App;