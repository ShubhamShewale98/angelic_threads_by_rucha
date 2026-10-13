# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Product manager route

The React product manager is available at `/manage-products`; the Decap CMS remains at `/admin/`.

The manager calls `/.netlify/functions/products`. The function requires a Netlify Identity user with the `admin` role and commits JSON files in `src/data/products` using GitHub's Contents API. Configure these Netlify environment variables:

- `GITHUB_REPOSITORY`: repository in `owner/name` format.
- `GITHUB_TOKEN`: a GitHub token with Contents read/write access to that repository. Keep this value in Netlify's environment settings; never expose it as a `VITE_` variable.
- `GITHUB_BRANCH`: optional; defaults to `main`.

Enable Netlify Identity for the site and assign the `admin` role to the manager account. Netlify must deploy the site from the same GitHub repository and branch configured above. Each save or delete creates a Git commit, which triggers the normal Netlify build; newly committed products appear after that build completes.

Images can currently be entered as an existing URL or a path such as `/uploads/product.jpg`. Upload image files through Decap CMS at `/admin/` first.
