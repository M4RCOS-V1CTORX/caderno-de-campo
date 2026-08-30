
import { useEffect, useState } from "react";

import {
  getActivities,
  deleteActivity,
} from "../services/activityService";

import "../styles/diary.css";

function Diary({
  onNewActivity,
  onEditActivity,
  onViewActivity,
  onBack,
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  async function loadActivities() {
    try {
      const data = await getActivities();
      setActivities(data || []);
    } catch (error) {
      console.error("ERRO AO CARREGAR DIÁRIO:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  const filteredActivities = [...activities]
    .filter((activity) => {
      const term = search.toLowerCase().trim();

      const matchesSearch =
        !term ||
        activity.title?.toLowerCase().includes(term) ||
        activity.location?.toLowerCase().includes(term) ||
        activity.description?.toLowerCase().includes(term);

      const matchesDate =
        !selectedDate || activity.date === selectedDate;

      return matchesSearch && matchesDate;
    })
    .sort((a, b) => {
      const dateA = a.date
        ? new Date(a.date).getTime()
        : 0;

      const dateB = b.date
        ? new Date(b.date).getTime()
        : 0;

      if (dateA !== dateB) {
        return sortOrder === "recent"
          ? dateB - dateA
          : dateA - dateB;
      }

      const createdA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const createdB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return sortOrder === "recent"
        ? createdB - createdA
        : createdA - createdB;
    });

  async function handleDeleteActivity(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este registro do diário?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteActivity(id);
      await loadActivities();
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR REGISTRO:",
        error
      );

      alert(
        "Não foi possível excluir o registro."
      );
    }
  }

  function clearFilters() {
    setSearch("");
    setSelectedDate("");
  }

  function formatDate(date) {
    if (!date) {
      return "Sem data";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const [year, month, day] = parts;

    return `${day}/${month}/${year}`;
  }

  function getDateLabel(date) {
    if (!date) {
      return "SEM DATA";
    }

    const parts = date.split("-");

    if (parts.length !== 3) {
      return date;
    }

    const [year, month, day] = parts;

    const dateObject = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return dateObject
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(".", "")
      .toUpperCase();
  }

  return (
    <main className="diary">
      <section className="diary-header">
        <div className="diary-header-content">
          <button
            type="button"
            className="diary-back-button"
            onClick={onBack}
          >
            ← Voltar
          </button>

          <span className="diary-label">
            REGISTROS DE CAMPO
          </span>

          <h2>Diário de Campo</h2>

          <p>
            Acompanhe tudo o que foi registrado
            durante as atividades de campo.
          </p>
        </div>

        <button
          type="button"
          className="diary-primary-button"
          onClick={onNewActivity}
        >
          + Novo registro
        </button>
      </section>

      <section className="diary-stats">
        <div className="diary-stat-card">
          <span className="diary-stat-icon">📋</span>

          <div>
            <strong>{activities.length}</strong>
            <p>Registros</p>
          </div>
        </div>

        <div className="diary-stat-card">
          <span className="diary-stat-icon">📅</span>

          <div>
            <strong>
              {
                activities.filter(
                  (activity) =>
                    activity.date ===
                    new Date()
                      .toISOString()
                      .split("T")[0]
                ).length
              }
            </strong>

            <p>Hoje</p>
          </div>
        </div>

        <div className="diary-stat-card">
          <span className="diary-stat-icon">📷</span>

          <div>
            <strong>
              {activities.filter(
                (activity) => activity.id
              ).length}
            </strong>

            <p>Atividades</p>
          </div>
        </div>
      </section>

      <section className="diary-content">
        <div className="diary-section-heading">
          <div>
            <h3>Registros</h3>

            <p>
              Consulte as informações registradas
              no campo.
            </p>
          </div>

          {(search || selectedDate) && (
            <button
              type="button"
              className="diary-clear-button"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          )}
        </div>

        <div className="diary-filters">
          <div className="diary-search">
            <span>🔎</span>

            <input
              type="text"
              placeholder="Pesquisar registro..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="diary-date-filter">
            <span>📅</span>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(
                  event.target.value
                )
              }
            />
          </div>

          <div className="diary-sort">
            <span>↕</span>

            <select
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value
                )
              }
            >
              <option value="recent">
                Mais recentes
              </option>

              <option value="oldest">
                Mais antigas
              </option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="diary-empty">
            <div className="diary-empty-icon">
              ⏳
            </div>

            <h3>Carregando diário</h3>

            <p>
              Aguarde enquanto buscamos seus
              registros.
            </p>
          </div>
        ) : activities.length === 0 ? (
          <div className="diary-empty">
            <div className="diary-empty-icon">
              📖
            </div>

            <h3>Seu diário está vazio</h3>

            <p>
              Registre sua primeira atividade de
              campo para começar.
            </p>

            <button
              type="button"
              className="diary-secondary-button"
              onClick={onNewActivity}
            >
              + Criar primeiro registro
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="diary-empty">
            <div className="diary-empty-icon">
              🔎
            </div>

            <h3>Nenhum registro encontrado</h3>

            <p>
              Tente alterar sua pesquisa ou os
              filtros.
            </p>

            <button
              type="button"
              className="diary-secondary-button"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="diary-list">
            {filteredActivities.map(
              (activity) => (
                <article
                  className="diary-card"
                  key={activity.id}
                  onClick={() =>
                    onViewActivity(activity)
                  }
                >
                  <div className="diary-card-date">
                    <span>
                      {getDateLabel(
                        activity.date
                      )}
                    </span>
                  </div>

                  <div className="diary-card-main">
                    <div className="diary-card-icon">
                      🌱
                    </div>

                    <div className="diary-card-info">
                      <h4>
                        {activity.title ||
                          "Registro sem título"}
                      </h4>

                      <div className="diary-card-meta">
                        {activity.location && (
                          <span>
                            📍{" "}
                            {activity.location}
                          </span>
                        )}

                        {activity.propertyId && (
                          <span>
                            🏡 Propriedade
                          </span>
                        )}

                        {activity.plotId && (
                          <span>
                            🌱 Talhão
                          </span>
                        )}
                      </div>

                      {activity.description && (
                        <p className="diary-card-description">
                          {activity.description}
                        </p>
                      )}

                      <div className="diary-card-footer">
                        <button
                          type="button"
                          className="diary-view-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onViewActivity(
                              activity
                            );
                          }}
                        >
                          Ver registro →
                        </button>

                        <button
                          type="button"
                          className="diary-edit-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onEditActivity(
                              activity
                            );
                          }}
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          className="diary-delete-button"
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
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </section>
    </main>
  );
}

export default Diary;
