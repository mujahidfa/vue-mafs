<script setup lang="ts">
import { Mafs, CartesianCoordinates, PlotOfX } from "vue-mafs";
</script>

<template>
  <Mafs :height="253">
    <CartesianCoordinates :subdivisions="4" />
    <PlotOfX :y="(x) => Math.sin(x)" />
  </Mafs>
</template>
