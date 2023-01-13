<script setup lang="ts">
import {
  Mafs,
  useMovablePoint,
  PlotOfX,
  Polygon,
  CartesianCoordinates,
  useStopwatch,
  ConstraintFunction,
} from "vue-mafs";

import range from "lodash/range";
import { easeInOutCubic } from "js-easing-functions";
import { computed, onMounted, ref, watch } from "vue";

interface Partition {
  polygon: [number, number][];
  area: number;
}

// Inputs
const numPartitions = 40;

const from = -0.25;
const to = 1.55;

const xBounds: [number, number] = [-0.4, 1.7];

const duration = ref(2);
const { time, start } = useStopwatch({
  endTime: duration.value,
});
const value = easeInOutCubic(time.value, 0, 1, duration.value);

onMounted(() => {
  start();
});

watch(
  [time, duration],
  () => {
    if (time === duration) {
      ready.value = true;
    }
  },
  { immediate: true }
);

const constrain: ConstraintFunction = ([x]) => [
  Math.min(Math.max(xBounds[0], x), xBounds[1]),
  0,
];

const a = useMovablePoint([from, 0], { constrain });
const b = useMovablePoint([to, 0], { constrain });
const ready = ref(false);

// The function
const fn = (x: number) => 3.7 * x ** 3 - 6 * x ** 2 + x + 0.7;

const bx = computed(() => a.x.value + (b.x.value - a.x.value) * value);

// Outputs
const partitions = computed<Partition[]>(() => {
  const dx = (bx.value - a.x.value) / numPartitions;
  return range(a.x.value, bx.value - dx / 2, dx).map((x) => {
    const yMid = fn(x + dx / 2);

    return {
      polygon: [
        [x, 0],
        [x, yMid],
        [x + dx, yMid],
        [x + dx, 0],
      ],
      area: dx * yMid,
    };
  });
});
</script>

<template>
  <Mafs
    :height="200"
    :viewBox="{ x: xBounds, y: [-0.9, 4.5], padding: 0 }"
    :preserveAspectRatio="false"
    :pan="false"
  >
    <CartesianCoordinates
      :yAxis="{
        axis: false,
        lines: false,
        labels: false,
      }"
      :xAxis="{ axis: true, labels: false }"
    />

    <PlotOfX :y="fn" color="#358CF1" />

    <Polygon
      v-for="(partition, index) in partitions"
      :key="index"
      :points="partition.polygon"
      :color="partition.area >= 0 ? '#08A029' : '#A00863'"
      :fillOpacity="0.1"
    />

    <g
      :style="{
        transition: 'all 0.4s ease',
        pointerEvents: ready ? 'auto' : 'none',
        touchAction: ready ? 'auto' : 'none',
      }"
      opacity="ready ? 1 : 0"
    >
      <a.element.value /> <b.element.value />
    </g>
  </Mafs>
</template>

<style>
@import "vue-mafs/core.css";
</style>
