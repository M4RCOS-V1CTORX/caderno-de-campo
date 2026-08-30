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
  onProperties,
  onDiary,
  onLibrary,
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState("recent");

  /* =========================================================
     CARREGAR ATIVIDADES
  ========================================================= */

  async function loadActivities() {
    try {
      console.log("CARREGANDO ATIVIDADES...");

      const data = await getActivities();

      console.log("ATIVIDADES ENCONTRADAS:", data);

      setActivities(data || []);
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR ATIVIDADES:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  /* =========================================================
     DATA ATUAL
  ========================================================= */

  const today = new Date()
    .toISOString()
    .split("T")[0];

  /* =========================================================
     ESTATÍSTICAS
  ========================================================= */

  const todayActivities = activities.filter(
    (activity) => activity.date === today
  );

  const uniqueLocations = new Set(
    activities
      .map((activity) => activity.location)
      .filter(Boolean)
  );

  const locationsCount = uniqueLocations.size;

  /* =========================================================
     FILTROS + PESQUISA + ORDENAÇÃO
  ========================================================= */

  const filteredActivities = [...activities]
    .filter((activity) => {
      const term = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !term ||
        activity.title
          ?.toLowerCase()
          .includes(term) ||
        activity.location
          ?.toLowerCase()
          .includes(term) ||
        activity.description
          ?.toLowerCase()
          .includes(term);

      const matchesDate =
        !selectedDate ||
        activity.date === selectedDate;

      return (
        matchesSearch &&
        matchesDate
      );
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

  /* =========================================================
     EXCLUIR ATIVIDADE
  ========================================================= */

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

      console.log(
        "ATIVIDADE REMOVIDA DA LISTA"
      );
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

  /* =========================================================
     LIMPAR FILTROS
  ========================================================= */

  function clearFilters() {
    setSearch("");
    setSelectedDate("");
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="home">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <section className="home-header">

        <div>

          <span className="home-label">
            VISÃO GERAL
          </span>

          <h2>
            Bom dia, Laís! 👋
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


      {/* =====================================================
          ESTATÍSTICAS
      ===================================================== */}

      <section className="stats-grid">

        <div className="stat-card">

          <span>
            📋
          </span>

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

          <span>
            📍
          </span>

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

          <span>
            📅
          </span>

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


      {/* =====================================================
          MÓDULOS
      ===================================================== */}

      <section className="modules-section">

        <div className="section-title">

          <h3>
            Módulos
          </h3>

          <p>
            Acesse as principais ferramentas do sistema.
          </p>

        </div>
<button
  type="button"
  className="module-card"
  onClick={onDiary}
>
  <span className="module-icon">
    📖
  </span>

  <div>
    <h4>
      Diário de Campo
    </h4>

    <p>
      Registros, observações e fotos
    </p>
  </div>

  <span className="module-arrow">
    →
  </span>
</button>

        <div className="modules-grid">

          <button
            type="button"
            className="module-card"
            onClick={onProperties}
          >

            <span className="module-icon">
              🏡
            </span>

            <div>

              <h4>
                Propriedades
              </h4>

              <p>
                Propriedades e talhões
              </p>

            </div>

            <span className="module-arrow">
              →
            </span>

          </button>
          <button
            type="button"
            className="module-card"
            onClick={onLibrary}
          >
            <span className="module-icon">
              📚
            </span>

            <div>
              <h4>
                Biblioteca
              </h4>

              <p>
                Pragas, doenças e produtos
              </p>
            </div>

            <span className="module-arrow">
              →
            </span>
        </button>

        </div>

      </section>


      {/* =====================================================
          ATIVIDADES RECENTES
      ===================================================== */}

      <section className="recent-section">

        <div className="section-title">

          <h3>
            Atividades recentes
          </h3>

          <p>
            Suas últimas atividades registradas.
          </p>

        </div>


        {/* ===================================================
            PESQUISA
        =================================================== */}

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


        {/* ===================================================
            FILTROS
        =================================================== */}

        <div className="filters-wrapper">

          {/* FILTRO DE DATA */}

          <div className="activity-filter">

            <span>
              📅
            </span>

            <input
              type="date"
              value={selectedDate}
              onChange={(event) =>
                setSelectedDate(
                  event.target.value
                )
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
                setSortOrder(
                  event.target.value
                )
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

        </div>


        {/* ===================================================
            CONTEÚDO
        =================================================== */}

        {loading ? (

          <div className="empty-state">

            <div className="empty-icon">
              ⏳
            </div>

            <h3>
              Carregando atividades
            </h3>

            <p>
              Aguarde enquanto buscamos seus registros.
            </p>

          </div>

        ) : activities.length === 0 ? (

          /* =================================================
             NENHUMA ATIVIDADE
          ================================================= */

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

          /* =================================================
             NENHUM RESULTADO
          ================================================= */

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

          /* =================================================
             LISTA
          ================================================= */

          <div className="activity-list">

            {filteredActivities.map(
              (activity) => (

                <div
                  className="activity-item"
                  key={activity.id}
                  onClick={() =>
                    onViewActivity(activity)
                  }
                >

                  {/* ÍCONE */}

                  <div className="activity-icon">
                    🌱
                  </div>


                  {/* INFORMAÇÕES */}

                  <div className="activity-info">

                    <h4>
                      {activity.title ||
                        "Atividade sem título"}
                    </h4>

                    <p>
                      {activity.location ||
                        "Local não informado"}
                    </p>

                  </div>


                  {/* AÇÕES */}

                  <div className="activity-actions">

                    <div className="activity-date">
                      {formatDate(
                        activity.date
                      )}
                    </div>


                    {/* EDITAR */}

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


                    {/* EXCLUIR */}

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

              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}


/* =========================================================
   FORMATAR DATA
========================================================= */

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


export default Home;