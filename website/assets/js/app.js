const state = {
  resources: [],
  categories: [],
  activeCategory: "all",
  query: "",
};

const elements = {
  categoryGrid: document.querySelector("#category-grid"),
  featuredGrid: document.querySelector("#featured-grid"),
  recentGrid: document.querySelector("#recent-grid"),
  resourceGrid: document.querySelector("#resource-grid"),
  categoryFilters: document.querySelector("#category-filters"),
  resultsSummary: document.querySelector("#results-summary"),
  searchInput: document.querySelector("#search-input"),
  clearSearch: document.querySelector("#clear-search"),
  emptyState: document.querySelector("#empty-state"),
  statResources: document.querySelector("#stat-resources"),
  statCategories: document.querySelector("#stat-categories"),
  statTags: document.querySelector("#stat-tags"),
  categoryCardTemplate: document.querySelector("#category-card-template"),
  filterChipTemplate: document.querySelector("#filter-chip-template"),
  resourceCardTemplate: document.querySelector("#resource-card-template"),
};

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

  hydrateStats();
  bindEvents();
  renderCategoryCards();
  renderFilterChips();
  renderSpotlights();
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

  elements.clearSearch.addEventListener("click", () => {
    state.query = "";
    state.activeCategory = "all";
    elements.searchInput.value = "";
    renderCategoryCards();
    renderFilterChips();
    renderDirectory();
  });
}

function hydrateStats() {
  const allTags = new Set(state.resources.flatMap((resource) => resource.tags));

  elements.statResources.textContent = state.resources.length;
  elements.statCategories.textContent = state.categories.length;
  elements.statTags.textContent = allTags.size;
}

function renderCategoryCards() {
  elements.categoryGrid.innerHTML = "";

  state.categories.forEach((category) => {
    const fragment = elements.categoryCardTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".category-card");

    button.dataset.category = category.slug;
    button.querySelector(".category-name").textContent = category.name;
    button.querySelector(".category-meta").textContent = `${category.count} resources`;

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

function renderFilterChips() {
  elements.categoryFilters.innerHTML = "";

  const filters = [{ slug: "all", name: "All" }, ...state.categories.map(({ slug, name }) => ({ slug, name }))];

  filters.forEach((filter) => {
    const fragment = elements.filterChipTemplate.content.cloneNode(true);
    const button = fragment.querySelector(".filter-chip");

    button.textContent = filter.name;
    button.dataset.category = filter.slug;

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

function renderSpotlights() {
  const featured = state.resources.filter((resource) => resource.featured).slice(0, 6);
  const recent = [...state.resources].sort((left, right) => right.order - left.order).slice(0, 6);

  renderResourceList(elements.featuredGrid, featured);
  renderResourceList(elements.recentGrid, recent);
}

function renderDirectory() {
  const filtered = getFilteredResources();
  renderResourceList(elements.resourceGrid, filtered);

  elements.resultsSummary.textContent = buildResultsCopy(filtered.length);
  elements.emptyState.classList.toggle("hidden", filtered.length > 0);
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

    const matchesQuery = state.query.length === 0 || haystack.includes(state.query);
    return matchesCategory && matchesQuery;
  });
}

function renderResourceList(container, resources) {
  container.innerHTML = "";

  resources.forEach((resource) => {
    const fragment = elements.resourceCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".resource-card");

    card.querySelector(".resource-category").textContent = resource.category;
    card.querySelector(".resource-name").textContent = resource.name;
    card.querySelector(".resource-type").textContent = resource.resourceType;
    card.querySelector(".resource-description").textContent = resource.description;

    const visitLink = card.querySelector(".visit-link");
    visitLink.href = resource.url;

    const sourceLink = card.querySelector(".source-link");
    sourceLink.href = resource.sourcePath;

    const tagList = card.querySelector(".tag-list");
    resource.tags.slice(0, 4).forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = `#${tag}`;
      tagList.append(tagElement);
    });

    container.append(card);
  });
}

function buildResultsCopy(total) {
  const queryPart = state.query ? ` for "${state.query}"` : "";
  const categoryPart = state.activeCategory !== "all"
    ? ` in ${state.categories.find((item) => item.slug === state.activeCategory)?.name ?? "selected category"}`
    : " across all categories";

  return `${total} result${total === 1 ? "" : "s"}${queryPart}${categoryPart}.`;
}