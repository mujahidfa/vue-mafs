<script setup lang="ts">
import {
  Mafs,
  CartesianCoordinates,
  FunctionGraphOfX,
  FunctionGraphParametric,
  labelPi,
  Theme,
  useMovablePoint,
  Point,
  LineThroughPoints,
} from "../src/index";

const { x: phaseX, element: PhaseElement } = useMovablePoint([0, 0], {
  constrain: "horizontal",
});

const { point: point1, element: Point1Element } = useMovablePoint([-1, -1]);
const { point: point2, element: Point2Element } = useMovablePoint([2, 1]);
</script>

<template>
  <Mafs :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LineThroughPoints :point1="point1" :point2="point2" />
    <Point1Element />
    <Point2Element />
  </Mafs>

  <div class="divider"></div>

  <Mafs>
    <CartesianCoordinates />
    <Point :x="1" :y="1" />
    <Point :x="-2" :y="1" :opacity="0.5" />
    <Point :x="1" :y="-2" :opacity="0.5" color="yellow" />
    <Point :x="-1" :y="-3" color="red" />
    <Point :x="0" :y="0" :opacity="0.8" color="lightgreen" />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ x: [-10, 10], y: [-2, 2] }" :preserveAspectRatio="false">
    <CartesianCoordinates
      :subdivisions="4"
      :xAxis="{ lines: Math.PI, labels: labelPi }"
    />
    <FunctionGraphOfX :y="(x: number) => Math.sin(x - phaseX)" />
    <PhaseElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ x: [-3, 3], y: [-3, 3] }">
    <CartesianCoordinates />
    <FunctionGraphParametric
      :xy="
        (t) => [
          (t / 4) * Math.cos(t * 2 * Math.PI),
          (t / 4) * Math.sin(t * 2 * Math.PI),
        ]
      "
      :t="[0, 8]"
      :color="Theme.blue"
    />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ x: [-10, 10], y: [-2, 2] }" :preserveAspectRatio="false">
    <CartesianCoordinates
      :subdivisions="4"
      :xAxis="{ lines: Math.PI, labels: labelPi }"
    />
    <FunctionGraphOfX :y="(x: number) => Math.sin(x)" lineStyle="dashed" />
  </Mafs>

  <div class="divider"></div>

  <Mafs :height="300" :width="300">
    <CartesianCoordinates :subdivisions="4" />
  </Mafs>

  <div class="divider"></div>

  <Mafs>
    <CartesianCoordinates />
  </Mafs>
</template>

<style>
@import "../src/index.css";
.divider {
  margin: 30px;
}
</style>
