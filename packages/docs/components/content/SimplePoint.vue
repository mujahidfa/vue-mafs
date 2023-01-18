<script setup lang="ts">
import { Mafs, Point, CartesianCoordinates } from "vue-mafs";
</script>

<template>
  <Mafs :height="254">
    <CartesianCoordinates />
    <Point :x="1" :y="1" />
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
