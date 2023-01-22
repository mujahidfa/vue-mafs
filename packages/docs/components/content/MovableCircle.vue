<script setup lang="ts">
import { computed } from "vue";
import {
  Mafs,
  Circle,
  CartesianCoordinates,
  useMovablePoint,
  vec,
} from "vue-mafs";

const pointOnCircle = useMovablePoint([Math.sqrt(2) / 2, Math.sqrt(2) / 2]);
const r = computed(() => vec.mag(pointOnCircle.point.value));
</script>

<template>
  <Mafs :height="495">
    <CartesianCoordinates />
    <Circle :center="[0, 0]" :radius="r" />
    <pointOnCircle.element.value />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
