<script setup lang="tsx">
import { defineComponent } from "vue";
import { Mafs, CartesianCoordinates, DebugTransformWidget } from "../src";

const PizzaSlice = defineComponent({
  name: "PizzaSlice",
  setup() {
    const maskId = `pizza-slice-mask-1`;

    return () => (
      <g
        style={{
          transform: `var(--mafs-view-transform) var(--mafs-user-transform)`,
        }}
      >
        <defs>
          <mask id={maskId}>
            <polyline
              points={`0,0 ${1},${1 / 2} ${1},${-1 / 2}`}
              fill="white"
            />
          </mask>
        </defs>

        <g mask={`url(#${maskId})`}>
          <circle cx={0} cy={0} r={1} fill="brown" />
          <circle cx={0} cy={0} r={1 * 0.85} fill="yellow" />
          <circle cx={0.4} cy={1 * 0.1} r={0.11} fill="red" />
          <circle cx={0.2} cy={-1 * 0.1} r={0.09} fill="red" />
          <circle cx={0.5} cy={-1 * 0.15} r={0.1} fill="red" />
          <circle cx={0.7} cy={1 * 0.05} r={0.11} fill="red" />
          <circle cx={0.65} cy={1 * 0.35} r={0.1} fill="red" />
          <circle cx={0.65} cy={-1 * 0.37} r={0.08} fill="red" />
        </g>
      </g>
    );
  },
});
</script>

<template>
  <Mafs :viewBox="{ x: [-1, 1], y: [-1, 1] }">
    <CartesianCoordinates />
    <DebugTransformWidget>
      <PizzaSlice />
    </DebugTransformWidget>
  </Mafs>
</template>
