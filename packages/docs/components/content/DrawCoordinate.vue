<script setup lang="ts">
import { Mafs, CartesianCoordinates } from "vue-mafs";

defineProps({
  subdivisions: {
    type: Number,
    required: false,
    default: false,
  },
});
</script>

<template>
  <Mafs :height="230">
    <CartesianCoordinates :subdivisions="subdivisions" />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
