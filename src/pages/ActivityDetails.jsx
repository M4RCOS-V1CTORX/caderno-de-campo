import "../styles/activityDetails.css";

function ActivityDetails({
  activity,
  onBack,
  onEdit,
}) {
  if (!activity) {
    return null;
  }

  return (
    <main className="activity-details">

      <div className="page-heading">

        <span className="home-label">
          ATIVIDADE
        </span>

        <h2>{activity.title}</h2>

        <p>
          Detalhes da atividade registrada.
        </p>

      </div>

      <section className="details-card">

        <div className="detail-item">
          <span className="detail-icon">📅</span>

          <div>
            <span className="detail-label">
              Data
            </span>

            <strong>
              {formatDate(activity.date)}
            </strong>
          </div>
        </div>

        <div className="detail-item">
          <span className="detail-icon">📍</span>

          <div>
            <span className="detail-label">
              Local
            </span>

            <strong>
              {activity.location || "Local não informado"}
            </strong>
          </div>
        </div>

        <div className="detail-description">

          <span className="detail-label">
            📝 Descrição
          </span>

          <p>
            {activity.description ||
              "Nenhuma descrição informada."}
          </p>

        </div>

      </section>

      <div className="details-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
        >
          Voltar
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={() => onEdit(activity)}
        >
          Editar atividade
        </button>

      </div>

    </main>
  );
}

function formatDate(date) {
  if (!date) {
    return "Sem data";
  }

  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

export default ActivityDetails;