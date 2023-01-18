<script setup lang="ts">
import {
  Mafs,
  LinePointSlope,
  CartesianCoordinates,
  useMovablePoint,
} from "vue-mafs";

const point = useMovablePoint([-1, -1]);
const slope = useMovablePoint([0, 1], {
  constrain: "vertical",
});
</script>

<template>
  <Mafs :height="250" :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LinePointSlope :point="point.point.value" :slope="slope.y.value" />
    <point.element.value />
    <slope.element.value />
  </Mafs>
</template>
