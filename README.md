# mafs-vue

This template should help get you started developing with Vue 3 in Vite.

## Differences with Mafs React

### Components

`<MafsView />`

- `ssr` prop is removed. It can be implemented if it's needed in Vue's SSR story (feel free to open an issue).

`<FunctionGraphOfX />`

- `style` prop is renamed to `lineStyle` so that it doesn't clash with the `style` attribute.
- `svgPathProps` prop is removed because Vue supports inheritable attributes by default.

`<FunctionGraphParametric />`

- `style` prop is renamed to `lineStyle` so that it doesn't clash with the `style` attribute.
- `svgPathProps` prop is removed because Vue supports inheritable attributes by default.

### Composition functions

`useMovablePoint`

- It doesn't return a `setPoint`, rather a `point` ref of type `Ref<[x: number, y: number]>` that you can assign new values directly.
  ```js
  const { point } = useMovablePoint([0, 0]);
  // equivalent to setPoint(newPoint) in React
  point.value = newPoint;
  ```

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test:e2e
# Runs the tests only on Chromium
pnpm test:e2e --project=chromium
# Runs the tests of a specific file
pnpm test:e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test:e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
