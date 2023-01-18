<script setup lang="ts">
import { Mafs, CartesianCoordinates } from "vue-mafs";
</script>

<template>
  <Mafs :height="230">
    <CartesianCoordinates />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
