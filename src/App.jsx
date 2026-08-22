import { useState } from "react";

import Home from "./pages/Home";
import NewActivity from "./pages/NewActivity";
import ActivityDetails from "./pages/ActivityDetails";
import "./styles/global.css";

function App() {
  const [page, setPage] = useState("home");
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

  function goToHome() {
  setActivityToEdit(null);
  setActivityToView(null);
  setPage("home");
}

  function goToNewActivity() {
  setActivityToEdit(null);
  setPage("newActivity");
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
          <span className="logo-icon">🌱</span>

          <div>
            <h1>Caderno de Campo</h1>
            <p>Organize suas atividades de campo</p>
          </div>
        </div>

        <div className="connection-status">
          <span className="status-dot"></span>
          <span>Offline</span>
        </div>
      </header>

      {page === "home" && (
        <Home
          onNewActivity={goToNewActivity}
          onEditActivity={goToEditActivity}
          onViewActivity={goToActivityDetails}
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

    </div>
  );
}

export default App;