#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const categoriesDir = path.resolve(repoRoot, "..", "categories");
const outputDir = path.resolve(repoRoot, "data");
const repositoryBaseUrl = "https://github.com/Kartikpatkar/dev-resource-hub/blob/main";

const categoryDescriptions = {
  apis: "API references, tools, mock services, and public data endpoints.",
  career: "Career planning, salaries, interview prep, and growth resources.",
  "chrome-extensions": "Browser extensions that improve workflows and everyday browsing.",
  debugging: "Troubleshooting, inspection, and issue diagnosis references.",
  "dev-tools": "Developer-oriented tools, runtimes, and technical inspection utilities.",
  finance: "Finance and market-research resources for tracking and analysis.",
  javascript: "JavaScript references, libraries, and core learning materials.",
  learning: "Learning platforms, skill-building tools, and structured practice resources.",
  media: "Media creation, video editing, image utilities, and visual publishing tools.",
  productivity: "Workflow, organization, note-taking, and general-use utility tools.",
  salesforce: "Salesforce resources, tools, references, and platform-specific learning.",
  security: "Security references, tooling, and secure-development guidance.",
  "system-design": "Architecture, scalability, and system-design learning resources.",
  testing: "Testing frameworks, QA references, and validation workflows.",
  "ui-ux": "UI systems, visual design references, assets, and accessibility tools.",
};

const files = fs
  .readdirSync(categoriesDir)
  .filter((fileName) => fileName.endsWith(".md"))
  .sort();

const resources = [];
const categories = [];
let order = 1;

for (const fileName of files) {
  const absolutePath = path.join(categoriesDir, fileName);
  const content = fs.readFileSync(absolutePath, "utf8");
  const parsed = parseCategoryFile(content, fileName, order);

  order += parsed.resources.length;
  resources.push(...parsed.resources);
  categories.push(parsed.category);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "resources.json"), JSON.stringify(resources, null, 2) + "\n");
fs.writeFileSync(path.join(outputDir, "categories.json"), JSON.stringify(categories, null, 2) + "\n");

console.log(`Generated ${resources.length} resources across ${categories.length} categories.`);

function parseCategoryFile(content, fileName, startOrder) {
  const lines = content.split(/\r?\n/);
  const slug = fileName.replace(/\.md$/, "");
  const titleLine = lines.find((line) => line.startsWith("# ")) ?? "# Category";
  const name = titleLine.replace(/^#\s+/, "").replace(/\s+Resources$/, "").trim();

  let currentSection = "General";
  let currentResource = null;
  let resourceOrder = startOrder;
  const parsedResources = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (rawLine.startsWith("## ")) {
      currentSection = line.replace(/^##\s+/, "").trim();
      continue;
    }

    if (line.startsWith("- ")) {
      if (currentResource) {
        parsedResources.push(finalizeResource(currentResource));
      }

      currentResource = {
        id: `${slug}-${slugify(line.replace(/^-\s+/, ""))}`,
        name: line.replace(/^-\s+/, "").trim(),
        category: name,
        categorySlug: slug,
        section: currentSection,
        resourceType: "Resource",
        description: "",
        tags: [],
        url: "",
        sourcePath: `${repositoryBaseUrl}/categories/${fileName}`,
        order: resourceOrder,
        featured: parsedResources.length === 0,
      };

      resourceOrder += 1;
      continue;
    }

    if (!currentResource || line.length === 0) {
      continue;
    }

    if (line.startsWith("Link:")) {
      currentResource.url = line.replace(/^Link:\s*/, "").trim();
      continue;
    }

    if (line.startsWith("Category:")) {
      currentResource.resourceType = line.replace(/^Category:\s*/, "").trim();
      continue;
    }

    if (line.startsWith("Tags:")) {
      currentResource.tags = line
        .replace(/^Tags:\s*/, "")
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);
      continue;
    }

    if (line.startsWith("Notes:")) {
      currentResource.description = line.replace(/^Notes:\s*/, "").trim();
    }
  }

  if (currentResource) {
    parsedResources.push(finalizeResource(currentResource));
  }

  return {
    resources: parsedResources,
    category: {
      slug,
      name,
      count: parsedResources.length,
      description: categoryDescriptions[slug] ?? `${name} resources from the Markdown hub.`,
      sourcePath: `${repositoryBaseUrl}/categories/${fileName}`,
    },
  };
}

function finalizeResource(resource) {
  return {
    ...resource,
    description: resource.description || `${resource.name} in ${resource.category}.`,
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}