<script setup lang="ts">
import {
  Mafs,
  Theme,
  Polygon,
  CartesianCoordinates,
  useMovablePoint,
} from "vue-mafs";

const a = [2, 0] as [number, number];
const b = [-2, 0] as [number, number];
const c = useMovablePoint([0, 2]);
</script>

<template>
  <Mafs :height="520">
    <CartesianCoordinates />
    <Polygon :points="[[c.x.value, -c.y.value], a, b]" strokeStyle="dashed" />
    <Polygon :points="[c.point.value, a, b]" :color="Theme.blue" />
    <c.element.value />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
