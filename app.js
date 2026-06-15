const sectionButtons = document.querySelectorAll(".nav button");
const sections = document.querySelectorAll(".section");

function showSection(id, updateHash = true) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });

  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === id);
  });

  if (updateHash) history.replaceState(null, "", `#${id}`);

  const activeSection = document.getElementById(id);
  if (activeSection) {
    requestAnimationFrame(() => {
      activeSection.querySelectorAll(".reveal").forEach((element) => {
        element.classList.add("is-visible");
      });
      if (id === "hipotesis") createRadarChart();
      if (id === "testeo") createTestMixChart();
      if (id === "feedback") createFeedbackChart();
      activeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

document.querySelectorAll("[data-go]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(button.dataset.go);
  });
});

const prototypeSteps = [
  {
    label: "Fase 1 de 5",
    pill: "Entrada narrativa",
    icon: "🏺",
    title: "El aviso del Archivo",
    text: "El alumnado recibe una carta del Archivo de la Historia. Una pieza temporal se ha desordenado y deben restaurarla para desbloquear el sello de la era.",
    roles: ["Lector/a", "Guardián/a del tiempo"],
    tasks: ["Carta de misión en lectura fácil", "Mapa visual de la era", "Objetivo expresado en una frase"],
    fa: "fa-scroll"
  },
  {
    label: "Fase 2 de 5",
    pill: "Exploración del reto",
    icon: "🧩",
    title: "Piezas fuera de lugar",
    text: "El grupo manipula piezas históricas, símbolos y pistas visuales. Deben observar, comparar y relacionar elementos para encontrar una secuencia lógica.",
    roles: ["Observador/a", "Constructor/a"],
    tasks: ["Piezas grandes y manipulables", "Colores y símbolos redundantes", "Apoyo visual para ordenar"],
    fa: "fa-puzzle-piece"
  },
  {
    label: "Fase 3 de 5",
    pill: "Pistas graduadas",
    icon: "🔎",
    title: "Ayuda sin resolver",
    text: "Si aparece bloqueo, se ofrecen tres niveles de pista: recordar la misión, señalar una estrategia y mostrar una ayuda parcial sin dar la solución completa.",
    roles: ["Pidepistas", "Comprobador/a"],
    tasks: ["Pista 1: orientación", "Pista 2: estrategia", "Pista 3: apoyo concreto"],
    fa: "fa-magnifying-glass"
  },
  {
    label: "Fase 4 de 5",
    pill: "Validación final",
    icon: "🔐",
    title: "El candado simbólico",
    text: "La solución permite abrir un candado, activar una validación o descubrir una palabra clave. El objetivo es cerrar el reto con una comprobación inmediata.",
    roles: ["Validador/a", "Portavoz"],
    tasks: ["Código final claro", "Feedback inmediato", "Error permitido sin penalización"],
    fa: "fa-lock-open"
  },
  {
    label: "Fase 5 de 5",
    pill: "Logro visible",
    icon: "📜",
    title: "Sello en el pasaporte",
    text: "Al superar la misión, el alumnado recibe un sello o insignia en su pasaporte. El logro se convierte en evidencia física y emocional del aprendizaje.",
    roles: ["Archivista", "Sellador/a"],
    tasks: ["Pasaporte del Explorador", "Mini cierre emocional", "Pregunta: ¿qué hemos conseguido?"],
    fa: "fa-stamp"
  }
];

const stepsEl = document.getElementById("steps");
const rolesEl = document.getElementById("roles");
const taskListEl = document.getElementById("taskList");

function renderStep(index) {
  const step = prototypeSteps[index];
  document.getElementById("screenLabel").textContent = step.label;
  document.getElementById("screenPill").textContent = step.pill;
  document.getElementById("eraIcon").textContent = step.icon;
  document.getElementById("screenTitle").textContent = step.title;
  document.getElementById("screenText").textContent = step.text;
  document.getElementById("progressBar").style.width = `${((index + 1) / prototypeSteps.length) * 100}%`;

  rolesEl.innerHTML = step.roles.map((role) => `<span class="role">${role}</span>`).join("");
  taskListEl.innerHTML = step.tasks.map((task) => `
    <div class="task">
      <span><i class="fa-solid fa-check"></i></span>
      <b>${task}</b>
    </div>
  `).join("");

  document.querySelectorAll(".step-btn").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
}

if (stepsEl) {
  stepsEl.innerHTML = prototypeSteps.map((step, index) => `
    <button class="step-btn ${index === 0 ? "active" : ""}" type="button" data-step="${index}">
      <i class="fa-solid ${step.fa}"></i>
      <span><strong>${step.pill}</strong><small>${step.title}</small></span>
    </button>
  `).join("");

  stepsEl.addEventListener("click", (event) => {
    const button = event.target.closest(".step-btn");
    if (button) renderStep(Number(button.dataset.step));
  });

  renderStep(0);
}

const feedback = {
  alumnado: {
    label: "Percepción del alumnado",
    title: "Preguntas al alumnado",
    text: "¿Has entendido la misión? ¿Qué parte te ha gustado más? ¿En qué momento has necesitado ayuda? ¿Te has sentido importante dentro del equipo? ¿Quieres jugar otra era?",
    meters: [["Claridad", 82], ["Motivación", 90], ["Sensación de logro", 88], ["Participación", 84]]
  },
  docente: {
    label: "Observación docente",
    title: "Preguntas al docente",
    text: "¿La actividad permite observar competencias STEAM? ¿Los apoyos son suficientes? ¿El reto mantiene nivel educativo? ¿Qué barreras aparecen? ¿Qué cambiarías antes de repetirlo?",
    meters: [["Utilidad didáctica", 86], ["Facilidad de implementación", 74], ["Inclusión", 88], ["Evaluación", 78]]
  },
  prototipo: {
    label: "Aprendizajes de diseño",
    title: "Qué cambió tras el piloto",
    text: "El testeo inicial mostró que la narrativa motiva, pero debe separarse de las instrucciones; los roles necesitan acciones más visibles; y las pistas funcionan mejor cuando orientan primero y concretan después.",
    meters: [["Coherencia", 90], ["Escalabilidad", 76], ["Accesibilidad", 86], ["Rigor de medición", 80]]
  }
};

const metersEl = document.getElementById("meters");

function renderFeedback(key) {
  const item = feedback[key];
  document.getElementById("feedbackLabel").textContent = item.label;
  document.getElementById("feedbackTitle").textContent = item.title;
  document.getElementById("feedbackText").textContent = item.text;

  metersEl.innerHTML = item.meters.map(([label, value]) => `
    <div class="meter-row">
      <span>${label}</span>
      <div class="bar"><span style="width:${value}%"></span></div>
      <strong>${value}%</strong>
    </div>
  `).join("");

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.feedback === key);
  });
}

const tabs = document.querySelector(".tabs");
if (tabs) {
  tabs.addEventListener("click", (event) => {
    const tab = event.target.closest(".tab");
    if (tab) renderFeedback(tab.dataset.feedback);
  });
  renderFeedback("alumnado");
}

let radarChart;
let testMixChart;
let feedbackChart;

function createRadarChart() {
  const chartEl = document.getElementById("radarChart");
  if (!chartEl || !window.Chart || radarChart) return;

  radarChart = new Chart(chartEl, {
    type: "radar",
    data: {
      labels: ["Comprensión", "Participación", "Autonomía", "Colaboración", "Regulación", "Logro"],
      datasets: [
        {
          label: "Resultado esperado",
          data: [4, 4, 3, 4, 3, 4],
          fill: true,
          backgroundColor: "rgba(180, 83, 9, .16)",
          borderColor: "#b45309",
          pointBackgroundColor: "#111827",
          pointBorderColor: "#ffffff",
          pointHoverBackgroundColor: "#ffffff",
          pointHoverBorderColor: "#b45309"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 4,
          ticks: { stepSize: 1, display: false },
          pointLabels: {
            color: "#374151",
            font: { size: 12, weight: "700" }
          },
          grid: { color: "rgba(100, 116, 139, .24)" },
          angleLines: { color: "rgba(100, 116, 139, .24)" }
        }
      }
    }
  });
}

function createTestMixChart() {
  const chartEl = document.getElementById("testMixChart");
  if (!chartEl || !window.Chart || testMixChart) return;

  testMixChart = new Chart(chartEl, {
    type: "doughnut",
    data: {
      labels: ["Experiencia", "Cierre", "Observación", "Ajustes"],
      datasets: [
        {
          data: [20, 5, 10, 15],
          backgroundColor: ["#b45309", "#2563eb", "#15803d", "#7c3aed"],
          borderColor: "#ffffff",
          borderWidth: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 12, color: "#374151", font: { weight: "700" } }
        }
      }
    }
  });
}

function createFeedbackChart() {
  const chartEl = document.getElementById("feedbackChart");
  if (!chartEl || !window.Chart || feedbackChart) return;

  feedbackChart = new Chart(chartEl, {
    type: "bar",
    data: {
      labels: ["Claridad", "Motivación", "Inclusión", "Escalabilidad"],
      datasets: [
        {
          label: "Lectura inicial",
          data: [82, 90, 88, 76],
          backgroundColor: ["#b45309", "#2563eb", "#15803d", "#7c3aed"],
          borderRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: { color: "#64748b", callback: (value) => `${value}%` },
          grid: { color: "rgba(100, 116, 139, .18)" }
        },
        x: {
          ticks: { color: "#374151", font: { weight: "700" } },
          grid: { display: false }
        }
      }
    }
  });
}

document.querySelectorAll(".objective-card, .visual-system, .poster-hero, .flow-map-board, .challenge-card, .adapted-puzzle-board, .adapted-puzzles article, .didactic-model, .integration-notes article, .method-band, .era-strip, .prototype-shell, .flow-step, .material-card, .hypothesis-card, .hypothesis-matrix, .chart-card, .test-table-wrap, .evidence-board article, .lock-panel, .quote, .meter-card, .iteration-card, .benchmark-card, .executive").forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const initialHash = window.location.hash.replace("#", "");
if (initialHash && document.getElementById(initialHash)) {
  showSection(initialHash, false);
} else {
  document.querySelectorAll("#objetivo .reveal").forEach((element) => {
    element.classList.add("is-visible");
  });
}
