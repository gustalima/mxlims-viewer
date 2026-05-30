# Unused Packages

All packages in `package.json` are actively used. No packages to remove.

## Audit

| Package | Used by |
|---|---|
| `@emotion/react` | Required peer dependency of MUI v9 |
| `@emotion/styled` | Required peer dependency of MUI v9 (internal styled components) |
| `@fontsource/roboto` | `src/main.tsx` — font imports |
| `@mui/icons-material` | `DewarPanel`, `FileUpload`, `App` |
| `@mui/material` | All components |
| `react` | All components and hooks |
| `react-dom` | `src/main.tsx` |
| `@types/react` | TypeScript types |
| `@types/react-dom` | TypeScript types |
| `@vitejs/plugin-react` | `vite.config.ts` |
| `babel-plugin-react-compiler` | `vite.config.ts` — React Compiler |
| `typescript` | Build pipeline |
| `vite` | Build tool |

## Notes

- **`@astex-p2/react-toolkit`** — mentioned in project conventions but not installed.
  This project has no server queries or mutations (it uses the local `FileReader` API),
  so there are no query/mutation types to source from that package.
  If data fetching is added in the future, install the package and import types from
  `@astex-p2/react-toolkit/types`.
