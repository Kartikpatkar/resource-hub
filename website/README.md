# Website Layer

This folder contains the standalone website for the Resource Hub repository.

## Product Direction

The website is intentionally separate from the root Markdown resource system:

- the root repository stays GitHub-friendly and easy to edit
- this folder provides a one-page, mobile-first discovery experience
- website data is generated from the Markdown files in `../categories/`

## MVP Scope

The website is a single-page application with these sections:

1. Header navigation
2. Hero with prominent search
3. Category grid
4. Featured resources
5. Recently added resources
6. Full searchable directory
7. About section
8. Footer

## User Experience Goals

- find resources in under 5 seconds
- instant client-side search
- easy category discovery
- strong mobile usability
- lightweight and fast loading

## Data Flow

Source of truth:

- `../categories/*.md`

Generated website data:

- `data/resources.json`
- `data/categories.json`

Sync command:

```bash
node website/scripts/sync-resources.js
```

Quick local preview:

```bash
cd website
python3 -m http.server 8000
```

## Data Schema

Each resource in `data/resources.json` uses this shape:

```json
{
  "id": "media-canva",
  "name": "Canva",
  "category": "Media",
  "categorySlug": "media",
  "section": "Visual Creation",
  "resourceType": "Tool",
  "description": "Widely used design tool for social graphics, presentations, and lightweight visual work.",
  "tags": ["design", "graphics", "presentations", "content"],
  "url": "https://www.canva.com/",
  "sourcePath": "../categories/media.md",
  "order": 1,
  "featured": true
}
```

Each category in `data/categories.json` uses this shape:

```json
{
  "slug": "media",
  "name": "Media",
  "count": 10,
  "description": "Media creation, video editing, image utilities, and visual publishing tools.",
  "sourcePath": "../categories/media.md"
}
```

## Folder Structure

```text
website/
|-- index.html
|-- README.md
|-- assets/
|   |-- css/
|   |   `-- styles.css
|   `-- js/
|       `-- app.js
|-- data/
|   |-- categories.json
|   `-- resources.json
`-- scripts/
    `-- sync-resources.js
```

## Notes

- This first version is framework-free on purpose.
- Search is fully client-side for simplicity and speed.
- The next step after scaffolding is local preview and iteration on content density, card layout, and deployment.