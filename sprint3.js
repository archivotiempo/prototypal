const navigationButtons = [...document.querySelectorAll(".sprint3-nav button")];
const sprintSections = [...document.querySelectorAll("main > .section")];

function activateSection(id, updateHash = true) {
  const target = document.getElementById(id);
  if (!target) return;

  sprintSections.forEach((section) => section.classList.toggle("active", section.id === id));
  navigationButtons.forEach((button) => button.classList.toggle("active", button.dataset.section === id));

  if (updateHash) history.replaceState(null, "", `#${id}`);
  requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
}

navigationButtons.forEach((button) => {
  button.addEventListener("click", () => activateSection(button.dataset.section));
});

document.querySelectorAll("[data-go]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    activateSection(link.dataset.go);
  });
});

const templateButtons = [...document.querySelectorAll(".s3-template-tabs button")];
const templates = [...document.querySelectorAll(".s3-template")];

templateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.template;
    templateButtons.forEach((item) => item.classList.toggle("active", item === button));
    templates.forEach((template) => template.classList.toggle("active", template.id === id));
  });
});

const scoreInputs = [...document.querySelectorAll("[data-score]")];
const averageEl = document.getElementById("scoreAverage");
const scoreBar = document.getElementById("scoreBar");
const readingEl = document.getElementById("scoreReading");

function updateScore() {
  if (!scoreInputs.length) return;
  const average = scoreInputs.reduce((sum, input) => sum + Number(input.value), 0) / scoreInputs.length;
  averageEl.textContent = average.toFixed(1).replace(".", ",");
  scoreBar.style.width = `${average / 5 * 100}%`;

  if (average >= 4.2) {
    readingEl.textContent = "Buena señal: mantener el núcleo y concentrar la iteración en las barreras detectadas.";
  } else if (average >= 3.2) {
    readingEl.textContent = "Hay potencial, pero conviene resolver las barreras antes de ampliar la experiencia a nuevas eras.";
  } else {
    readingEl.textContent = "La experiencia necesita una iteración profunda antes de volver a testearse.";
  }
}

scoreInputs.forEach((input) => input.addEventListener("input", updateScore));
updateScore();

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

const initialId = window.location.hash.slice(1);
if (initialId && document.getElementById(initialId)) activateSection(initialId, false);
