# vue-mafs

Vue components for creating interactive math visualizations, based on [Mafs](https://github.com/stevenpetryk/mafs).

## Installation

```sh
# Pick your poison (pnpm, npm, yarn):
pnpm install vue-mafs
npm install vue-mafs
yarn add vue-mafs
```

Here's a minimal project example for your reference: TODO

## Differences with Mafs

`vue-mafs` aims to have API compatibility as close to [Mafs](https://github.com/stevenpetryk/mafs) as possible. However, there are differences due to how Vue works:

### Component renames (note the absence of the `.`):

| `Mafs` name                    | `vue-mafs` name               |
| ------------------------------ | ----------------------------- |
| `<FunctionGraph.OfX />`        | `<FunctionGraphOfX />`        |
| `<FunctionGraph.Parametric />` | `<FunctionGraphParametric />` |
| `<Line.PointAngle />`          | `<LinePointAngle />`          |
| `<Line.PointSlope />`          | `<LinePointSlope />`          |
| `<Line.Segment />`             | `<LineSegment />`             |
| `<Line.ThroughPoints />`       | `<LineThroughPoints />`       |

### Props differences:

- `<Mafs />`
  - `ssr` prop is removed. It can be implemented if it's needed in Vue's SSR story (feel free to open an issue).
- `<FunctionGraphOfX />`:
  - `style` prop is renamed to `lineStyle` so that it doesn't clash with the `style` attribute.
  - `svgPathProps` prop is removed and not needed because Vue supports inheritable attributes by default.
- `<FunctionGraphParametric />`:
  - `style` prop is renamed to `lineStyle` so that it doesn't clash with the `style` attribute.
  - `svgPathProps` prop is removed and not needed because Vue supports inheritable attributes by default.
- `<LinePointAngle />`, `<LinePointSlope />`, `<LineSegment />`, `<LineThroughPoints />`:
  - `style` prop is renamed to `lineStyle` so that it doesn't clash with the `style` attribute.
- `<Circle />` and `<Ellipse />`:
  - `style` prop is renamed to `strokeStyle` so that it doesn't clash with the `style` attribute.
  - `svgEllipseProps` prop is removed and not needed because Vue supports inheritable attributes by default.
- `<Point />`:
  - `svgCircleProps` prop is removed and not needed because Vue supports inheritable attributes by default.
- `<Polygon />`:
  - `svgPolygonProps` prop is removed and not needed because Vue supports inheritable attributes by default.
- `<Text />`:
  - `svgTextProps` prop is removed and not needed because Vue supports inheritable attributes by default.
- `<Vector />`:
  - `svgLineProps` prop is removed and not needed because Vue supports inheritable attributes by default.

### Differences in Composition functions (a.k.a. hooks in React)

Compositions/hooks in `vue-mafs` return reactive values (ref() or computed()), which allows you to watch their changes reactively.

- `useMovablePoint()`:
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
pnpm test-unit
```

### Run End-to-End Tests with [Playwright](https://playwright.dev)

```sh
# Install browsers for the first run
npx playwright install

# When testing on CI, must build the project first
pnpm build

# Runs the end-to-end tests
pnpm test-e2e
# Runs the tests only on Chromium
pnpm test-e2e --project=chromium
# Runs the tests of a specific file
pnpm test-e2e tests/example.spec.ts
# Runs the tests in debug mode
pnpm test-e2e --debug
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
