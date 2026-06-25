const sectionButtons = [...document.querySelectorAll(".nav button")];
const sections = [...document.querySelectorAll("main > .section")];

function showSection(id, updateHash = true) {
  const target = document.getElementById(id);
  if (!target) return;

  sections.forEach((section) => section.classList.toggle("active", section.id === id));
  sectionButtons.forEach((button) => button.classList.toggle("active", button.dataset.section === id));

  if (updateHash) history.replaceState(null, "", `#${id}`);
  requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth", block: "start" }));
}

sectionButtons.forEach((button) => {
  button.addEventListener("click", () => showSection(button.dataset.section));
});

document.querySelectorAll("[data-go]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showSection(link.dataset.go);
  });
});

const filterButtons = [...document.querySelectorAll(".chip[data-filter]")];
const postits = [...document.querySelectorAll(".postit")];
const canvasBlocks = [...document.querySelectorAll(".canvas-block")];

function applyFilter(filter) {
  filterButtons.forEach((button) => button.classList.toggle("active", button.dataset.filter === filter));

  postits.forEach((postit) => {
    const type = postit.dataset.type;
    const visible = filter === "all" || type === filter;
    postit.classList.toggle("is-hidden", !visible);
  });

  canvasBlocks.forEach((block) => {
    const hasVisible = [...block.querySelectorAll(".postit")].some((postit) => !postit.classList.contains("is-hidden"));
    block.classList.toggle("is-filtered-out", !hasVisible);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

const typeLabels = {
  jobs: "Trabajos del cliente",
  pains: "Frustraciones",
  gains: "Alegrías",
  products: "Productos y servicios",
  relievers: "Aliviadores de frustraciones",
  creators: "Creadores de alegrías"
};

const drawer = document.getElementById("drawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerClose = document.getElementById("drawerClose");
const drawerCategory = document.getElementById("drawerCategory");
const drawerTitle = document.getElementById("drawerTitle");
const drawerDetail = document.getElementById("drawerDetail");
const drawerBullets = document.getElementById("drawerBullets");
const drawerPriority = document.getElementById("drawerPriority");

function openDrawer(postit) {
  drawerCategory.textContent = typeLabels[postit.dataset.type] || "Elemento del canvas";
  drawerTitle.textContent = postit.dataset.title || "";
  drawerDetail.textContent = postit.dataset.detail || "";
  drawerPriority.textContent = `Prioridad: ${postit.dataset.priority || "—"}`;

  const bullets = (postit.dataset.bullets || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  drawerBullets.innerHTML = bullets.map((item) => `<li>${item}</li>`).join("");
  drawerBullets.hidden = bullets.length === 0;

  drawer.classList.add("is-open");
  drawerBackdrop.classList.add("is-open");
  drawerBackdrop.hidden = false;
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  drawer.classList.remove("is-open");
  drawerBackdrop.classList.remove("is-open");
  drawerBackdrop.hidden = true;
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

postits.forEach((postit) => {
  postit.addEventListener("click", () => openDrawer(postit));
});

drawerClose?.addEventListener("click", closeDrawer);
drawerBackdrop?.addEventListener("click", closeDrawer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && drawer?.classList.contains("is-open")) {
    closeDrawer();
  }
});

const initialHash = window.location.hash.replace("#", "");
if (initialHash && document.getElementById(initialHash)) {
  showSection(initialHash, false);
}
