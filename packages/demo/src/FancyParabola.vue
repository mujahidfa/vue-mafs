<script setup lang="ts">
import { computed } from "vue";
import {
  CartesianCoordinates,
  PlotOfX,
  Mafs,
  Transform,
  useMovablePoint,
} from "vue-mafs";

const a = useMovablePoint([-1, 0], {
  constrain: "horizontal",
});
const b = useMovablePoint([1, 0], {
  constrain: "horizontal",
});

const k = useMovablePoint([0, -1], {
  constrain: "vertical",
});

const mid = computed(() => (a.x.value + b.x.value) / 2);
const fn = (x: number) => (x - a.x.value) * (x - b.x.value);
</script>

<template>
  <Mafs>
    <CartesianCoordinates :subdivisions="2" />

    <PlotOfX :y="(x) => (k.y.value * fn(x)) / fn(mid)" />
    <a.element.value />
    <b.element.value />
    <Transform :translate="[(a.x.value + b.x.value) / 2, 0]">
      <k.element.value />
    </Transform>
  </Mafs>
</template>
