<script setup lang="ts">
const props = defineProps<{ text: string }>();

const cleaned = props.text.toUpperCase();
</script>

<template>
  <h1>{{ text.toUpperCase() }}</h1>
</template>
