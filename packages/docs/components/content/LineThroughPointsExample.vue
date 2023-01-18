<script setup lang="ts">
import {
  Mafs,
  LineThroughPoints,
  CartesianCoordinates,
  useMovablePoint,
} from "vue-mafs";

const point1 = useMovablePoint([-1, -1]);
const point2 = useMovablePoint([2, 1]);
</script>

<template>
  <Mafs :height="250" :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LineThroughPoints
      :point1="point1.point.value"
      :point2="point2.point.value"
    />
    <point1.element.value />
    <point2.element.value />
  </Mafs>
</template>
