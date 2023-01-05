<script setup lang="ts">
import { Mafs, CartesianCoordinates } from "../src/index";
</script>

<template>
  <Mafs :height="800" :width="200">
    <CartesianCoordinates />
  </Mafs>
</template>

<style>
@import "../src/index.css";
</style>
