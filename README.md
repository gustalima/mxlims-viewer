# mxlims-viewer

[![Deploy to Firebase Hosting](https://github.com/gustalima/mxlims-viewer/actions/workflows/firebase-deploy.yml/badge.svg)](https://github.com/gustalima/mxlims-viewer/actions/workflows/firebase-deploy.yml)
[![Release](https://img.shields.io/badge/release-v0.1.0-blue)](https://github.com/gustalima/mxlims-viewer/releases/tag/v0.1.0)

A browser-based viewer for the **MXLIMS JSON format** used to describe macromolecular crystallography shipments — including dewars, pucks, and pin samples.

---

## Overview

Upload an MXLIMS JSON file and instantly browse its contents:

- Shipment metadata, proposal codes, and contact information
- Dewars grouped under their shipment, all expanded by default
- Puck diagrams (16-position UniPuck layout) with colour-coded pins
- Sample details (name, barcode, loop type, holder length, UUID) in per-pin tooltips
- Summary table listing every pin across all pucks (hidden on mobile)

---

## MXLIMS Data Model

The MXLIMS format is defined by the Python pydantic data model in:

> **[GPhL / mxlims\_data\_model](https://github.com/GPhL/mxlims_data_model)**
> *(replace with the actual repository URL if different)*

### JavaScript validator

[`src/utils/mxlims-validator.ts`](https://github.com/gustalima/mxlims-viewer/blob/main/src/utils/mxlims-validator.ts)
is a faithful port of the Python pydantic validators into TypeScript.
It checks the structural requirements of an MXLIMS document —
`mxlimsType` discrimination, required string/array fields, and `$ref` pointer integrity —
and returns a typed `ValidationResult` with a list of field-level errors.

[`src/utils/mxlims-parser.ts`](https://github.com/gustalima/mxlims-viewer/blob/main/src/utils/mxlims-parser.ts)
resolves `$ref` pointers and assembles the flat JSON object map into the
`ResolvedShipment → ResolvedDewar → ResolvedPuck → ResolvedPin` tree consumed by the UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime / package manager | [Bun](https://bun.sh) |
| Build tool | [Vite](https://vite.dev) |
| UI framework | [React 19](https://react.dev) with React Compiler |
| Component library | [MUI v9](https://mui.com) |
| Language | TypeScript (strict) |
| Hosting | Firebase Hosting |
| CI / CD | GitHub Actions |

---

## Development

```bash
# Install dependencies
bun install

# Start dev server (hot-reload)
bun run dev

# Type-check + production build
bun run build

# Preview the production build locally
bun run preview
```

---

## Deployment

Every push to `main` is built and deployed to **Firebase Hosting (production)** via the
[`firebase-deploy`](.github/workflows/firebase-deploy.yml) workflow.

Pull requests receive an **ephemeral preview URL** (expires after 7 days), posted automatically as a PR comment.

---

## License

[MIT](LICENSE)
