<script setup lang="ts">
import { Mafs, CartesianCoordinates } from "../src/index";
import Test from "./Test.vue";
</script>

<template>
  <Test text="Hell" />
  <Mafs :height="800" :width="300">
    <CartesianCoordinates />
  </Mafs>
</template>

<style>
@import "../src/index.css";
</style>
