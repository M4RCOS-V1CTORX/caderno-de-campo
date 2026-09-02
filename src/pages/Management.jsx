import { useEffect, useState } from "react";

import { getActivities } from "../services/activityService";

import { getPropertyById } from "../services/propertyService";

import { getPlotById } from "../services/plotService";

import "../styles/management.css";

function Management({ onBack }) {
  const [activities, setActivities] = useState([]);
  const [properties, setProperties] = useState({});
  const [plots, setPlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("Todos");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

  async function loadManagements() {
    try {
      setLoading(true);

      const data = await getActivities();

      const managements = (
        Array.isArray(data) ? data : []
      ).filter(
        (activity) =>
          activity.managementType ||
          activity.managementStatus
      );

      setActivities(managements);

      const propertyMap = {};
      const plotMap = {};

      for (const activity of managements) {
        if (
          activity.propertyId &&
          !propertyMap[activity.propertyId]
        ) {
          const property =
            await getPropertyById(
              activity.propertyId
            );

          if (property) {
            propertyMap[activity.propertyId] =
              property;
          }
        }

        if (
          activity.plotId &&
          !plotMap[activity.plotId]
        ) {
          const plot =
            await getPlotById(
              activity.plotId
            );

          if (plot) {
            plotMap[activity.plotId] =
              plot;
          }
        }
      }

      setProperties(propertyMap);
      setPlots(plotMap);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR MANEJOS:",
        error
      );

      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadManagements();
  }, []);
  const totalManagements = activities.length;

const plannedManagements = activities.filter(
  (activity) =>
    activity.managementStatus === "Planejado"
).length;

const inProgressManagements = activities.filter(
  (activity) =>
    activity.managementStatus === "Em andamento"
).length;

const completedManagements = activities.filter(
  (activity) =>
    activity.managementStatus === "Concluído"
).length;

  const filteredActivities = activities.filter(
  (activity) => {
    // FILTRO POR STATUS
    if (
      statusFilter !== "Todos" &&
      activity.managementStatus !== statusFilter
    ) {
      return false;
    }

    // FILTRO POR DATA INICIAL
    if (startDate) {
      if (
        !activity.managementPlannedDate ||
        activity.managementPlannedDate < startDate
      ) {
        return false;
      }
    }

    // FILTRO POR DATA FINAL
    if (endDate) {
      if (
        !activity.managementPlannedDate ||
        activity.managementPlannedDate > endDate
      ) {
        return false;
      }
    }

    return true;
  }
);

  function formatDate(date) {
    if (!date) {
      return "Não definida";
    }

    const [
      year,
      month,
      day,
    ] = date.split("-");

    if (
      !year ||
      !month ||
      !day
    ) {
      return date;
    }

    return `${day}/${month}/${year}`;
  }

  function normalizeStatus(status) {
    return String(status || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(
        /[\u0300-\u036f]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      );
  }

  function getStatusLabel(status) {
    if (!status) {
      return "Sem status";
    }

    return status;
  }

  return (
    <main className="management-page">
      <header className="management-header">
        <div>
          <span className="home-label">
            MANEJO
          </span>

          <h2>
            Manejo
          </h2>

          <p>
            Acompanhe os manejos planejados,
            em andamento e concluídos.
          </p>
        </div>
      </header>

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Voltar
      </button>
      
      <div className="management-summary">
        <div className="management-summary-card">
            <span>Total</span>
                <strong>{totalManagements}</strong>
  </div>

  <div className="management-summary-card">
    <span>Planejados</span>
    <strong>{plannedManagements}</strong>
  </div>

  <div className="management-summary-card">
    <span>Em andamento</span>
    <strong>{inProgressManagements}</strong>
  </div>

  <div className="management-summary-card">
    <span>Concluídos</span>
    <strong>{completedManagements}</strong>
  </div>
</div>

      <section className="management-content">
        <div className="management-filters">
  <button
    type="button"
    className={
      statusFilter === "Todos"
        ? "management-filter active"
        : "management-filter"
    }
    onClick={() =>
      setStatusFilter("Todos")
    }
  >
    <span>Todos</span>
    <strong>
      {activities.length}
    </strong>
  </button>

  <button
    type="button"
    className={
      statusFilter === "Planejado"
        ? "management-filter active"
        : "management-filter"
    }
    onClick={() =>
      setStatusFilter("Planejado")
    }
  >
    <span>Planejados</span>
    <strong>
      {
        activities.filter(
          (activity) =>
            activity.managementStatus ===
            "Planejado"
        ).length
      }
    </strong>
  </button>

  <button
    type="button"
    className={
      statusFilter === "Em andamento"
        ? "management-filter active"
        : "management-filter"
    }
    onClick={() =>
      setStatusFilter("Em andamento")
    }
  >
    <span>Em andamento</span>
    <strong>
      {
        activities.filter(
          (activity) =>
            activity.managementStatus ===
            "Em andamento"
        ).length
      }
    </strong>
  </button>

  <button
    type="button"
    className={
      statusFilter === "Concluído"
        ? "management-filter active"
        : "management-filter"
    }
    onClick={() =>
      setStatusFilter("Concluído")
    }
  >
    <span>Concluídos</span>
    <strong>
      {
        activities.filter(
          (activity) =>
            activity.managementStatus ===
            "Concluído"
        ).length
      }
    </strong>
  </button>
</div>
<div className="management-period-filter">
  <div className="management-date-field">
    <label htmlFor="managementStartDate">
      Data inicial
    </label>

    <input
      id="managementStartDate"
      type="date"
      value={startDate}
      onChange={(event) =>
        setStartDate(event.target.value)
      }
    />
  </div>

  <div className="management-date-field">
    <label htmlFor="managementEndDate">
      Data final
    </label>

    <input
      id="managementEndDate"
      type="date"
      value={endDate}
      onChange={(event) =>
        setEndDate(event.target.value)
      }
    />
  </div>

  {(startDate || endDate) && (
    <button
      type="button"
      className="management-clear-date"
      onClick={() => {
        setStartDate("");
        setEndDate("");
      }}
    >
      Limpar período
    </button>
  )}
</div>
        {loading ? (
          <div className="management-empty">
            <div className="management-empty-icon">
              🛠️
            </div>

            <h3>
              Carregando manejos...
            </h3>
          </div>
        ) : activities.length === 0 ? (
          <div className="management-empty">
            <div className="management-empty-icon">
              🛠️
            </div>

            <h3>
              Nenhum manejo cadastrado
            </h3>

            <p>
              Os manejos registrados no Diário
              de Campo aparecerão aqui.
            </p>
          </div>
        ) : filteredActivities.length === 0 ? (
  <div className="management-empty">
    <div className="management-empty-icon">
      🔎
    </div>

    <h3>
      Nenhum manejo encontrado
    </h3>

    <p>
      Não existem manejos que correspondam
      aos filtros selecionados.
    </p>
  </div>
) : (
  <div className="management-list">
    {filteredActivities.map(
              (activity) => {
                const property =
                  properties[
                    activity.propertyId
                  ];

                const plot =
                  plots[
                    activity.plotId
                  ];

                return (
                  <article
                    className="management-card"
                    key={activity.id}
                  >
                    <div className="management-card-top">
                      <div className="management-card-icon">
                        🛠️
                      </div>

                      <div className="management-card-title">
                        <span>
                          TIPO DE MANEJO
                        </span>

                        <h3>
                          {activity.managementType ||
                            "Manejo"}
                        </h3>
                      </div>

                      {activity.managementStatus && (
                        <span
                          className={`management-status status-${normalizeStatus(
                            activity.managementStatus
                          )}`}
                        >
                          {getStatusLabel(
                            activity.managementStatus
                          )}
                        </span>
                      )}
                    </div>

                    <div className="management-card-info">
                      <div className="management-info-item">
                        <span>
                          📅 Data prevista
                        </span>

                        <strong>
                          {formatDate(
                            activity.managementPlannedDate
                          )}
                        </strong>
                      </div>

                      {activity.managementCompletedDate && (
                        <div className="management-info-item">
                          <span>
                            ✅ Conclusão
                          </span>

                          <strong>
                            {formatDate(
                              activity.managementCompletedDate
                            )}
                          </strong>
                        </div>
                      )}

                      <div className="management-info-item">
                        <span>
                          🏡 Propriedade
                        </span>

                        <strong>
                          {property?.name ||
                            "Não informada"}
                        </strong>
                      </div>

                      <div className="management-info-item">
                        <span>
                          🌱 Talhão
                        </span>

                        <strong>
                          {plot?.name ||
                            "Não informado"}
                        </strong>
                      </div>

                      {plot?.culture && (
                        <div className="management-info-item">
                          <span>
                            🌾 Cultura
                          </span>

                          <strong>
                            {plot.culture}
                          </strong>
                        </div>
                      )}
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Management;