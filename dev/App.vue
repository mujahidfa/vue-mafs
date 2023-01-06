<script setup lang="ts">
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraphOfX,
  FunctionGraphParametric,
  labelPi,
  Theme,
} from "../src/index";
</script>

<template>
  <Mafs :viewBox="{ x: [-3, 3], y: [-3, 3] }">
    <CartesianCoordinates />
    <FunctionGraphParametric
      :xy="
        (t) => [
          (t / 4) * Math.cos(t * 2 * Math.PI),
          (t / 4) * Math.sin(t * 2 * Math.PI),
        ]
      "
      :t="[0, 8]"
      :color="Theme.blue"
    />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ x: [-10, 10], y: [-2, 2] }" :preserveAspectRatio="false">
    <CartesianCoordinates
      :subdivisions="4"
      :xAxis="{ lines: Math.PI, labels: labelPi }"
    />
    <FunctionGraphOfX :y="(x: number) => Math.sin(x)" lineStyle="dashed" />
  </Mafs>

  <div class="divider"></div>

  <Mafs :height="300" :width="300">
    <CartesianCoordinates :subdivisions="4" />
  </Mafs>

  <div class="divider"></div>

  <Mafs>
    <CartesianCoordinates />
  </Mafs>
</template>

<style>
@import "../src/index.css";
.divider {
  margin: 30px;
}
</style>
