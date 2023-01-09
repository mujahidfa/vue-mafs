<script setup lang="tsx">
import {
  Mafs,
  Transform,
  Vector,
  CartesianCoordinates,
  useMovablePoint,
  Circle,
  Polygon,
  vec,
  Theme,
} from "vue-mafs";
import clamp from "lodash/clamp";
import { defineComponent } from "vue";

const SnapPoint = defineComponent({
  setup() {
    return () => (
      <Mafs viewBox={{ x: [-8, 8], y: [-2, 2] }}>
        <CartesianCoordinates xAxis={{ labels: false, axis: false }} />

        <Transform translate={[-3, 0]}>
          <Grid />
        </Transform>

        <Transform translate={[3, 0]}>
          <Radial />
        </Transform>
      </Mafs>
    );
  },
});

const Grid = defineComponent({
  setup() {
    const { point, element } = useMovablePoint([1, 1], {
      // Constrain this point to whole numbers inside of a rectangle
      constrain: ([x, y]) => [
        clamp(Math.round(x), -2, 2),
        clamp(Math.round(y), -2, 2),
      ],
    });

    return () => (
      <>
        <Vector tail={[0, 0]} tip={point.value} />

        <Polygon
          points={[
            [-2, -2],
            [2, -2],
            [2, 2],
            [-2, 2],
          ]}
          color={Theme.blue}
        />
        <element.value />
      </>
    );
  },
});

const Radial = defineComponent({
  setup() {
    const radius = 2;
    const { point, element } = useMovablePoint([0, radius], {
      // Constrain this point to specific angles from the center
      constrain: (point) => {
        const angle = Math.atan2(point[1], point[0]);
        const snap = Math.PI / 16;
        const roundedAngle = Math.round(angle / snap) * snap;
        return vec.rotate([radius, 0], roundedAngle);
      },
    });

    return () => (
      <>
        <Circle
          center={[0, 0]}
          radius={radius}
          color={Theme.blue}
          fillOpacity={0}
        />
        <Vector tail={[0, 0]} tip={point.value} />
        <element.value />
      </>
    );
  },
});
</script>

<template>
  <SnapPoint />
</template>
