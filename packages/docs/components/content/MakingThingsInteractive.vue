<script setup lang="ts">
import {
  Mafs,
  CartesianCoordinates,
  PlotOfX,
  labelPi,
  useMovablePoint,
} from "vue-mafs";

const phase = useMovablePoint([0, 0], {
  constrain: "horizontal",
});
</script>

<template>
  <Mafs :viewBox="{ x: [-10, 10], y: [-2, 2] }" :preserveAspectRatio="false">
    <CartesianCoordinates
      :subdivisions="4"
      :xAxis="{ lines: Math.PI, labels: labelPi }"
    />
    <PlotOfX :y="(x) => Math.sin(x - phase.x.value)" />
    <phase.element.value />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
