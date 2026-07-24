# Markdown Resume Generator Architecture

## Overview

Markdown Resume Generator is a static browser mini project that converts Markdown into a live, print-ready resume preview. It supports template selection, theme selection, draft persistence, and exports without requiring a backend or package install.

## Purpose & Goals

- Let users write a professional resume directly in Markdown.
- Provide an instant preview so resume structure is easy to refine.
- Offer multiple templates and color themes.
- Support PDF export through native browser printing.
- Keep the project dependency-free and consistent with Cradle mini-projects.

## Folder Structure

```text
markdown-resume-generator/
├── ARCHITECTURE.md  # Project architecture and maintenance notes
├── README.md        # Usage instructions and feature list
├── index.html       # Editor shell, controls, and preview layout
├── script.js        # Markdown parsing, rendering, persistence, and export logic
└── style.css        # App layout, resume templates, themes, and print styling
```

## System / Project Architecture Overview

The project follows a simple static app architecture. `index.html` defines the editor, controls, and preview container. `script.js` owns Markdown parsing, state persistence, template/theme switching, and export actions. `style.css` styles both the editor interface and the generated resume, including print-only layout rules.

```text
User opens index.html
        ↓
Saved Markdown, template, and theme load from localStorage
        ↓
Markdown input changes
        ↓
script.js parses Markdown into safe HTML
        ↓
Preview re-renders with selected template and theme classes
        ↓
User downloads Markdown, exports HTML, or prints to PDF
```

## Component Breakdown

| File | Responsibility |
|---|---|
| `index.html` | Provides the project header, toolbar, Markdown editor, preview pane, and script/style links. |
| `script.js` | Parses Markdown, updates preview, stores draft state, and handles export actions. |
| `style.css` | Defines Cradle-style UI panels, resume templates, color themes, and print CSS. |
| `README.md` | Explains features, run steps, and supported Markdown. |

## Data Flow / Execution Flow

```text
DOMContentLoaded
        ↓
Load saved draft or sample Markdown
        ↓
Attach event listeners
        ↓
Render preview
        ↓
On edit/template/theme change, parse and re-render
        ↓
Persist latest state to localStorage
```

## Key Features

- Markdown-to-resume live preview.
- Classic, Modern, and Compact templates.
- Slate, Indigo, Emerald, and Rose themes.
- Sample content reset.
- Copy Markdown, download Markdown, export HTML, and print/PDF export.
- localStorage autosave for draft and preferences.
- Print-specific CSS that hides editor controls and prints only the resume.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure, form controls, and preview container. |
| CSS3 | App layout, resume templates, themes, and print media rules. |
| Vanilla JavaScript | Markdown parsing, DOM rendering, localStorage persistence, and exports. |
| localStorage API | Saves the current draft, template, and theme. |
| Clipboard API | Copies Markdown to the clipboard. |
| Blob URL API | Downloads Markdown and HTML export files. |
| Browser Print API | Opens the print dialog for PDF export. |

## File Responsibilities

### `index.html`

- Loads shared Cradle UI tokens and button/back-home components.
- Defines template and theme selectors.
- Provides export controls for Markdown, HTML, and PDF.
- Contains the Markdown editor and live resume preview.

### `script.js`

- `initializeResumeGenerator()` loads saved state and wires controls.
- `updatePreview()` parses Markdown, applies template/theme classes, and autosaves state.
- `parseMarkdown()` converts supported Markdown lines into HTML.
- `formatInline()` supports bold, italic, and link formatting.
- `downloadMarkdown()`, `downloadResumeHtml()`, and `printResume()` handle exports.

### `style.css`

- Uses Cradle dark UI conventions for the editor interface.
- Defines resume page styling separately from the app shell.
- Adds template-specific and theme-specific classes.
- Includes print styles that isolate the resume for PDF export.

## Design Decisions

- PDF export uses `window.print()` so the project stays dependency-free.
- Markdown parsing is intentionally small and scoped to resume-friendly syntax.
- Inline HTML is escaped before formatting so user content remains safe.
- Template and theme are class-based, making future layouts easy to add.

## Known Limitations

- The parser does not support every Markdown feature.
- PDF export depends on the browser's print dialog.
- Modern template layout is intentionally conservative for print stability.

## Future Improvements

- Add import from `.md` file.
- Add more resume templates.
- Add section-specific editing helpers.
- Add page margin controls for PDF output.
