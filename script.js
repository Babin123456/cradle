const projectsGrid = document.getElementById("projects-grid");
const searchInput = document.getElementById("search");
const categoriesContainer = document.getElementById("categories");
const projectCount = document.getElementById("project-count");
const clearFiltersBtn = document.getElementById("clear-filters");

let allProjects = [];
let selectedCategory = "all";

let filterWorker;
if (window.Worker) {
  filterWorker = new Worker("./scripts/worker.js");
  filterWorker.onmessage = function (e) {
    renderProjects(e.data);
  };
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("CradleDB", 1);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("projectsStore")) {
        db.createObjectStore("projectsStore", {
          keyPath: "id",
        });
      }
    };
  });
}

function getCachedProjects(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["projectsStore"], "readonly");
    const store = transaction.objectStore("projectsStore");
    const request = store.get("projects");

    request.onerror = () => reject(request.error);

    request.onsuccess = () =>
      resolve(request.result ? request.result.data : null);
  });
}

async function fetchAndCacheProjects(db) {
  const response = await fetch("./data/projects.json");

  if (!response.ok) {
    throw new Error("Failed to load projects");
  }

  const data = await response.json();
  allProjects = data;

  if (db) {
    const transaction = db.transaction(["projectsStore"], "readwrite");
    const store = transaction.objectStore("projectsStore");

    store.put({
      id: "projects",
      data: data,
    });
  }

  return data;
}

async function loadProjects() {
  try {
    let db;

    try {
      db = await openDB();

      const cachedProjects = await getCachedProjects(db);

      if (cachedProjects && cachedProjects.length > 0) {
        allProjects = cachedProjects;

        renderCategories();
        renderProjects(allProjects);

        fetchAndCacheProjects(db)
          .then(() => {
            renderCategories();
            applyFilters();
          })
          .catch(console.error);

        return;
      }
    } catch (e) {
      console.warn("IndexedDB error:", e);
    }

    await fetchAndCacheProjects(db);

    renderCategories();
    renderProjects(allProjects);
  } catch (error) {
    console.error(error);
    projectsGrid.innerHTML = "<p>Failed to load projects.</p>";
  }
}

function renderCategories() {
  const categories = [
    "all",
    ...new Set(allProjects.map((project) => project.category)),
  ];

  categoriesContainer.innerHTML = "";

  categories.forEach((category) => {
    const isActive = category === selectedCategory;
    const btn = CradleButton.create({
      variant: isActive ? "primary" : "ghost",
      size: "sm",
      children: category.toUpperCase().replace("-", " "),
      ariaLabel: `${category.toUpperCase().replace("-", " ")} projects`,
      onClick: () => {
        selectedCategory = category;
        applyFilters();
        renderCategories();
        searchInput.focus();
      },
    });

    btn.setAttribute("aria-pressed", isActive ? "true" : "false");

    categoriesContainer.appendChild(btn);
  });
}

function renderProjects(projects) {
  projectCount.textContent = `${projects.length} projects`;

  if (!projects.length) {
    projectsGrid.innerHTML = "<p>No projects found.</p>";
    return;
  }

  projectsGrid.innerHTML = "";

  projects.forEach((project) => {
    const card = CradleCard.create({
      title: project.title,
      subtitle: project.path,
      badge: project.category,
      image: `${project.path}thumbnail.svg`,
      footer: CradleButton.create({
        variant: "outline",
        size: "sm",
        children: "Open Project",
        rightIcon: "→",
        href: project.path,
        target: "_blank",
        rel: "noopener noreferrer",
      }),
      footerAlign: "left",
    });

    projectsGrid.appendChild(card);
  });
}

function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();

  if (filterWorker) {
    filterWorker.postMessage({
      allProjects,
      selectedCategory,
      query,
    });
  } else {
    const filtered = allProjects.filter(
      (project) =>
        (selectedCategory === "all" ||
          project.category === selectedCategory) &&
        project.title.toLowerCase().includes(query)
    );

    renderProjects(filtered);
  }

  updateClearButtonVisibility(query);
}

function updateClearButtonVisibility(query) {
  const hasActiveFilters =
    query !== "" || selectedCategory !== "all";

  if (clearFiltersBtn) {
    clearFiltersBtn.hidden = !hasActiveFilters;
  }
}

function clearFilters() {
  searchInput.value = "";
  selectedCategory = "all";

  applyFilters();
  renderCategories();
  searchInput.focus();
}

searchInput.addEventListener("input", applyFilters);

if (clearFiltersBtn) {
  clearFiltersBtn.addEventListener("click", clearFilters);
}

// Keyboard Shortcuts & Helper Modal
const shortcutsBtn = document.getElementById("shortcuts-btn");
const shortcutsModal = document.getElementById("shortcuts-modal");
const shortcutsCloseBtn = document.getElementById("close-shortcuts");
const shortcutsOverlay = document.getElementById("shortcuts-overlay");

function toggleShortcutsModal(show) {
  if (!shortcutsModal) return;
  const shouldOpen = show !== undefined ? show : !shortcutsModal.classList.contains("open");
  shortcutsModal.classList.toggle("open", shouldOpen);
  shortcutsModal.setAttribute("aria-hidden", shouldOpen ? "false" : "true");
}

if (shortcutsBtn) {
  shortcutsBtn.addEventListener("click", () => toggleShortcutsModal(true));
}
if (shortcutsCloseBtn) {
  shortcutsCloseBtn.addEventListener("click", () => toggleShortcutsModal(false));
}
if (shortcutsOverlay) {
  shortcutsOverlay.addEventListener("click", () => toggleShortcutsModal(false));
}

document.addEventListener("keydown", (e) => {
  const activeElement = document.activeElement;
  const isInputFocused =
    activeElement &&
    (activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable);

  if (e.key === "Escape") {
    if (shortcutsModal && shortcutsModal.classList.contains("open")) {
      toggleShortcutsModal(false);
      return;
    }
    if (isInputFocused || searchInput.value !== "" || selectedCategory !== "all") {
      clearFilters();
      searchInput.blur();
    }
    return;
  }

  if (shortcutsModal && shortcutsModal.classList.contains("open")) {
    return;
  }

  if (
    (e.key === "/" && !isInputFocused) ||
    ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")
  ) {
    e.preventDefault();
    searchInput.focus();
    searchInput.select();
    return;
  }

  if (e.key === "?" && !isInputFocused) {
    e.preventDefault();
    toggleShortcutsModal(true);
    return;
  }

  if ((e.key === "t" || e.key === "T") && !isInputFocused) {
    if (window.CradleThemeToggle && typeof window.CradleThemeToggle.toggle === "function") {
      window.CradleThemeToggle.toggle();
    } else {
      const isLight = document.documentElement.classList.toggle("light-theme");
      localStorage.setItem("theme", isLight ? "light" : "dark");
    }
    return;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  loadProjects();
});

