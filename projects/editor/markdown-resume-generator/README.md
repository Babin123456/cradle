# Markdown Resume Generator

Markdown Resume Generator is a browser-based editor mini project that turns Markdown into a professional resume preview. It includes multiple templates, theme choices, live preview, Markdown download, HTML export, and PDF export through the browser print dialog.

## Features

- Live resume preview while typing Markdown.
- Three templates: Classic, Modern, and Compact.
- Four themes: Slate, Indigo, Emerald, and Rose.
- Sample professional resume content.
- Copy Markdown to clipboard.
- Download the source resume as `.md`.
- Export a standalone `.html` resume.
- Export to PDF using the browser's print/save-as-PDF flow.
- Autosaves draft Markdown, selected template, and selected theme in `localStorage`.

## How to Run

Open `index.html` directly in a browser, or run the repository with a local server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/projects/editor/markdown-resume-generator/
```

## Supported Markdown

- `#` main heading
- `##` section headings
- `###` role/project headings
- Bullet lists using `-` or `*`
- Bold text using `**text**`
- Italic text using `*text*`
- Links using `[label](https://example.com)`

## Dependencies

No new dependencies are required. The project uses HTML, CSS, vanilla JavaScript, and browser APIs.
