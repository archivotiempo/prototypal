const navigationButtons = [...document.querySelectorAll(".final-nav button")];
const finalSections = [...document.querySelectorAll("main > .section")];

function activateSection(id, updateHash = true) {
  const target = document.getElementById(id);
  if (!target) return;

  finalSections.forEach((section) => section.classList.toggle("active", section.id === id));
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

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

const initial = location.hash.replace("#", "");
if (initial && document.getElementById(initial)) {
  activateSection(initial, false);
}
