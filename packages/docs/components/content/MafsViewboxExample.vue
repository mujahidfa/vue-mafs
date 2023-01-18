<script setup lang="ts">
import { Mafs, CartesianCoordinates, Polygon } from "vue-mafs";
</script>

<template>
  <Mafs :height="412" :viewBox="{ x: [-5, 5], y: [-5, 5] }">
    <CartesianCoordinates />
    <Polygon
      :points="[
        [-5, -5],
        [5, -5],
        [5, 5],
        [-5, 5],
      ]"
    />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
