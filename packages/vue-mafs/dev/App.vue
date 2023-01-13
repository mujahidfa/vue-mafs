<script setup lang="ts">
import { Mafs, Text, Theme } from "../src";
</script>

<template>
  <Mafs>
    <Text :x="0" :y="0" attach="e" :attachDistance="25" :color="Theme.green">
      Y
    </Text>
  </Mafs>
</template>
