const sectionButtons = document.querySelectorAll(".nav button");
const sections = document.querySelectorAll(".section");
const chips = document.querySelectorAll(".chip");
const postits = document.querySelectorAll(".postit");
const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerClose = document.getElementById("drawerClose");
const drawerCategory = document.getElementById("drawerCategory");
const drawerTitle = document.getElementById("drawerTitle");
const drawerDetail = document.getElementById("drawerDetail");
const drawerBullets = document.getElementById("drawerBullets");
const drawerPriority = document.getElementById("drawerPriority");
const statNumbers = document.querySelectorAll(".stat strong");

const categoryNames = {
  jobs: "Customer Jobs · Trabajos del usuario",
  pains: "Pains · Frustraciones",
  gains: "Gains · Alegrías",
  products: "Productos y servicios",
  relievers: "Pain Relievers · Aliviadores",
  creators: "Gain Creators · Creadores"
};

function showSection(id, updateHash = true) {
  sections.forEach((section) => {
    section.classList.toggle("active", section.id === id);
  });

  sectionButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.section === id);
  });

  if (updateHash) {
    history.replaceState(null, "", `#${id}`);
  }

  const main = document.querySelector("main");
  if (main) {
    requestAnimationFrame(() => {
      document.querySelectorAll(`#${id} .reveal`).forEach((element) => {
        element.classList.add("is-visible");
      });
      main.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  closeDrawer();
}

function closeDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  drawerBackdrop.hidden = true;
}

function openDrawer(postit) {
  const type = postit.dataset.type;
  const bullets = (postit.dataset.bullets || "").split("|").filter(Boolean);

  drawerCategory.textContent = categoryNames[type] || "Elemento del canvas";
  drawerTitle.textContent = postit.dataset.title || "";
  drawerDetail.textContent = postit.dataset.detail || "";
  drawerPriority.textContent = `Prioridad: ${postit.dataset.priority || "Sin definir"}`;
  drawerBullets.innerHTML = "";

  bullets.forEach((text) => {
    const item = document.createElement("li");
    item.textContent = text;
    drawerBullets.appendChild(item);
  });

  drawerBackdrop.hidden = false;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  drawerClose.focus();
}

function setFilter(filter, activeChip) {
  chips.forEach((chip) => {
    chip.classList.toggle("active", chip === activeChip);
  });

  postits.forEach((postit) => {
    const visible = filter === "all" || postit.dataset.type === filter;
    postit.classList.toggle("hidden-by-filter", !visible);
  });

  document.querySelectorAll(".canvas-panel").forEach((panel) => {
    const hasVisibleItems = panel.querySelector(".postit:not(.hidden-by-filter)");
    panel.style.opacity = hasVisibleItems ? "1" : ".45";
  });
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

chips.forEach((chip) => {
  chip.addEventListener("click", () => setFilter(chip.dataset.filter, chip));
});

postits.forEach((postit) => {
  postit.addEventListener("click", () => openDrawer(postit));
});

drawerClose.addEventListener("click", closeDrawer);
drawerBackdrop.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeDrawer();
  }
});

const printButton = document.getElementById("printBtn");
if (printButton) {
  printButton.addEventListener("click", () => window.print());
}

const resetButton = document.getElementById("resetBtn");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    const allChip = document.querySelector('.chip[data-filter="all"]');
    setFilter("all", allChip);
    closeDrawer();
    showSection("canvas");
  });
}

const adaptationCount = document.getElementById("adaptationCount");
if (adaptationCount) {
  adaptationCount.textContent = postits.length;
}

document.querySelectorAll(".canvas-panel, .priority-card, .flow-step, .insight-card, .fit-strip, .executive, .result-bars-wrap").forEach((element) => {
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

function animateNumber(element) {
  const raw = element.textContent.trim();
  const value = Number.parseInt(raw, 10);
  if (!Number.isFinite(value)) return;

  const suffix = raw.replace(String(value), "");
  const duration = 750;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(value * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const numberObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateNumber(entry.target);
      numberObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

statNumbers.forEach((number) => numberObserver.observe(number));

const initialHash = window.location.hash.replace("#", "");
if (initialHash && document.getElementById(initialHash)) {
  showSection(initialHash, false);
}
