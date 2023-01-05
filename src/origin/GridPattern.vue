<script setup lang="ts">
/**
 * @private
 *
 * Creates an SVG <pattern> that looks like a cartesian coordinate plane grid.
 *
 * This is a bit more complex than just rendering lines, but is way more performant, since the
 * browser handles making the pattern repeat for us.
 */

import { computed } from "vue";
import { range } from "../math";
import { useScaleContext } from "../view/ScaleContext";

const props = defineProps<{
  id: string;
  xLines: number | false;
  yLines: number | false;
  xSubdivisions: number | false;
  ySubdivisions: number | false;
}>();

const { scaleX, scaleY } = useScaleContext();

const width = computed(() => scaleX.value(props.xLines || 1));
const height = computed(() => -scaleY.value(props.yLines || 1));

const xs = computed<number[]>(() => {
  if (props.xSubdivisions && props.xSubdivisions > 1) {
    const pixelXDistance = width.value / props.xSubdivisions;
    return range(0, width.value + pixelXDistance * 1.1, pixelXDistance);
  } else {
    return [];
  }
});

const ys = computed<number[]>(() => {
  if (props.ySubdivisions && props.ySubdivisions > 1) {
    const pixelYDistance = height.value / props.ySubdivisions;
    return range(0, height.value + pixelYDistance * 1.1, pixelYDistance);
  } else {
    return [];
  }
});
</script>

<template>
  <pattern
    :id="id"
    x="0"
    y="0"
    :width="width"
    :height="height"
    patternUnits="userSpaceOnUse"
  >
    <line
      v-for="x in xs"
      :key="x"
      :x1="x"
      :y1="0"
      :x2="x"
      :y2="height"
      :style="{ stroke: 'var(--grid-line-subdivision-color)' }"
    />
    <line
      v-for="y in ys"
      :key="y"
      :y1="y"
      :x1="0"
      :y2="y"
      :x2="width"
      :style="{ stroke: 'var(--grid-line-subdivision-color)' }"
    />
    <template v-if="xLines">
      <line
        :x1="0"
        :y1="0"
        :x2="0"
        :y2="height"
        :style="{ stroke: 'var(--mafs-line-color)' }"
      />
      <line
        :x1="width"
        :y1="0"
        :x2="width"
        :y2="height"
        :style="{ stroke: 'var(--mafs-line-color)' }"
      />
    </template>
    <template v-if="yLines">
      <line
        :x1="0"
        :y1="0"
        :x2="width"
        :y2="0"
        :style="{ stroke: 'var(--mafs-line-color)' }"
      />
      <line
        :x1="0"
        :y1="height"
        :x2="width"
        :y2="height"
        :style="{ stroke: 'var(--mafs-line-color)' }"
      />
    </template>
  </pattern>
</template>
