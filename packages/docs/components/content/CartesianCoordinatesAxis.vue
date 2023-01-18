<script setup lang="ts">
import { Mafs, CartesianCoordinates, labelPi } from "vue-mafs";

function isOdd(n: number) {
  return ((n % 2) + 2) % 2 === 0;
}
</script>

<template>
  <Mafs
    :height="700"
    :viewBox="{
      x: [-8, 8],
      y: [-Math.PI * 2, Math.PI * 2],
      padding: Math.PI / 2,
    }"
    :preserveAspectRatio="false"
  >
    <CartesianCoordinates
      :xAxis="{
        lines: 1,
        labels: (n) => (isOdd(n) ? n : ''),
      }"
      :yAxis="{
        lines: Math.PI,
        subdivisions: 4,
        labels: labelPi,
      }"
    />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
