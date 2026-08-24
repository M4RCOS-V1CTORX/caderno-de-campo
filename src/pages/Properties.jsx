import { useEffect, useState } from "react";

import {
  getProperties,
  deleteProperty,
} from "../services/propertyService";

import "../styles/properties.css";

function Properties({
  onNewProperty,
  onEditProperty,
  onViewPlots,
}) {
  const [properties, setProperties] = useState([]);

  async function loadProperties() {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (error) {
      console.error("ERRO AO CARREGAR PROPRIEDADES:", error);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta propriedade?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProperty(id);
      await loadProperties();
    } catch (error) {
      console.error("ERRO AO EXCLUIR PROPRIEDADE:", error);

      alert(
        "Erro ao excluir a propriedade. Veja o Console (F12)."
      );
    }
  }

  return (
    <main className="properties-page">

      <div className="properties-heading">

        <div>
          <span className="home-label">
            CADASTROS
          </span>

          <h2>
            Propriedades
          </h2>

          <p>
            Gerencie as propriedades cadastradas no sistema.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={onNewProperty}
        >
          + Nova propriedade
        </button>

      </div>

      <section className="properties-content">

        {properties.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              🏡
            </div>

            <h3>
              Nenhuma propriedade cadastrada
            </h3>

            <p>
              Cadastre sua primeira propriedade para começar.
            </p>

            <button
              className="primary-button"
              onClick={onNewProperty}
            >
              Cadastrar propriedade
            </button>

          </div>

        ) : (

          <div className="properties-list">

            {properties.map((property) => (

              <article
                className="property-card"
                key={property.id}
              >

                <div className="property-card-content">

                  <div className="property-icon">
                    🏡
                  </div>

                  <div className="property-info">

                    <h3>
                      {property.name}
                    </h3>

                    {property.owner && (
                      <p>
                        Proprietário: {property.owner}
                      </p>
                    )}

                    {(property.city || property.state) && (
                      <span>
                        {[property.city, property.state]
                          .filter(Boolean)
                          .join(" - ")}
                      </span>
                    )}

                  </div>

                </div>

                <div className="property-actions">
                  <button
                    className="secondary-button"
                    onClick={() => onViewPlots(property)}
                    >
                    Talhões
                    </button>

                  <button
                    className="secondary-button"
                    onClick={() => onEditProperty(property)}
                  >
                    Editar
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(property.id)}
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

export default Properties;