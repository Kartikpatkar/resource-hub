# Dev Resource Hub

Dev Resource Hub is a Markdown-first knowledge base for storing and organizing high-value developer resources in a way that stays searchable, maintainable, and GitHub-friendly over time.

It is designed as a personal developer knowledge system, a curated reference library, and a portfolio-quality repository that can scale from a handful of links to thousands of entries without needing a database or backend.

## Categories

- [Salesforce](categories/salesforce.md)
- [Chrome Extensions](categories/chrome-extensions.md)
- [JavaScript](categories/javascript.md)
- [APIs](categories/apis.md)
- [Dev Tools](categories/dev-tools.md)
- [Debugging](categories/debugging.md)
- [Testing](categories/testing.md)
- [UI / UX](categories/ui-ux.md)
- [Productivity](categories/productivity.md)
- [Security](categories/security.md)
- [System Design](categories/system-design.md)
- [Learning](categories/learning.md)

## Repository Structure

```text
dev-resource-hub/
|-- README.md
`-- categories/
		|-- salesforce.md
		|-- chrome-extensions.md
		|-- javascript.md
		|-- apis.md
		|-- dev-tools.md
		|-- debugging.md
		|-- testing.md
		|-- ui-ux.md
		|-- productivity.md
		|-- security.md
		|-- system-design.md
		`-- learning.md
```

## How to Use

### Browse

Open the category that best matches the resource you need. Each category file uses consistent headings and a standard entry structure so scanning stays fast even as the repository grows.

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

If a resource fits multiple areas, place it in the category where it is most likely to be found again quickly.

## Design Principles

- Markdown only
- GitHub-friendly navigation
- lightweight and offline-first
- scalable for future automation
- simple manual maintenance
- compatible with future search indexing and GitHub Pages publishing

## License

This repository is available under the MIT License.
