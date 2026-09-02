import { useEffect, useState } from "react";

import {
  getCultures,
  deleteCulture,
} from "../services/cultureService";

import "../styles/cultures.css";

function Cultures({
  onNewCulture,
  onEditCulture,
  onBack,
}) {
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================================================
     CARREGAR CULTURAS
  ========================================================= */

  async function loadCultures() {
    try {
      setLoading(true);

      const data = await getCultures();

      setCultures(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "ERRO AO CARREGAR CULTURAS:",
        error
      );

      setCultures([]);
    } finally {
      setLoading(false);
    }
  }

  /* =========================================================
     CARREGAMENTO INICIAL
  ========================================================= */

  useEffect(() => {
    loadCultures();
  }, []);

  /* =========================================================
     EXCLUIR CULTURA
  ========================================================= */

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta cultura?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCulture(id);

      await loadCultures();
    } catch (error) {
      console.error(
        "ERRO AO EXCLUIR CULTURA:",
        error
      );

      alert(
        "Não foi possível excluir a cultura."
      );
    }
  }

  /* =========================================================
     TELA
  ========================================================= */

  return (
    <main className="cultures-page">

      {/* =====================================================
          CABEÇALHO
      ===================================================== */}

      <div className="cultures-heading">

        <div className="cultures-heading-content">

          <span className="home-label">
            CADASTROS
          </span>

          <h2>
            Culturas
          </h2>

          <p>
            Cadastre e gerencie as culturas
            utilizadas nas propriedades.
          </p>

        </div>

        <button
          type="button"
          className="primary-button cultures-new-button"
          onClick={onNewCulture}
        >
          <span>＋</span>
          Nova cultura
        </button>

      </div>

      {/* =====================================================
          BOTÃO VOLTAR
      ===================================================== */}

      <button
        type="button"
        className="back-button"
        onClick={onBack}
      >
        ← Voltar
      </button>

      {/* =====================================================
          CONTEÚDO
      ===================================================== */}

      <section className="cultures-content">

        {loading ? (

          /* =================================================
             CARREGANDO
          ================================================= */

          <div className="empty-state">

            <div className="empty-icon">
              🌱
            </div>

            <h3>
              Carregando culturas...
            </h3>

          </div>

        ) : cultures.length === 0 ? (

          /* =================================================
             NENHUMA CULTURA
          ================================================= */

          <div className="empty-state">

            <div className="empty-icon">
              🌱
            </div>

            <h3>
              Nenhuma cultura cadastrada
            </h3>

            <p>
              Cadastre sua primeira cultura
              para começar a organizar
              as informações agrícolas.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={onNewCulture}
            >
              ＋ Cadastrar primeira cultura
            </button>

          </div>

        ) : (

          /* =================================================
             LISTA DE CULTURAS
          ================================================= */

          <div className="cultures-list">

            {cultures.map((culture) => (

              <article
                className="culture-card"
                key={culture.id}
              >

                {/* =================================================
                    INFORMAÇÕES
                ================================================= */}

                <div className="culture-card-content">

                  <div className="culture-icon">
                    🌱
                  </div>

                  <div className="culture-info">

                    <h3>
                      {culture.name ||
                        "Cultura sem nome"}
                    </h3>

                    <div className="culture-details">

                      {culture.variety && (
                        <span>
                          <strong>
                            Variedade:
                          </strong>{" "}
                          {culture.variety}
                        </span>
                      )}

                      {culture.cycle && (
                        <span>
                          <strong>
                            Ciclo:
                          </strong>{" "}
                          {culture.cycle}
                        </span>
                      )}

                    </div>

                    {culture.observations && (
                      <p className="culture-observations">
                        {culture.observations}
                      </p>
                    )}

                  </div>

                </div>

                {/* =================================================
                    AÇÕES
                ================================================= */}

                <div className="culture-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      onEditCulture(culture)
                    }
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                      handleDelete(culture.id)
                    }
                  >
                    Excluir
                  </button>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Cultures;