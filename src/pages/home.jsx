import { useEffect, useState } from "react";

import { getActivities } from "../services/activityService";



import "../styles/home.css";

function Home({
  onNewActivity,
  onEditActivity,
  onViewActivity,
  onProperties,
  onDiary,
  onLibrary,
  onReports
}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     CARREGAR DADOS
  ========================================================= */

  async function loadActivities() {
    try {
      const data = await getActivities();

      setActivities(data || []);
    } catch (error) {
      console.error("ERRO AO CARREGAR ATIVIDADES:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadActivities();
  }, []);

  /* =========================================================
     DATA
  ========================================================= */

  const today = new Date().toISOString().split("T")[0];

  const todayActivities = activities.filter(
    (activity) => activity.date === today
  );

  const uniqueLocations = new Set(
    activities
      .map((activity) => activity.location)
      .filter(Boolean)
  );

  const locationsCount = uniqueLocations.size;

  const recentActivities = [...activities]
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    })
    .slice(0, 4);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <main className="home">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="hero-background-glow"></div>

        <div className="hero-content">

          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            SISTEMA DE GESTÃO AGRÍCOLA
          </div>

          <h1>
            Seu campo.
            <br />
            <span>Mais organizado.</span>
          </h1>

          <p className="hero-description">
            Organize propriedades, acompanhe talhões,
            registre atividades e mantenha todas as
            informações do campo em um só lugar.
          </p>

          <div className="hero-actions">

            <button
              type="button"
              className="hero-primary-button"
              onClick={onDiary}
            >
              <span className="button-icon">📖</span>

              <span>
                <strong>Abrir Diário de Campo</strong>
                <small>Registrar e acompanhar atividades</small>
              </span>

              <span className="button-arrow">→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={onNewActivity}
            >
              + Nova atividade
            </button>

          </div>

        </div>

        {/* ===================================================
            ILUSTRAÇÃO DO HERO
        =================================================== */}

        <div className="hero-visual">

          <div className="hero-circle hero-circle-one"></div>
          <div className="hero-circle hero-circle-two"></div>

          <div className="field-scene">

            <div className="sun"></div>

            <div className="mountain mountain-back"></div>
            <div className="mountain mountain-front"></div>

            <div className="field-lines">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="plant plant-one">
              <i></i>
              <b></b>
              <em></em>
            </div>

            <div className="plant plant-two">
              <i></i>
              <b></b>
              <em></em>
            </div>

            <div className="plant plant-three">
              <i></i>
              <b></b>
              <em></em>
            </div>

            <div className="plant plant-four">
              <i></i>
              <b></b>
              <em></em>
            </div>

            <div className="hero-floating-card">

              <div className="floating-icon">
                ✓
              </div>

              <div>
                <strong>Campo organizado</strong>
                <span>Dados salvos localmente</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FRASE DE DESTAQUE
      ===================================================== */}

      <section className="home-intro">

        <div className="intro-line"></div>

        <div>
          <span className="intro-label">
            TUDO EM UM SÓ LUGAR
          </span>

          <h2>
            Gestão agrícola feita
            <span> para o seu dia a dia.</span>
          </h2>
        </div>

        <p>
          Menos papelada. Mais organização.
          Tenha uma visão clara das informações
          importantes da sua propriedade.
        </p>

      </section>


      {/* =====================================================
          ACESSO RÁPIDO
      ===================================================== */}

      <section className="home-modules">

        <div className="home-section-heading">

          <div>
            <span>EXPLORE O SISTEMA</span>

            <h3>
              Tudo o que você precisa
            </h3>
          </div>

          <p>
            Acesse rapidamente os principais
            recursos do Caderno de Campo.
          </p>

        </div>


        <div className="premium-modules">

          {/* PROPRIEDADES */}

          <button
            type="button"
            className="premium-module property-module"
            onClick={onProperties}
          >

            <div className="module-top">

              <span className="module-number">
                01
              </span>

              <span className="module-open">
                ↗
              </span>

            </div>

            <div className="large-module-icon">
              🏡
            </div>

            <div className="module-text">

              <h4>
                Propriedades
              </h4>

              <p>
                Organize propriedades,
                talhões e informações da área.
              </p>

            </div>

            <div className="module-bottom">
              <span>
                Acessar módulo
              </span>

              <strong>
                →
              </strong>
            </div>

          </button>


          {/* CADERNO */}

          <button
            type="button"
            className="premium-module diary-module"
            onClick={onDiary}
          >

            <div className="module-top">

              <span className="module-number">
                02
              </span>

              <span className="module-open">
                ↗
              </span>

            </div>

            <div className="large-module-icon">
              📖
            </div>

            <div className="module-text">

              <h4>
                Diário de Campo
              </h4>

              <p>
                Registre atividades,
                observações, manejos e ocorrências.
              </p>

            </div>

            <div className="module-bottom">
              <span>
                Acessar módulo
              </span>

              <strong>
                →
              </strong>
            </div>

          </button>


          {/* BIBLIOTECA */}

          <button
            type="button"
            className="premium-module library-module"
            onClick={onLibrary}
          >

            <div className="module-top">

              <span className="module-number">
                03
              </span>

              <span className="module-open">
                ↗
              </span>

            </div>

            <div className="large-module-icon">
              📚
            </div>

            <div className="module-text">

              <h4>
                Biblioteca
              </h4>

              <p>
                Consulte produtos, pragas
                e doenças cadastrados.
              </p>

            </div>

            <div className="module-bottom">
              <span>
                Acessar módulo
              </span>

              <strong>
                →
              </strong>
            </div>

          </button>
          <button
              type="button"
              className="premium-module reports-module"
              onClick={onReports}
            >
              <div className="module-top">
                <span className="module-number">
                  04
                </span>

                <span className="module-open">
                  ↗
                </span>
              </div>

              <div className="large-module-icon">
                📊
              </div>

              <div className="module-text">
                <h4>
                  Relatórios
                </h4>

                <p>
                  Analise atividades, manejos,
                  ocorrências e resultados do campo.
                </p>
              </div>

              <div className="module-bottom">
                <span>
                  Acessar módulo
                </span>

                <strong>
                  →
                </strong>
              </div>
            </button>

        </div>

      </section>


      {/* =====================================================
          PAINEL DE VISÃO GERAL
      ===================================================== */}

      <section className="overview-section">

        <div className="overview-main">

          <div className="overview-heading">

            <div>
              <span>
                VISÃO DO SISTEMA
              </span>

              <h3>
                Seu campo em números
              </h3>
            </div>

            <div className="online-status">
              <span></span>
              Sistema disponível
            </div>

          </div>


          <div className="overview-stats">

            <div className="overview-stat">

              <span className="overview-stat-icon">
                📋
              </span>

              <div>
                <strong>
                  {loading ? "—" : activities.length}
                </strong>

                <span>
                  Registros
                </span>
              </div>

            </div>


            <div className="overview-stat">

              <span className="overview-stat-icon">
                📍
              </span>

              <div>
                <strong>
                  {loading ? "—" : locationsCount}
                </strong>

                <span>
                  Locais registrados
                </span>
              </div>

            </div>


            <div className="overview-stat">

              <span className="overview-stat-icon">
                📅
              </span>

              <div>
                <strong>
                  {loading ? "—" : todayActivities.length}
                </strong>

                <span>
                  Registros hoje
                </span>
              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            ÚLTIMOS REGISTROS
        =================================================== */}

        <div className="recent-mini">

          <div className="recent-mini-heading">

            <div>
              <span>
                ATIVIDADE
              </span>

              <h3>
                Últimos registros
              </h3>
            </div>

            <button
              type="button"
              onClick={onDiary}
            >
              Ver todos →
            </button>

          </div>


          {recentActivities.length === 0 ? (

            <div className="recent-empty">

              <span>
                🌱
              </span>

              <p>
                Seus próximos registros aparecerão aqui.
              </p>

            </div>

          ) : (

            <div className="mini-activity-list">

              {recentActivities.map((activity) => (

                <button
                  type="button"
                  className="mini-activity"
                  key={activity.id}
                  onClick={() => onViewActivity(activity)}
                >

                  <span className="mini-activity-icon">
                    🌱
                  </span>

                  <span className="mini-activity-info">

                    <strong>
                      {activity.title ||
                        "Atividade sem título"}
                    </strong>

                    <small>
                      {activity.location ||
                        "Local não informado"}
                    </small>

                  </span>

                  <span className="mini-activity-date">
                    {formatDate(activity.date)}
                  </span>

                  <span className="mini-activity-arrow">
                    →
                  </span>

                </button>

              ))}

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="home-final">

        <div className="final-decoration">
          🌿
        </div>

        <div>

          <span>
            DIÁRIO DE CAMPO
          </span>

          <h2>
            Pronto para cuidar
            <br />
            melhor do seu campo?
          </h2>

          <p>
            Comece registrando uma nova atividade
            e mantenha sua propriedade organizada.
          </p>

        </div>

        <button
          type="button"
          onClick={onNewActivity}
        >
          <span>+</span>
          Nova atividade
        </button>

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