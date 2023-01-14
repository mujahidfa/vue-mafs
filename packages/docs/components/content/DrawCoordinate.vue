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
  <Mafs>
    <CartesianCoordinates :subdivisions="subdivisions" />
  </Mafs>
</template>
