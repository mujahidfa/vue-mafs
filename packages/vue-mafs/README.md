# vue-mafs

Vue components for creating interactive math visualizations, based on [Mafs](https://github.com/stevenpetryk/mafs).

## Installation

Install `vue-mafs`:

```sh
# Pick your poison (pnpm, npm, yarn):
pnpm install vue-mafs
npm install vue-mafs
yarn add vue-mafs
```

Import the components directly:

```vue
<script setup lang="ts">
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraphOfX,
  FunctionGraphParametric,
  labelPi,
} from "vue-mafs";
</script>

<template>
  <Mafs :viewBox="{ x: [-10, 10], y: [-2, 2] }" :preserveAspectRatio="false">
    <CartesianCoordinates
      :subdivisions="4"
      :xAxis="{ lines: Math.PI, labels: labelPi }"
    />
    <FunctionGraphOfX :y="(x: number) => Math.sin(x)" lineStyle="dashed" />
  </Mafs>
</template>

<style>
@import "vue-mafs/index.css";
</style>
```

For how to's and examples, you can refer to the [demo](../packages/demo/src/App.vue).

The docs for `vue-mafs` will come soon, but in the meantime, please refer to the [Mafs](https://mafs.dev/) documentation for further reference of features, components and composables. This should be your first source of reference for now.

## Differences with Mafs

`vue-mafs` aims to have API compatibility as close to [Mafs](https://github.com/stevenpetryk/mafs) as possible. However, there are several differences due to how Vue works:

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

### Differences in Composables (a.k.a. hooks in React)

Composables/hooks in `vue-mafs` return reactive values (ref() or computed()), which allows you to watch their changes reactively.

For example, in `useMovablePoint`,

```vue
<script setup lang="ts">
import { useMovablePoint } from "vue-mafs";
import { watchEffect } from "vue";

const { point } = useMovablePoint([0, 0]);

function setNewPointValue(newPoint) {
  // equivalent to setPoint(newPoint) in React
  point.value = newPoint;
}

watchEffect(() => {
  // Will print out point everytime there's a change to point
  console.log(point.value);
});
</script>
```

- `useMovablePoint()`:
  - It doesn't return a `setPoint`, rather a `point` ref of type `Ref<[x: number, y: number]>` that you can assign new values directly.
    ```js
    const { point } = useMovablePoint([0, 0]);
    // equivalent to setPoint(newPoint) in React
    point.value = newPoint;
    ```

## Credits

Credits to [@stevenpetryk](https://twitter.com/stevenpetryk) ([GitHub](https://github.com/stevenpetryk)) for creating the original [Mafs](https://github.com/stevenpetryk/mafs) library!
