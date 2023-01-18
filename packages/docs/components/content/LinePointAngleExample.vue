<script setup lang="ts">
import {
  Mafs,
  LinePointAngle,
  CartesianCoordinates,
  useMovablePoint,
} from "vue-mafs";

const point = useMovablePoint([-1, -1]);
</script>

<template>
  <Mafs :height="250" :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LinePointAngle :point="point.point.value" :angle="Math.PI / 6" />
    <point.element.value />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
