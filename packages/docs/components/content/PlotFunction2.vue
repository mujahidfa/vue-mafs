<script setup lang="ts">
import { Mafs, CartesianCoordinates, PlotOfX, labelPi } from "vue-mafs";
</script>

<template>
  <Mafs :viewBox="{ x: [-10, 10], y: [-2, 2] }" :preserveAspectRatio="false">
    <CartesianCoordinates
      :subdivisions="4"
      :xAxis="{ lines: Math.PI, labels: labelPi }"
    />
    <PlotOfX :y="(x) => Math.sin(x)" />
  </Mafs>
</template>
