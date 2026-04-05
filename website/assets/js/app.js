const iconMap = {
  menu: svg("M4 7h16M4 12h16M4 17h16"),
  close: svg("M6 6l12 12M18 6L6 18"),
  search: svg("M11 18a7 7 0 1 1 0-14a7 7 0 0 1 0 14Zm6-1l3 3"),
  grid: svg("M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"),
  sparkles: svg("M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Zm6 11l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14ZM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8L6 14Z"),
  clock: svg("M12 7v5l3 2M20 12a8 8 0 1 1-16 0a8 8 0 0 1 16 0Z"),
  compass: svg("M14.5 9.5l-2 5l-5 2l2-5l5-2ZM20 12a8 8 0 1 1-16 0a8 8 0 0 1 16 0Z"),
  layers: svg("M12 4l8 4l-8 4l-8-4l8-4ZM4 12l8 4l8-4M4 16l8 4l8-4"),
  globe: svg("M4 12h16M12 4a13 13 0 0 1 0 16M12 4a13 13 0 0 0 0 16M20 12a8 8 0 1 1-16 0a8 8 0 0 1 16 0Z"),
  code: svg("M8 8l-4 4l4 4M16 8l4 4l-4 4M14 4l-4 16"),
  shield: svg("M12 3l7 3v5c0 4.5-3 7.5-7 10c-4-2.5-7-5.5-7-10V6l7-3Z"),
  briefcase: svg("M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M4 9h16v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Zm0 0l3 3h10l3-3"),
  book: svg("M5 5.5A2.5 2.5 0 0 1 7.5 3H19v16H7.5A2.5 2.5 0 0 0 5 21V5.5Zm0 0V19"),
  wrench: svg("M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3l5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5l-2-2l2.5-2.5Z"),
  palette: svg("M12 4a8 8 0 1 0 0 16h1a2 2 0 0 0 0-4h-1a1.5 1.5 0 0 1 0-3h3a4 4 0 0 0 0-8h-3Zm-4 5.5h.01M7 10h.01M9 7h.01M15 7h.01"),
  bug: svg("M8 8h8M9 4l1 2M15 4l-1 2M8 12h8M6 10H4M20 10h-2M7 18l1-3M17 18l-1-3M9 8V7a3 3 0 0 1 6 0v1m-6 4a3 3 0 0 0 6 0V8H9v4Z"),
  rocket: svg("M5 15c-1 1-1.5 3-1.5 3S5.5 17.5 6.5 16.5L9 14l-3-3l-1 4Zm8.5-10.5c2.5-.2 4.7.6 6 2c1.4 1.4 2.2 3.5 2 6c-2.6.8-4.6 1.7-7.5 4.5L9 12c2.8-2.9 3.7-4.9 4.5-7.5Z"),
  check: svg("M5 12l4 4L19 6"),
};

const categoryIcons = {
  apis: "globe",
  career: "briefcase",
  "chrome-extensions": "layers",
  debugging: "bug",
  "dev-tools": "wrench",
  finance: "compass",
  javascript: "code",
  learning: "book",
  media: "palette",
  productivity: "sparkles",
  salesforce: "rocket",
  security: "shield",
  "system-design": "layers",
  testing: "check",
  "ui-ux": "palette",
};

const state = {
  resources: [],
  categories: [],
  activeCategory: "all",
  categoriesVisible: false,
  query: "",
  quickSearches: [],
  topResultsOnly: true,
};

const elements = {
  categoriesSection: document.querySelector("#categories"),
  categoryGrid: document.querySelector("#category-grid"),
  resourceGrid: document.querySelector("#resource-grid"),
  categoryFilters: document.querySelector("#category-filters"),
  resultsSummary: document.querySelector("#results-summary"),
  searchInput: document.querySelector("#search-input"),
  categoryToggle: document.querySelector("#category-toggle"),
  clearSearch: document.querySelector("#clear-search"),
  resetFilters: document.querySelector("#reset-filters"),
  resultsModeToggle: document.querySelector("#results-mode-toggle"),
  emptyState: document.querySelector("#empty-state"),
  heroMeta: document.querySelector("#hero-meta"),
  quickSearches: document.querySelector("#quick-searches"),
  menuButton: document.querySelector("#menu-button"),
  mobileNav: document.querySelector("#mobile-nav"),
  mobileOverlay: document.querySelector("#mobile-overlay"),
  mobileClose: document.querySelector("#mobile-nav-close"),
  categoryCardTemplate: document.querySelector("#category-card-template"),
  filterChipTemplate: document.querySelector("#filter-chip-template"),
  quickSearchTemplate: document.querySelector("#quick-search-template"),
  resourceCardTemplate: document.querySelector("#resource-card-template"),
};

renderStaticIcons();
bindEvents();
syncCategoryVisibility();

init().catch((error) => {
  console.error(error);
  elements.resultsSummary.textContent = "Unable to load resources right now.";
});

async function init() {
  const [resources, categories] = await Promise.all([
    fetchJson("./data/resources.json"),
    fetchJson("./data/categories.json"),
  ]);

  state.resources = resources;
  state.categories = categories;
  state.quickSearches = getPopularTags(resources).slice(0, 5);

  hydrateStats();
  renderQuickSearches();
  renderCategoryCards();
  renderFilterChips();
  renderDirectory();
}

async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
}

function bindEvents() {
  elements.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value.trim().toLowerCase();
    renderDirectory();
  });

  elements.categoryToggle?.addEventListener("click", () => {
    toggleCategories();
  });
  elements.clearSearch.addEventListener("click", resetFilters);
  elements.resetFilters?.addEventListener("click", resetFilters);
  elements.resultsModeToggle?.addEventListener("click", () => {
    state.topResultsOnly = !state.topResultsOnly;
    renderDirectory();
  });

  elements.menuButton?.addEventListener("click", () => {
    elements.mobileNav.classList.add("is-open");
    elements.mobileOverlay.classList.remove("hidden");
    elements.menuButton.setAttribute("aria-expanded", "true");
  });

  elements.mobileClose?.addEventListener("click", closeMobileNav);
  elements.mobileOverlay?.addEventListener("click", closeMobileNav);

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.getAttribute("href") === "#categories") {
        event.preventDefault();
        openCategories();
      }

      closeMobileNav();
    });
  });

  document.querySelectorAll('a[href="#categories"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openCategories();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && document.activeElement !== elements.searchInput) {
      event.preventDefault();
      elements.searchInput.focus();
    }

    if (event.key === "Escape") {
      closeMobileNav();
    }
  });

}

function hydrateStats() {
  const allTags = new Set(state.resources.flatMap((resource) => resource.tags));
  elements.heroMeta.textContent = `${state.resources.length} resources across ${state.categories.length} categories and ${allTags.size} tags.`;
}

function renderQuickSearches() {
  elements.quickSearches.innerHTML = "";

  state.quickSearches.forEach((tag) => {
    const fragment = elements.quickSearchTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".quick-search");

    button.textContent = formatLabel(tag);
    button.addEventListener("click", () => {
      state.query = tag.toLowerCase();
      state.activeCategory = "all";
      elements.searchInput.value = tag;
      renderCategoryCards();
      renderFilterChips();
      renderDirectory();
      document.querySelector("#directory").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    elements.quickSearches.append(button);
  });
}

function renderCategoryCards() {
  elements.categoryGrid.innerHTML = "";

  state.categories.forEach((category) => {
    const fragment = elements.categoryCardTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".category-card");

    button.dataset.category = category.slug;
    fragment.querySelector(".category-icon").innerHTML = getCategoryIcon(category.slug);
    fragment.querySelector(".category-name").textContent = category.name;
    fragment.querySelector(".category-meta").textContent = `${category.count} resources`;

    if (state.activeCategory === category.slug) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      state.activeCategory = category.slug;
      renderCategoryCards();
      renderFilterChips();
      renderDirectory();
      document.querySelector("#directory").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    elements.categoryGrid.append(button);
  });
}

function toggleCategories() {
  if (state.categoriesVisible) {
    closeCategories();
    return;
  }

  openCategories();
}

function openCategories() {
  state.categoriesVisible = true;
  syncCategoryVisibility();
  elements.categoriesSection?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeCategories() {
  state.categoriesVisible = false;
  syncCategoryVisibility();
}

function syncCategoryVisibility() {
  if (!elements.categoriesSection || !elements.categoryToggle) {
    return;
  }

  elements.categoriesSection.hidden = !state.categoriesVisible;
  elements.categoriesSection.classList.toggle("is-collapsed", !state.categoriesVisible);
  elements.categoryToggle.textContent = state.categoriesVisible ? "Hide categories" : "Categories";
  elements.categoryToggle.setAttribute("aria-expanded", String(state.categoriesVisible));
  document.body.classList.toggle("categories-collapsed", !state.categoriesVisible);
}

function renderFilterChips() {
  elements.categoryFilters.innerHTML = "";

  const filters = [{ slug: "all", name: "All" }, ...state.categories.map(({ slug, name }) => ({ slug, name }))];

  filters.forEach((filter) => {
    const fragment = elements.filterChipTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".filter-chip");

    button.textContent = filter.name;

    if (state.activeCategory === filter.slug) {
      button.classList.add("is-active");
    }

    button.addEventListener("click", () => {
      state.activeCategory = filter.slug;
      renderCategoryCards();
      renderFilterChips();
      renderDirectory();
    });

    elements.categoryFilters.append(button);
  });
}

function renderDirectory() {
  const filtered = getFilteredResources();
  const visible = getVisibleResources(filtered);
  renderResourceList(elements.resourceGrid, visible);

  elements.resultsSummary.textContent = buildResultsCopy(filtered.length, visible.length);
  elements.emptyState.classList.toggle("hidden", filtered.length > 0);
  updateResultsModeToggle(filtered.length);
}

function getFilteredResources() {
  return state.resources.filter((resource) => {
    const matchesCategory = state.activeCategory === "all" || resource.categorySlug === state.activeCategory;
    const haystack = [
      resource.name,
      resource.description,
      resource.category,
      resource.resourceType,
      resource.section,
      ...resource.tags,
    ]
      .join(" ")
      .toLowerCase();

    return matchesCategory && (state.query.length === 0 || haystack.includes(state.query));
  });
}

function renderResourceList(container, resources) {
  container.innerHTML = "";

  resources.forEach((resource) => {
    const fragment = elements.resourceCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".resource-card");
    const logo = fragment.querySelector(".resource-logo");

    fragment.querySelector(".resource-category-icon").innerHTML = getCategoryIcon(resource.categorySlug);
    fragment.querySelector(".resource-category").textContent = resource.category;
    fragment.querySelector(".resource-name").textContent = resource.name;
    fragment.querySelector(".resource-type").textContent = resource.resourceType;
    fragment.querySelector(".resource-description").textContent = resource.description;

    bindFavicon(logo, resource);

    const visitLink = fragment.querySelector(".visit-link");
    visitLink.href = resource.url;

    const sourceLink = fragment.querySelector(".source-link");
    sourceLink.href = resource.sourcePath;

    const tagList = fragment.querySelector(".tag-list");
    resource.tags.slice(0, 3).forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = `#${tag}`;
      tagList.append(tagElement);
    });

    container.append(card);
  });
}

function buildResultsCopy(total, visible) {
  const queryPart = state.query ? ` for "${state.query}"` : "";
  const categoryPart = state.activeCategory !== "all"
    ? ` in ${state.categories.find((item) => item.slug === state.activeCategory)?.name ?? "selected category"}`
    : " across all categories";

  const visiblePart = state.topResultsOnly && total > visible
    ? ` Showing top ${visible}.`
    : "";

  return `${total} result${total === 1 ? "" : "s"}${queryPart}${categoryPart}.${visiblePart}`;
}

function resetFilters() {
  state.query = "";
  state.activeCategory = "all";
  elements.searchInput.value = "";
  renderCategoryCards();
  renderFilterChips();
  renderDirectory();
}

function getVisibleResources(resources) {
  if (!state.topResultsOnly) {
    return resources;
  }

  const limit = window.matchMedia("(max-width: 640px)").matches ? 12 : 24;
  return resources.slice(0, limit);
}

function updateResultsModeToggle(total) {
  if (!elements.resultsModeToggle) {
    return;
  }

  const limit = window.matchMedia("(max-width: 640px)").matches ? 12 : 24;
  const hasOverflow = total > limit;
  elements.resultsModeToggle.hidden = !hasOverflow;
  elements.resultsModeToggle.textContent = state.topResultsOnly ? "Show all results" : "Top results only";
  elements.resultsModeToggle.setAttribute("aria-pressed", String(state.topResultsOnly));
}

function closeMobileNav() {
  elements.mobileNav.classList.remove("is-open");
  elements.mobileOverlay.classList.add("hidden");
  elements.menuButton?.setAttribute("aria-expanded", "false");
}

function renderStaticIcons() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = iconMap[node.dataset.icon] ?? iconMap.grid;
  });
}

function bindFavicon(image, resource) {
  const domain = getDomain(resource.url);
  if (!domain) {
    return;
  }

  image.src = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  image.alt = `${resource.name} logo`;
  image.addEventListener(
    "load",
    () => {
      image.classList.add("is-ready");
    },
    { once: true }
  );
}

function getCategoryIcon(slug) {
  return iconMap[categoryIcons[slug] ?? "grid"];
}

function getPopularTags(resources) {
  const counts = new Map();

  resources.forEach((resource) => {
    resource.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([tag]) => tag);
}

function formatLabel(value) {
  return value
    .split(/[-\s]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDomain(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

function debounce(callback, delay) {
  let timerId;

  return (...args) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

function svg(path) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`;
}