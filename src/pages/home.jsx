import { useEffect, useState } from "react";

import {
  getActivities,
  deleteActivity,
} from "../services/activityService";

import "../styles/home.css";

function Home({
  onNewActivity,
  onEditActivity,
  onViewActivity,
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  async function loadActivities() {
    try {
      console.log("CARREGANDO ATIVIDADES...");

      const data = await getActivities();

      console.log("ATIVIDADES ENCONTRADAS:", data);

      setActivities(data);
    } catch (error) {
      console.error("ERRO AO CARREGAR ATIVIDADES:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayActivities = activities.filter(
    (activity) => activity.date === today
  );

  const uniqueLocations = new Set(
    activities
      .map((activity) => activity.location)
      .filter(Boolean)
  );

  const locationsCount = uniqueLocations.size;

  const filteredActivities = activities
    .filter((activity) => {
      const term = search.toLowerCase().trim();

      const matchesSearch =
        !term ||
        activity.title?.toLowerCase().includes(term) ||
        activity.location?.toLowerCase().includes(term) ||
        activity.description?.toLowerCase().includes(term);

      const matchesDate =
        !selectedDate ||
        activity.date === selectedDate;

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateDifference =
        new Date(b.date) - new Date(a.date);

      if (dateDifference !== 0) {
        return sortOrder === "recent"
          ? dateDifference
          : -dateDifference;
      }

      const createdDifference =
        new Date(b.createdAt) -
        new Date(a.createdAt);

      return sortOrder === "recent"
        ? createdDifference
        : -createdDifference;
    });

  async function handleDeleteActivity(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta atividade?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteActivity(id);

      await loadActivities();

      console.log("ATIVIDADE REMOVIDA DA LISTA");
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR ATIVIDADE:",
        error
      );

      alert(
        "Não foi possível excluir a atividade."
      );
    }
  }

  function clearFilters() {
    setSearch("");
    setSelectedDate("");
  }

  return (
    <main className="home">

      <section className="home-header">

        <div>

          <span className="home-label">
            VISÃO GERAL
          </span>

          <h2>
            Bom dia! 👋
          </h2>

          <p>
            Acompanhe suas atividades de campo.
          </p>

        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onNewActivity}
        >
          + Nova atividade
        </button>

      </section>


      <section className="stats-grid">

        <div className="stat-card">

          <span>📋</span>

          <div>

            <strong>
              {activities.length}
            </strong>

            <p>
              Atividades
            </p>

          </div>

        </div>


        <div className="stat-card">

          <span>📍</span>

          <div>

            <strong>
              {locationsCount}
            </strong>

            <p>
              Locais
            </p>

          </div>

        </div>


        <div className="stat-card">

          <span>📅</span>

          <div>

            <strong>
              {todayActivities.length}
            </strong>

            <p>
              Hoje
            </p>

          </div>

        </div>

      </section>


      <section className="recent-section">

        <div className="section-title">

          <h3>
            Atividades recentes
          </h3>

          <p>
            Suas últimas atividades registradas.
          </p>

        </div>


        {/* PESQUISA */}

        <div className="activity-search">

          <span>
            🔎
          </span>

          <input
            type="text"
            placeholder="Pesquisar atividade..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        {/* FILTRO DE DATA */}

        <div className="activity-filter">

          <span>
            📅
          </span>

          <input
            type="date"
            value={selectedDate}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
          />

          {selectedDate && (
            <button
              type="button"
              onClick={() =>
                setSelectedDate("")
              }
            >
              Limpar
            </button>
          )}

        </div>


        {/* ORDENAÇÃO */}

        <div className="activity-sort">

          <span>
            ↕
          </span>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
          >

            <option value="recent">
              Mais recentes primeiro
            </option>

            <option value="oldest">
              Mais antigas primeiro
            </option>

          </select>

        </div>


        {/* CONTEÚDO */}

        {loading ? (

          <div className="empty-state">

            <p>
              Carregando atividades...
            </p>

          </div>

        ) : activities.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              📋
            </div>

            <h3>
              Nenhuma atividade registrada
            </h3>

            <p>
              Quando você registrar uma atividade,
              ela aparecerá aqui.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={onNewActivity}
            >
              Criar primeira atividade
            </button>

          </div>

        ) : filteredActivities.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🔎
            </div>

            <h3>
              Nenhuma atividade encontrada
            </h3>

            <p>
              Tente alterar sua pesquisa ou o filtro de data.
            </p>

            <button
              type="button"
              className="secondary-button"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>

          </div>

        ) : (

          <div className="activity-list">

            {filteredActivities.map((activity) => (

              <div
                className="activity-item"
                key={activity.id}
                onClick={() =>
                  onViewActivity(activity)
                }
              >

                <div className="activity-icon">
                  🌱
                </div>


                <div className="activity-info">

                  <h4>
                    {activity.title}
                  </h4>

                  <p>
                    {activity.location ||
                      "Local não informado"}
                  </p>

                </div>


                <div className="activity-actions">

                  <div className="activity-date">
                    {formatDate(activity.date)}
                  </div>


                  <button
                    type="button"
                    className="edit-button"
                    onClick={(event) => {

                      event.stopPropagation();

                      onEditActivity(activity);

                    }}
                  >
                    Editar
                  </button>


                  <button
                    type="button"
                    className="delete-button"
                    onClick={(event) => {

                      event.stopPropagation();

                      handleDeleteActivity(
                        activity.id
                      );

                    }}
                  >
                    Excluir
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}


function formatDate(date) {

  if (!date) {
    return "Sem data";
  }

  const [year, month, day] =
    date.split("-");

  return `${day}/${month}/${year}`;
}


export default Home;