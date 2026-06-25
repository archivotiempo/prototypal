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

const initial = location.hash.replace("#", "");
if (initial && document.getElementById(initial)) {
  activateSection(initial, false);
}

const videoSlides = [
  {
    kicker: "Capítulo 1 · Propuesta",
    title: "Un archivo que convierte la historia en misión",
    copy: "El Archivo de la Historia presenta el aprendizaje como un viaje temporal cooperativo, donde cada era es un reto accesible y significativo.",
    points: ["Escape room educativo", "Narrativa histórica", "Enfoque inclusivo"]
  },
  {
    kicker: "Capítulo 2 · Prototipo",
    title: "La Maleta del Tiempo en 20 minutos",
    copy: "El prototipo no muestra el producto final: concentra una microexperiencia completa con carta, reto manipulativo, pistas y cierre visible.",
    points: ["Misión de una era", "Materiales físicos", "Web navegable"]
  },
  {
    kicker: "Capítulo 3 · Flujo",
    title: "Entrada, reto, ayuda y sello",
    copy: "El usuario recorre cinco momentos claros. La secuencia reduce carga cognitiva y permite observar dónde aparecen bloqueos reales.",
    points: ["Carta de misión", "Roles cooperativos", "Validación final"]
  },
  {
    kicker: "Capítulo 4 · DUA",
    title: "Accesibilidad integrada desde el diseño",
    copy: "Pictogramas, manipulación, lectura fácil y pistas graduadas conviven con el desafío. La ayuda no sustituye la acción del alumnado.",
    points: ["Apoyos visuales", "Pistas progresivas", "Participación real"]
  },
  {
    kicker: "Capítulo 5 · Valor",
    title: "Un prototipo que explica la idea por sí solo",
    copy: "La presentación en vídeo y la web prototipo permiten comunicar el proyecto a docentes, tribunal y usuarios sin depender solo de una explicación oral.",
    points: ["Comunicación ágil", "Testeo con usuarios", "Decisión de mejora"]
  }
];

const videoKicker = document.getElementById("videoKicker");
const videoTitle = document.getElementById("videoTitle");
const videoCopy = document.getElementById("videoCopy");
const videoPoints = document.getElementById("videoPoints");
const videoProgress = document.getElementById("videoProgress");
const videoPlay = document.getElementById("videoPlay");
const videoNext = document.getElementById("videoNext");
const videoChapterButtons = [...document.querySelectorAll("[data-video-chapter]")];

let videoIndex = 0;
let videoTimer = null;
let videoPlaying = false;

function renderVideoSlide(index) {
  const slide = videoSlides[index];
  if (!slide) return;

  videoIndex = index;
  videoKicker.textContent = slide.kicker;
  videoTitle.textContent = slide.title;
  videoCopy.textContent = slide.copy;
  videoPoints.innerHTML = slide.points.map((point) => `<li>${point}</li>`).join("");
  videoProgress.style.width = `${((index + 1) / videoSlides.length) * 100}%`;

  videoChapterButtons.forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
}

function stopVideoAutoplay() {
  videoPlaying = false;
  if (videoTimer) {
    clearInterval(videoTimer);
    videoTimer = null;
  }
  if (videoPlay) {
    videoPlay.innerHTML = '<i class="fa-solid fa-play"></i> Reproducir';
  }
}

function startVideoAutoplay() {
  stopVideoAutoplay();
  videoPlaying = true;
  if (videoPlay) {
    videoPlay.innerHTML = '<i class="fa-solid fa-pause"></i> Pausar';
  }

  videoTimer = setInterval(() => {
    const nextIndex = (videoIndex + 1) % videoSlides.length;
    renderVideoSlide(nextIndex);
  }, 5000);
}

if (videoPlay && videoNext && videoSlides.length) {
  renderVideoSlide(0);

  videoPlay.addEventListener("click", () => {
    if (videoPlaying) stopVideoAutoplay();
    else startVideoAutoplay();
  });

  videoNext.addEventListener("click", () => {
    renderVideoSlide((videoIndex + 1) % videoSlides.length);
  });

  videoChapterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      renderVideoSlide(Number(button.dataset.videoChapter));
    });
  });
}
