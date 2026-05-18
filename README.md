# Resource Hub

Resource Hub is a Markdown-first resource hub for storing and organizing high-value links, references, tools, guides, and useful resources from any domain in a way that stays searchable, maintainable, and GitHub-friendly over time.

It is designed as a centralized resource hub, a categorized link collection, a personal knowledge system, a daily utility reference, and a long-term searchable archive that can scale from a handful of links to thousands of entries without needing a database or backend.

## Categories

- [Salesforce](categories/salesforce.md)
- [Chrome Extensions](categories/chrome-extensions.md)
- [JavaScript](categories/javascript.md)
- [APIs](categories/apis.md)
- [Tools](categories/dev-tools.md)
- [Debugging](categories/debugging.md)
- [Testing](categories/testing.md)
- [UI / UX](categories/ui-ux.md)
- [Productivity](categories/productivity.md)
- [Security](categories/security.md)
- [System Design](categories/system-design.md)
- [Learning](categories/learning.md)
- [Finance](categories/finance.md)
- [Career](categories/career.md)
- [Media](categories/media.md)

## Repository Structure

```text
dev-resource-hub/
|-- README.md
|-- categories/
|   |-- salesforce.md
|   |-- chrome-extensions.md
|   |-- javascript.md
|   |-- apis.md
|   |-- dev-tools.md
|   |-- debugging.md
|   |-- testing.md
|   |-- ui-ux.md
|   |-- productivity.md
|   |-- security.md
|   |-- system-design.md
|   |-- learning.md
|   |-- finance.md
|   |-- career.md
|   `-- media.md
`-- website/
    |-- index.html
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

This structure is intentionally simple and flexible. New domains can be supported by adding another Markdown file under `categories/` and linking it from this README without restructuring the repository. The `website/` folder stays separate so the GitHub-friendly Markdown source and the public-facing website do not get mixed together.

## How to Use

### Browse

Open the category that best matches the resource you need. Categories can be technical, practical, educational, topical, or personal. Each category file uses consistent headings and a standard entry structure so scanning stays fast even as the repository grows.

### Search

Use GitHub search or local editor search to find:

- resource names
- tags
- notes
- category types such as `Documentation`, `Tool`, `Tutorial`, or `Library`

Useful search examples:

- `authentication`
- `Category: Documentation`
- `Tags: salesforce, debugging`
- `Notes: browser devtools`

### Add a Resource

1. Open the correct file under `categories/`.
2. Find the most relevant section.
3. Add a new entry using the standard format.
4. Keep tags lowercase and concise.
5. Avoid duplicate resources in the same or different categories unless there is a strong reason.

Standard resource entry format:

```md
- Resource Name
	Link: https://example.com
	Category: Documentation / Tool / Tutorial / Library
	Tags: api, javascript, authentication
	Notes: Optional description
```

## Contribution Guide

### How to Add a New Resource

1. Choose the closest category file.
2. Place the entry under the most relevant section heading.
3. Use the standard entry format exactly.
4. Write a short note only if it adds useful context.
5. Check whether the resource already exists before adding it.
6. If no existing category fits, create a new file under `categories/` and add it to the README categories list.

### Formatting Rules

- Use the standard bullet-based resource format.
- Keep resource names human-readable and recognizable.
- Use valid direct links.
- Keep tags lowercase and comma-separated.
- Keep notes short and practical.
- Preserve heading structure and spacing.

### Category Selection

Choose the category based on primary use:

- put official references under the topic where you would expect to look first
- put tools under the area where they are most useful in practice
- use `Learning` for broad educational material that spans multiple topics
- use `Debugging` or `Testing` when the main value is troubleshooting or validation
- create a new category when the resource belongs to a distinct domain that does not fit the existing list cleanly

If a resource fits multiple areas, place it in the category where it is most likely to be found again quickly.

## Design Principles

- Markdown only
- GitHub-friendly navigation
- lightweight and offline-first
- scalable for future automation
- simple manual maintenance
- compatible with future search indexing and GitHub Pages publishing

## Live GitHub Page

You can browse this resource hub as a website at:

- https://kartikpatkar.github.io/resource-hub/

The GitHub Pages site is automatically generated from the Markdown and JSON data in this repository, providing a searchable and user-friendly interface for all resources.

## License

This repository is available under the MIT License.
