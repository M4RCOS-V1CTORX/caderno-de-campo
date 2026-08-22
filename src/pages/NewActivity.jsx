import { useEffect, useState } from "react";
import {
  createActivity,
  updateActivity,
} from "../services/activityService";

import "../styles/newActivity.css";

function NewActivity({
  onCancel,
  onActivityCreated,
  activityToEdit,
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
  if (activityToEdit) {
    setTitle(activityToEdit.title || "");
    setDate(activityToEdit.date || "");
    setLocation(activityToEdit.location || "");
    setDescription(activityToEdit.description || "");
  }
}, [activityToEdit]);

  async function handleSubmit(event) {
    event.preventDefault();

    console.log("FORMULÁRIO ENVIADO");

    const activity = {
      title,
      date,
      location,
      description,
    };

    try {
      if (activityToEdit) {
  await updateActivity(activityToEdit.id, activity);
} else {
  await createActivity(activity);
}

      console.log("ATIVIDADE SALVA COM SUCESSO");

      alert(
  activityToEdit
    ? "Atividade atualizada com sucesso!"
    : "Atividade cadastrada com sucesso!"
);

      if (onActivityCreated) {
        onActivityCreated();
      } else {
        onCancel();
      }

    } catch (error) {
      console.error("ERRO AO SALVAR:", error);

      alert(
        "Erro ao salvar a atividade. Veja o Console (F12)."
      );
    }
  }

  return (
    <main className="new-activity">

      <div className="page-heading">
        <span className="home-label">
          ATIVIDADES
        </span>

        <h2>
            {activityToEdit ? "Editar atividade" : "Nova atividade"}
        </h2>

        <p>
          Registre uma nova atividade de campo.
        </p>
      </div>

      <form
        className="activity-form"
        onSubmit={handleSubmit}
      >

        <div className="form-section">

          <h3>Informações da atividade</h3>

          <div className="form-grid">

            <div className="form-group full">
              <label htmlFor="title">
                Nome da atividade
              </label>

              <input
                id="title"
                type="text"
                placeholder="Ex.: Visita à propriedade"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Data
              </label>

              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) =>
                  setDate(event.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">
                Local
              </label>

              <input
                id="location"
                type="text"
                placeholder="Ex.: Fazenda Boa Vista"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
              />
            </div>

            <div className="form-group full">
              <label htmlFor="description">
                Descrição
              </label>

              <textarea
                id="description"
                rows="5"
                placeholder="Descreva o que foi realizado..."
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </div>

          </div>

        </div>

        <div className="form-actions">

          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancelar
          </button>
        <button>
            {activityToEdit ? "Salvar alterações" : "Salvar atividade"}

        </button>
          

        </div>

      </form>

    </main>
  );
}

export default NewActivity;