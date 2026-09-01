import { useEffect, useMemo, useState } from "react";

import db from "../db";

import "../styles/reports.css";

function Reports() {
const [activities, setActivities] = useState([]);
const [properties, setProperties] = useState([]);
const [plots, setPlots] = useState([]);

const [propertyFilter, setPropertyFilter] = useState("");
const [plotFilter, setPlotFilter] = useState("");
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

const [reportType, setReportType] = useState("geral");

const [loading, setLoading] = useState(true);

useEffect(() => {
async function loadData() {
try {
setLoading(true);

    const [
      activitiesData,
      propertiesData,
      plotsData,
    ] = await Promise.all([
      db.activities.toArray(),
      db.properties.toArray(),
      db.plots.toArray(),
    ]);

    setActivities(activitiesData || []);
    setProperties(propertiesData || []);
    setPlots(plotsData || []);
  } catch (error) {
    console.error("ERRO AO CARREGAR RELATÓRIOS:", error);
  } finally {
    setLoading(false);
  }
}

loadData();

}, []);

/* =========================================================
FILTROS
========================================================= */

const filteredActivities = useMemo(() => {
return activities.filter((activity) => {
if (
propertyFilter &&
Number(activity.propertyId) !== Number(propertyFilter)
) {
return false;
}

  if (
    plotFilter &&
    Number(activity.plotId) !== Number(plotFilter)
  ) {
    return false;
  }

  if (startDate && activity.date < startDate) {
    return false;
  }

  if (endDate && activity.date > endDate) {
    return false;
  }

  return true;
});

}, [
activities,
propertyFilter,
plotFilter,
startDate,
endDate,
]);

/* =========================================================
PROPRIEDADE / TALHÕES
========================================================= */

const selectedProperty = useMemo(() => {
if (!propertyFilter) return null;

return properties.find(
  (property) =>
    Number(property.id) === Number(propertyFilter)
);

}, [properties, propertyFilter]);

const availablePlots = useMemo(() => {
if (!propertyFilter) return plots;

return plots.filter(
  (plot) =>
    Number(plot.propertyId) === Number(propertyFilter)
);

}, [plots, propertyFilter]);

/* =========================================================
ESTATÍSTICAS
========================================================= */

const statistics = useMemo(() => {
const total = filteredActivities.length;

const completed = filteredActivities.filter(
  (activity) =>
    activity.managementStatus === "Concluído"
).length;

const inProgress = filteredActivities.filter(
  (activity) =>
    activity.managementStatus === "Em andamento"
).length;

const planned = filteredActivities.filter(
  (activity) =>
    activity.managementStatus === "Planejado"
).length;

const withPest = filteredActivities.filter(
  (activity) =>
    activity.pest &&
    activity.pest.trim() !== ""
).length;

const withDisease = filteredActivities.filter(
  (activity) =>
    activity.disease &&
    activity.disease.trim() !== ""
).length;

const withProduct = filteredActivities.filter(
  (activity) =>
    activity.product &&
    activity.product.trim() !== ""
).length;

return {
  total,
  completed,
  inProgress,
  planned,
  withPest,
  withDisease,
  withProduct,
};

}, [filteredActivities]);

/* =========================================================
MANEJO
========================================================= */

const managementSummary = useMemo(() => {
const summary = {};

filteredActivities.forEach((activity) => {
  const type =
    activity.managementType?.trim() ||
    "Não informado";

  if (!summary[type]) {
    summary[type] = 0;
  }

  summary[type]++;
});

return Object.entries(summary)
  .map(([name, count]) => ({
    name,
    count,
  }))
  .sort((a, b) => b.count - a.count);

}, [filteredActivities]);

/* =========================================================
PRAGAS
========================================================= */

const pestSummary = useMemo(() => {
const summary = {};

filteredActivities.forEach((activity) => {
  const pest = activity.pest?.trim();

  if (!pest) return;

  if (!summary[pest]) {
    summary[pest] = 0;
  }

  summary[pest]++;
});

return Object.entries(summary)
  .map(([name, count]) => ({
    name,
    count,
  }))
  .sort((a, b) => b.count - a.count);

}, [filteredActivities]);

/* =========================================================
DOENÇAS
========================================================= */

const diseaseSummary = useMemo(() => {
const summary = {};

filteredActivities.forEach((activity) => {
  const disease = activity.disease?.trim();

  if (!disease) return;

  if (!summary[disease]) {
    summary[disease] = 0;
  }

  summary[disease]++;
});

return Object.entries(summary)
  .map(([name, count]) => ({
    name,
    count,
  }))
  .sort((a, b) => b.count - a.count);

}, [filteredActivities]);

/* =========================================================
PRODUTOS
========================================================= */

const productSummary = useMemo(() => {
const summary = {};

filteredActivities.forEach((activity) => {
  const product = activity.product?.trim();

  if (!product) return;

  if (!summary[product]) {
    summary[product] = {
      name: product,
      quantity: 0,
      count: 0,
    };
  }

  summary[product].count++;

  const quantity = parseFloat(
    String(activity.quantity || "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "")
  );

  if (!Number.isNaN(quantity)) {
    summary[product].quantity += quantity;
  }
});

return Object.values(summary).sort(
  (a, b) => b.count - a.count
);

}, [filteredActivities]);

/* =========================================================
ATIVIDADES POR MÊS
========================================================= */

const monthlySummary = useMemo(() => {
const months = {};

filteredActivities.forEach((activity) => {
  if (!activity.date) return;

  const date = new Date(
    `${activity.date}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) return;

  const key = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;

  const label = date.toLocaleDateString(
    "pt-BR",
    {
      month: "short",
      year: "numeric",
    }
  );

  if (!months[key]) {
    months[key] = {
      key,
      label,
      count: 0,
    };
  }

  months[key].count++;
});

return Object.values(months).sort(
  (a, b) => a.key.localeCompare(b.key)
);

}, [filteredActivities]);

/* =========================================================
ATIVIDADES POR TALHÃO
========================================================= */

const plotSummary = useMemo(() => {
const summary = {};

filteredActivities.forEach((activity) => {
  const plot = plots.find(
    (item) =>
      Number(item.id) === Number(activity.plotId)
  );

  const key = plot?.name || "Sem talhão";

  if (!summary[key]) {
    summary[key] = {
      name: key,
      culture: plot?.culture || "",
      count: 0,
    };
  }

  summary[key].count++;
});

return Object.values(summary).sort(
  (a, b) => b.count - a.count
);

}, [filteredActivities, plots]);

/* =========================================================
TAXA DE CONCLUSÃO
========================================================= */

const completionRate = useMemo(() => {
if (!statistics.total) return 0;

return Math.round(
  (statistics.completed /
    statistics.total) *
    100
);

}, [statistics]);

/* =========================================================
MAIORES VALORES
========================================================= */

const maxMonthlyValue = useMemo(() => {
if (!monthlySummary.length) return 1;

return Math.max(
  ...monthlySummary.map(
    (item) => item.count
  )
);

}, [monthlySummary]);

const maxPlotValue = useMemo(() => {
if (!plotSummary.length) return 1;

return Math.max(
  ...plotSummary.map(
    (item) => item.count
  )
);

}, [plotSummary]);

const maxManagementValue = useMemo(() => {
if (!managementSummary.length) return 1;

return Math.max(
  ...managementSummary.map(
    (item) => item.count
  )
);

}, [managementSummary]);

/* =========================================================
NOMES
========================================================= */

function getPropertyName(propertyId) {
const property = properties.find(
(item) =>
Number(item.id) === Number(propertyId)
);

return property?.name || "Sem propriedade";

}

function getPlotName(plotId) {
const plot = plots.find(
(item) =>
Number(item.id) === Number(plotId)
);

return plot?.name || "Sem talhão";

}

/* =========================================================
DATA
========================================================= */

function formatDate(date) {
if (!date) return "-";

const parsed = new Date(
  `${date}T12:00:00`
);

if (Number.isNaN(parsed.getTime())) {
  return date;
}

return parsed.toLocaleDateString("pt-BR");

}

/* =========================================================
LIMPAR FILTROS
========================================================= */

function clearFilters() {
setPropertyFilter("");
setPlotFilter("");
setStartDate("");
setEndDate("");
}

/* =========================================================
TIPO DE RELATÓRIO
========================================================= */

const reportTypes = [
{
id: "geral",
icon: "📊",
title: "Geral",
description: "Visão completa",
},
{
id: "manejo",
icon: "🌱",
title: "Manejo",
description: "Operações do campo",
},
{
id: "fitossanitario",
icon: "🐛",
title: "Fitossanitário",
description: "Pragas e doenças",
},
{
id: "produtos",
icon: "📦",
title: "Produtos",
description: "Insumos utilizados",
},
{
id: "diario",
icon: "📋",
title: "Diário de Campo",
description: "Histórico completo",
},
];

const currentReport = reportTypes.find(
(item) => item.id === reportType
);

/* =========================================================
TÍTULOS DOS RELATÓRIOS
========================================================= */

const reportTitles = {
geral: {
title: "Relatório Geral",
description:
"Visão completa das atividades, manejos, ocorrências e produtos registrados.",
},

manejo: {
  title: "Relatório de Manejo",
  description:
    "Análise das operações realizadas, planejadas e em andamento no campo.",
},

fitossanitario: {
  title: "Relatório Fitossanitário",
  description:
    "Acompanhamento das pragas e doenças registradas nas atividades de campo.",
},

produtos: {
  title: "Relatório de Produtos",
  description:
    "Resumo dos produtos e insumos registrados durante as atividades.",
},

diario: {
  title: "Diário de Campo",
  description:
    "Histórico cronológico das atividades registradas no período selecionado.",
},

};

const currentTitle =
reportTitles[reportType];

/* =========================================================
IMPRESSÃO / PDF
========================================================= */

function handlePrint() {
window.print();
}

/* =========================================================
CARREGANDO
========================================================= */

if (loading) {
return (
<div className="reports-page">
<div className="reports-loading">
<div className="loading-spinner" />

      <h2>
        Carregando relatório...
      </h2>

      <p>
        Preparando os dados do Caderno de Campo.
      </p>
    </div>
  </div>
);

}

return (
<div className="reports-page">

  {/* =====================================================
      CABEÇALHO
  ====================================================== */}

  <div className="report-header no-print">
    <div>
      <span className="report-eyebrow">
        CADERNO DE CAMPO
      </span>

      <h1>
        Relatórios
      </h1>

      <p>
        Escolha o tipo de relatório e
        analise os dados registrados no campo.
      </p>
    </div>

    <button
      type="button"
      className="report-print-button"
      onClick={handlePrint}
    >
      🖨️
      <span>
        Gerar PDF
      </span>
    </button>
  </div>

  {/* =====================================================
      TIPOS DE RELATÓRIO
  ====================================================== */}

  <section className="report-types no-print">

    <div className="report-types-heading">
      <div>
        <span>
          TIPO DE RELATÓRIO
        </span>

        <h2>
          Escolha uma análise
        </h2>

        <p>
          Cada relatório apresenta uma visão
          diferente dos dados registrados.
        </p>
      </div>
    </div>

    <div className="report-types-grid">

      {reportTypes.map((type) => (
        <button
          type="button"
          key={type.id}
          className={`report-type-card ${
            reportType === type.id
              ? "active"
              : ""
          }`}
          onClick={() =>
            setReportType(type.id)
          }
        >
          <div className="report-type-top">
            <span className="report-type-icon">
              {type.icon}
            </span>

            {reportType === type.id && (
              <span className="report-type-selected">
                ✓
              </span>
            )}
          </div>

          <strong>
            {type.title}
          </strong>

          <span>
            {type.description}
          </span>

          <div className="report-type-arrow">
            →
          </div>
        </button>
      ))}

    </div>
  </section>

  {/* =====================================================
      CABEÇALHO IMPRESSO
  ====================================================== */}

  <div className="print-only print-report-header">

    <div>
      <strong>
        CADERNO DE CAMPO
      </strong>

      <h1>
        {currentTitle.title}
      </h1>
    </div>

    <div className="print-report-date">
      Gerado em{" "}
      {new Date().toLocaleDateString(
        "pt-BR"
      )}
    </div>

  </div>

  {/* =====================================================
      FILTROS
  ====================================================== */}

  <section className="report-filters no-print">

    <div className="filter-heading">

      <div className="filter-icon">
        ⚙️
      </div>

      <div>
        <strong>
          Filtros do relatório
        </strong>

        <span>
          Selecione o período, propriedade
          ou talhão.
        </span>
      </div>

    </div>

    <div className="filters-grid">

      <div className="filter-group">

        <label>
          Propriedade
        </label>

        <select
          value={propertyFilter}
          onChange={(event) => {
            setPropertyFilter(
              event.target.value
            );

            setPlotFilter("");
          }}
        >
          <option value="">
            Todas as propriedades
          </option>

          {properties.map((property) => (
            <option
              key={property.id}
              value={property.id}
            >
              {property.name}
            </option>
          ))}
        </select>

      </div>

      <div className="filter-group">

        <label>
          Talhão
        </label>

        <select
          value={plotFilter}
          onChange={(event) =>
            setPlotFilter(
              event.target.value
            )
          }
        >
          <option value="">
            Todos os talhões
          </option>

          {availablePlots.map((plot) => (
            <option
              key={plot.id}
              value={plot.id}
            >
              {plot.name}
            </option>
          ))}
        </select>

      </div>

      <div className="filter-group">

        <label>
          Data inicial
        </label>

        <input
          type="date"
          value={startDate}
          onChange={(event) =>
            setStartDate(
              event.target.value
            )
          }
        />

      </div>

      <div className="filter-group">

        <label>
          Data final
        </label>

        <input
          type="date"
          value={endDate}
          onChange={(event) =>
            setEndDate(
              event.target.value
            )
          }
        />

      </div>

    </div>

    <div className="filter-footer">

      <span>
        {filteredActivities.length}{" "}
        {filteredActivities.length === 1
          ? "atividade encontrada"
          : "atividades encontradas"}
      </span>

      <button
        type="button"
        onClick={clearFilters}
      >
        Limpar filtros
      </button>

    </div>

  </section>

  {/* =====================================================
      DOCUMENTO
  ====================================================== */}

  <section className="report-document">

    {/* ===================================================
        TÍTULO
    ==================================================== */}

    <div className="report-title">

      <div>

        <span className="report-label">
          {currentReport?.icon}{" "}
          {currentReport?.title?.toUpperCase()}
        </span>

        <h2>
          {currentTitle.title}
        </h2>

        <p>

          {selectedProperty
            ? selectedProperty.name
            : "Todas as propriedades"}

          {plotFilter
            ? ` • ${getPlotName(plotFilter)}`
            : ""}

          {(startDate || endDate) && (
            <>
              {" • "}

              {startDate
                ? formatDate(startDate)
                : "Início"}

              {" até "}

              {endDate
                ? formatDate(endDate)
                : "Hoje"}
            </>
          )}

        </p>

      </div>

      <div className="report-period">

        <span>
          PERÍODO
        </span>

        <strong>

          {startDate || endDate
            ? `${
                startDate
                  ? formatDate(startDate)
                  : "Início"
              } — ${
                endDate
                  ? formatDate(endDate)
                  : "Hoje"
              }`
            : "Todos os registros"}

        </strong>

      </div>

    </div>

    {/* ===================================================
        RELATÓRIO GERAL
    ==================================================== */}

    {reportType === "geral" && (
      <>
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                VISÃO GERAL
              </span>

              <h3>
                Indicadores
              </h3>
            </div>
          </div>

          <div className="report-stat-grid">

            <div className="report-stat-card">
              <div className="stat-icon">
                📋
              </div>

              <div>
                <span>
                  Atividades
                </span>

                <strong>
                  {statistics.total}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                ✅
              </div>

              <div>
                <span>
                  Concluídas
                </span>

                <strong>
                  {statistics.completed}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🔄
              </div>

              <div>
                <span>
                  Em andamento
                </span>

                <strong>
                  {statistics.inProgress}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🗓️
              </div>

              <div>
                <span>
                  Planejadas
                </span>

                <strong>
                  {statistics.planned}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🐛
              </div>

              <div>
                <span>
                  Com pragas
                </span>

                <strong>
                  {statistics.withPest}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🦠
              </div>

              <div>
                <span>
                  Com doenças
                </span>

                <strong>
                  {statistics.withDisease}
                </strong>
              </div>
            </div>

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                ANÁLISE
              </span>

              <h3>
                Indicadores de desempenho
              </h3>
            </div>
          </div>

          <div className="analytics-grid">

            <div className="analytics-card">

              <div className="analytics-card-header">
                <div>
                  <span>
                    EVOLUÇÃO
                  </span>

                  <h4>
                    Atividades por mês
                  </h4>
                </div>

                <div className="analytics-icon">
                  📊
                </div>
              </div>

              {monthlySummary.length > 0 ? (
                <div className="monthly-chart">

                  {monthlySummary.map(
                    (month) => {
                      const width =
                        Math.max(
                          4,
                          (month.count /
                            maxMonthlyValue) *
                            100
                        );

                      return (
                        <div
                          className="monthly-row"
                          key={month.key}
                        >
                          <div className="monthly-label">
                            {month.label}
                          </div>

                          <div className="monthly-bar-area">
                            <div
                              className="monthly-bar"
                              style={{
                                width: `${width}%`,
                              }}
                            />
                          </div>

                          <strong>
                            {month.count}
                          </strong>
                        </div>
                      );
                    }
                  )}

                </div>
              ) : (
                <div className="analytics-empty">
                  Não existem atividades
                  no período selecionado.
                </div>
              )}

            </div>

            <div className="analytics-card">

              <div className="analytics-card-header">
                <div>
                  <span>
                    DESEMPENHO
                  </span>

                  <h4>
                    Taxa de conclusão
                  </h4>
                </div>

                <div className="analytics-icon">
                  🎯
                </div>
              </div>

              <div className="completion-content">

                <div
                  className="completion-circle"
                  style={{
                    background: `conic-gradient(
                      currentColor ${completionRate}%,
                      #e8edf2 ${completionRate}% 100%
                    )`,
                  }}
                >
                  <div>
                    <strong>
                      {completionRate}%
                    </strong>

                    <span>
                      concluído
                    </span>
                  </div>
                </div>

                <div className="completion-details">

                  <div>
                    <span>
                      Concluídas
                    </span>

                    <strong>
                      {statistics.completed}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Em andamento
                    </span>

                    <strong>
                      {statistics.inProgress}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Planejadas
                    </span>

                    <strong>
                      {statistics.planned}
                    </strong>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                DISTRIBUIÇÃO
              </span>

              <h3>
                Atividades por talhão
              </h3>
            </div>
          </div>

          {plotSummary.length > 0 ? (
            <div className="plot-report-list">

              {plotSummary.map((plot) => {
                const width =
                  Math.max(
                    4,
                    (plot.count /
                      maxPlotValue) *
                      100
                  );

                return (
                  <div
                    className="plot-report-row"
                    key={plot.name}
                  >

                    <div className="plot-report-info">
                      <strong>
                        {plot.name}
                      </strong>

                      {plot.culture && (
                        <span>
                          {plot.culture}
                        </span>
                      )}
                    </div>

                    <div className="plot-report-bar">
                      <div
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>

                    <strong>
                      {plot.count}
                    </strong>

                  </div>
                );
              })}

            </div>
          ) : (
            <div className="report-empty">
              Nenhuma atividade encontrada.
            </div>
          )}

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                MANEJO
              </span>

              <h3>
                Tipos de manejo realizados
              </h3>
            </div>
          </div>

          {managementSummary.length > 0 ? (
            <div className="summary-list">

              {managementSummary.map(
                (item) => {
                  const percentage =
                    statistics.total
                      ? Math.round(
                          (item.count /
                            statistics.total) *
                            100
                        )
                      : 0;

                  return (
                    <div
                      className="summary-row"
                      key={item.name}
                    >

                      <div className="summary-row-info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.count}{" "}
                          {item.count === 1
                            ? "atividade"
                            : "atividades"}
                        </span>
                      </div>

                      <div className="summary-bar">
                        <div
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="report-empty">
              Nenhum manejo informado.
            </div>
          )}

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                OCORRÊNCIAS
              </span>

              <h3>
                Pragas e doenças
              </h3>
            </div>
          </div>

          <div className="occurrence-grid">

            <div className="occurrence-card">

              <div className="occurrence-header">
                <span>
                  🐛
                </span>

                <div>
                  <strong>
                    Pragas
                  </strong>

                  <small>
                    {pestSummary.length}{" "}
                    identificadas
                  </small>
                </div>
              </div>

              {pestSummary.length > 0 ? (
                <div className="occurrence-list">

                  {pestSummary.map(
                    (item) => (
                      <div
                        key={item.name}
                        className="occurrence-item"
                      >
                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.count}
                        </strong>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="occurrence-empty">
                  Nenhuma praga registrada.
                </div>
              )}

            </div>

            <div className="occurrence-card">

              <div className="occurrence-header">
                <span>
                  🦠
                </span>

                <div>
                  <strong>
                    Doenças
                  </strong>

                  <small>
                    {diseaseSummary.length}{" "}
                    identificadas
                  </small>
                </div>
              </div>

              {diseaseSummary.length > 0 ? (
                <div className="occurrence-list">

                  {diseaseSummary.map(
                    (item) => (
                      <div
                        key={item.name}
                        className="occurrence-item"
                      >
                        <span>
                          {item.name}
                        </span>

                        <strong>
                          {item.count}
                        </strong>
                      </div>
                    )
                  )}

                </div>
              ) : (
                <div className="occurrence-empty">
                  Nenhuma doença registrada.
                </div>
              )}

            </div>

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                INSUMOS
              </span>

              <h3>
                Produtos utilizados
              </h3>
            </div>
          </div>

          {productSummary.length > 0 ? (
            <div className="product-report-grid">

              {productSummary.map(
                (product) => (
                  <div
                    className="product-report-card"
                    key={product.name}
                  >

                    <div className="product-report-icon">
                      🧪
                    </div>

                    <div>
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.count}{" "}
                        {product.count === 1
                          ? "aplicação"
                          : "aplicações"}
                      </span>

                      {product.quantity > 0 && (
                        <small>
                          Quantidade registrada:{" "}
                          {product.quantity}
                        </small>
                      )}
                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="report-empty">
              Nenhum produto registrado.
            </div>
          )}

        </section>
      </>
    )}

    {/* ===================================================
        RELATÓRIO DE MANEJO
    ==================================================== */}

    {reportType === "manejo" && (
      <>
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                MANEJO
              </span>

              <h3>
                Resumo das operações
              </h3>
            </div>
          </div>

          <div className="report-stat-grid">

            <div className="report-stat-card">
              <div className="stat-icon">
                📋
              </div>
              <div>
                <span>
                  Total de atividades
                </span>
                <strong>
                  {statistics.total}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                ✅
              </div>
              <div>
                <span>
                  Concluídas
                </span>
                <strong>
                  {statistics.completed}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🔄
              </div>
              <div>
                <span>
                  Em andamento
                </span>
                <strong>
                  {statistics.inProgress}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🗓️
              </div>
              <div>
                <span>
                  Planejadas
                </span>
                <strong>
                  {statistics.planned}
                </strong>
              </div>
            </div>

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                DISTRIBUIÇÃO
              </span>

              <h3>
                Tipos de manejo
              </h3>
            </div>
          </div>

          {managementSummary.length > 0 ? (
            <div className="summary-list">

              {managementSummary.map(
                (item) => {
                  const percentage =
                    statistics.total
                      ? Math.round(
                          (item.count /
                            statistics.total) *
                            100
                        )
                      : 0;

                  const width =
                    Math.max(
                      4,
                      (item.count /
                        maxManagementValue) *
                        100
                    );

                  return (
                    <div
                      className="summary-row"
                      key={item.name}
                    >

                      <div className="summary-row-info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.count}{" "}
                          {item.count === 1
                            ? "atividade"
                            : "atividades"}
                        </span>
                      </div>

                      <div className="summary-bar">
                        <div
                          style={{
                            width: `${width}%`,
                          }}
                        />
                      </div>

                      <strong>
                        {percentage}%
                      </strong>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="report-empty">
              Nenhum manejo informado.
            </div>
          )}

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                HISTÓRICO
              </span>

              <h3>
                Operações registradas
              </h3>
            </div>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="activities-table-wrapper">

              <table className="activities-table">

                <thead>
                  <tr>
                    <th>
                      Data
                    </th>

                    <th>
                      Atividade
                    </th>

                    <th>
                      Talhão
                    </th>

                    <th>
                      Manejo
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {[...filteredActivities]
                    .sort(
                      (a, b) =>
                        new Date(
                          b.date ||
                            b.createdAt
                        ) -
                        new Date(
                          a.date ||
                            a.createdAt
                        )
                    )
                    .map((activity) => (

                      <tr
                        key={activity.id}
                      >

                        <td>
                          {formatDate(
                            activity.date
                          )}
                        </td>

                        <td>
                          <strong>
                            {activity.title ||
                              "Sem título"}
                          </strong>

                          {activity.location && (
                            <small>
                              {activity.location}
                            </small>
                          )}
                        </td>

                        <td>
                          {getPlotName(
                            activity.plotId
                          )}
                        </td>

                        <td>
                          {activity.managementType ||
                            "-"}
                        </td>

                        <td>
                          <span
                            className={`status-badge ${
                              activity.managementStatus
                                ?.toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                ) ||
                              "sem-status"
                            }`}
                          >
                            {activity.managementStatus ||
                              "Sem status"}
                          </span>
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="report-empty">
              Nenhuma operação encontrada.
            </div>
          )}

        </section>
      </>
    )}

    {/* ===================================================
        RELATÓRIO FITOSSANITÁRIO
    ==================================================== */}

    {reportType === "fitossanitario" && (
      <>
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                FITOSSANITÁRIO
              </span>

              <h3>
                Indicadores
              </h3>
            </div>
          </div>

          <div className="report-stat-grid">

            <div className="report-stat-card">
              <div className="stat-icon">
                📋
              </div>

              <div>
                <span>
                  Atividades analisadas
                </span>

                <strong>
                  {statistics.total}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🐛
              </div>

              <div>
                <span>
                  Atividades com pragas
                </span>

                <strong>
                  {statistics.withPest}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🦠
              </div>

              <div>
                <span>
                  Atividades com doenças
                </span>

                <strong>
                  {statistics.withDisease}
                </strong>
              </div>
            </div>

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                OCORRÊNCIAS
              </span>

              <h3>
                Pragas identificadas
              </h3>
            </div>
          </div>

          <div className="occurrence-card">

            {pestSummary.length > 0 ? (
              <div className="occurrence-list">

                {pestSummary.map(
                  (item) => (
                    <div
                      key={item.name}
                      className="occurrence-item"
                    >
                      <span>
                        🐛 {item.name}
                      </span>

                      <strong>
                        {item.count}{" "}
                        {item.count === 1
                          ? "registro"
                          : "registros"}
                      </strong>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="occurrence-empty">
                Nenhuma praga registrada
                no período.
              </div>
            )}

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                OCORRÊNCIAS
              </span>

              <h3>
                Doenças identificadas
              </h3>
            </div>
          </div>

          <div className="occurrence-card">

            {diseaseSummary.length > 0 ? (
              <div className="occurrence-list">

                {diseaseSummary.map(
                  (item) => (
                    <div
                      key={item.name}
                      className="occurrence-item"
                    >
                      <span>
                        🦠 {item.name}
                      </span>

                      <strong>
                        {item.count}{" "}
                        {item.count === 1
                          ? "registro"
                          : "registros"}
                      </strong>
                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="occurrence-empty">
                Nenhuma doença registrada
                no período.
              </div>
            )}

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                HISTÓRICO
              </span>

              <h3>
                Registros fitossanitários
              </h3>
            </div>
          </div>

          {filteredActivities.some(
            (activity) =>
              activity.pest ||
              activity.disease
          ) ? (
            <div className="activities-table-wrapper">

              <table className="activities-table">

                <thead>
                  <tr>
                    <th>
                      Data
                    </th>

                    <th>
                      Atividade
                    </th>

                    <th>
                      Talhão
                    </th>

                    <th>
                      Praga
                    </th>

                    <th>
                      Doença
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {[...filteredActivities]
                    .filter(
                      (activity) =>
                        activity.pest ||
                        activity.disease
                    )
                    .sort(
                      (a, b) =>
                        new Date(
                          b.date ||
                            b.createdAt
                        ) -
                        new Date(
                          a.date ||
                            a.createdAt
                        )
                    )
                    .map((activity) => (

                      <tr
                        key={activity.id}
                      >

                        <td>
                          {formatDate(
                            activity.date
                          )}
                        </td>

                        <td>
                          <strong>
                            {activity.title ||
                              "Sem título"}
                          </strong>
                        </td>

                        <td>
                          {getPlotName(
                            activity.plotId
                          )}
                        </td>

                        <td>
                          {activity.pest ||
                            "-"}
                        </td>

                        <td>
                          {activity.disease ||
                            "-"}
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="report-empty">
              Nenhum registro fitossanitário
              encontrado.
            </div>
          )}

        </section>
      </>
    )}

    {/* ===================================================
        RELATÓRIO DE PRODUTOS
    ==================================================== */}

    {reportType === "produtos" && (
      <>
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                INSUMOS
              </span>

              <h3>
                Indicadores de utilização
              </h3>
            </div>
          </div>

          <div className="report-stat-grid">

            <div className="report-stat-card">
              <div className="stat-icon">
                📋
              </div>

              <div>
                <span>
                  Atividades analisadas
                </span>

                <strong>
                  {statistics.total}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🧪
              </div>

              <div>
                <span>
                  Atividades com produto
                </span>

                <strong>
                  {statistics.withProduct}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                📦
              </div>

              <div>
                <span>
                  Produtos diferentes
                </span>

                <strong>
                  {productSummary.length}
                </strong>
              </div>
            </div>

          </div>

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                PRODUTOS
              </span>

              <h3>
                Produtos utilizados
              </h3>
            </div>
          </div>

          {productSummary.length > 0 ? (
            <div className="product-report-grid">

              {productSummary.map(
                (product) => (
                  <div
                    className="product-report-card"
                    key={product.name}
                  >

                    <div className="product-report-icon">
                      🧪
                    </div>

                    <div>

                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.count}{" "}
                        {product.count === 1
                          ? "aplicação"
                          : "aplicações"}
                      </span>

                      {product.quantity > 0 && (
                        <small>
                          Quantidade total:{" "}
                          {product.quantity}
                        </small>
                      )}

                    </div>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="report-empty">
              Nenhum produto registrado
              no período.
            </div>
          )}

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                HISTÓRICO
              </span>

              <h3>
                Aplicações registradas
              </h3>
            </div>
          </div>

          {filteredActivities.some(
            (activity) =>
              activity.product
          ) ? (
            <div className="activities-table-wrapper">

              <table className="activities-table">

                <thead>
                  <tr>
                    <th>
                      Data
                    </th>

                    <th>
                      Atividade
                    </th>

                    <th>
                      Talhão
                    </th>

                    <th>
                      Produto
                    </th>

                    <th>
                      Quantidade
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {[...filteredActivities]
                    .filter(
                      (activity) =>
                        activity.product
                    )
                    .sort(
                      (a, b) =>
                        new Date(
                          b.date ||
                            b.createdAt
                        ) -
                        new Date(
                          a.date ||
                            a.createdAt
                        )
                    )
                    .map((activity) => (

                      <tr
                        key={activity.id}
                      >

                        <td>
                          {formatDate(
                            activity.date
                          )}
                        </td>

                        <td>
                          <strong>
                            {activity.title ||
                              "Sem título"}
                          </strong>
                        </td>

                        <td>
                          {getPlotName(
                            activity.plotId
                          )}
                        </td>

                        <td>
                          {activity.product}
                        </td>

                        <td>
                          {activity.quantity ||
                            "-"}
                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="report-empty">
              Nenhuma aplicação de produto
              encontrada.
            </div>
          )}

        </section>
      </>
    )}

    {/* ===================================================
        DIÁRIO DE CAMPO
    ==================================================== */}

    {reportType === "diario" && (
      <>
        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                DIÁRIO DE CAMPO
              </span>

              <h3>
                Resumo do período
              </h3>
            </div>
          </div>

          <div className="report-stat-grid">

            <div className="report-stat-card">
              <div className="stat-icon">
                📋
              </div>

              <div>
                <span>
                  Registros
                </span>

                <strong>
                  {statistics.total}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🌱
              </div>

              <div>
                <span>
                  Manejos
                </span>

                <strong>
                  {managementSummary.length}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🐛
              </div>

              <div>
                <span>
                  Pragas
                </span>

                <strong>
                  {statistics.withPest}
                </strong>
              </div>
            </div>

            <div className="report-stat-card">
              <div className="stat-icon">
                🦠
              </div>

              <div>
                <span>
                  Doenças
                </span>

                <strong>
                  {statistics.withDisease}
                </strong>
              </div>
            </div>

          </div>

        </section>

        <section className="report-section report-history">

          <div className="section-heading">
            <div>
              <span>
                HISTÓRICO
              </span>

              <h3>
                Registros do diário
              </h3>
            </div>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="activities-table-wrapper">

              <table className="activities-table">

                <thead>
                  <tr>
                    <th>
                      Data
                    </th>

                    <th>
                      Atividade
                    </th>

                    <th>
                      Propriedade
                    </th>

                    <th>
                      Talhão
                    </th>

                    <th>
                      Manejo
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {[...filteredActivities]
                    .sort(
                      (a, b) =>
                        new Date(
                          b.date ||
                            b.createdAt
                        ) -
                        new Date(
                          a.date ||
                            a.createdAt
                        )
                    )
                    .map((activity) => (

                      <tr
                        key={activity.id}
                      >

                        <td>
                          {formatDate(
                            activity.date
                          )}
                        </td>

                        <td>

                          <strong>
                            {activity.title ||
                              "Sem título"}
                          </strong>

                          {activity.location && (
                            <small>
                              {activity.location}
                            </small>
                          )}

                          {activity.description && (
                            <small>
                              {activity.description}
                            </small>
                          )}

                        </td>

                        <td>
                          {getPropertyName(
                            activity.propertyId
                          )}
                        </td>

                        <td>
                          {getPlotName(
                            activity.plotId
                          )}
                        </td>

                        <td>
                          {activity.managementType ||
                            "-"}
                        </td>

                        <td>

                          <span
                            className={`status-badge ${
                              activity.managementStatus
                                ?.toLowerCase()
                                .replace(
                                  /\s+/g,
                                  "-"
                                ) ||
                              "sem-status"
                            }`}
                          >
                            {activity.managementStatus ||
                              "Sem status"}
                          </span>

                        </td>

                      </tr>

                    ))}

                </tbody>

              </table>

            </div>
          ) : (
            <div className="report-empty">
              Nenhum registro encontrado
              com os filtros selecionados.
            </div>
          )}

        </section>

        <section className="report-section">

          <div className="section-heading">
            <div>
              <span>
                OCORRÊNCIAS
              </span>

              <h3>
                Informações adicionais
              </h3>
            </div>
          </div>

          <div className="occurrence-grid">

            <div className="occurrence-card">

              <div className="occurrence-header">
                <span>
                  🐛
                </span>

                <div>
                  <strong>
                    Pragas
                  </strong>

                  <small>
                    Registros encontrados
                  </small>
                </div>
              </div>

              <div className="occurrence-item">
                <span>
                  Total
                </span>

                <strong>
                  {statistics.withPest}
                </strong>
              </div>

            </div>

            <div className="occurrence-card">

              <div className="occurrence-header">
                <span>
                  🦠
                </span>

                <div>
                  <strong>
                    Doenças
                  </strong>

                  <small>
                    Registros encontrados
                  </small>
                </div>
              </div>

              <div className="occurrence-item">
                <span>
                  Total
                </span>

                <strong>
                  {statistics.withDisease}
                </strong>
              </div>

            </div>

          </div>

        </section>
      </>
    )}

    {/* ===================================================
        RODAPÉ
    ==================================================== */}

    <footer className="report-footer">

      <div>

        <strong>
          Caderno de Campo
        </strong>

        <span>
          {currentTitle.title} •
          Relatório gerado automaticamente
          pelo sistema.
        </span>

      </div>

      <div>
        {new Date().toLocaleDateString(
          "pt-BR"
        )}
      </div>

    </footer>

  </section>

</div>

);
}

export default Reports;