<script setup lang="ts">
import { computed } from "vue";
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
  LineSegment,
  LinePointSlope,
  LinePointAngle,
  Polygon,
  Circle,
  vec,
  Ellipse,
  Transform,
  Text,
  Vector,
  VectorField,
} from "../src/index";

const { x: phaseX, element: PhaseElement } = useMovablePoint([0, 0], {
  constrain: "horizontal",
});

const { point: point1, element: Point1Element } = useMovablePoint([-1, -1]);
const { point: point2, element: Point2Element } = useMovablePoint([2, 1]);

const { point: point3, element: Point3Element } = useMovablePoint([-1, -1]);
const { point: point4, element: Point4Element } = useMovablePoint([2, 1]);

const { point: point5, element: Point5Element } = useMovablePoint([-1, -1]);
const { y, element: SlopeElement } = useMovablePoint([0, 1], {
  constrain: "vertical",
});

const { point: point6, element: Point6Element } = useMovablePoint([-1, -1]);

const a = [2, 0] as [number, number];
const b = [-2, 0] as [number, number];
const {
  x: polygonX,
  y: polygonY,
  point: polygonPoint,
  element: PolygonPointElement,
} = useMovablePoint([0, 2]);

///////
const hintRadius = 3;

// This center point translates everything else.
const { point: translatePoint, element: TranslatePoint } = useMovablePoint(
  [0, 0],
  {
    color: Theme.orange,
  }
);

// This outer point rotates the ellipse, and
// is also translated by the center point.
const { point: rotatePoint, element: RotateElement } = useMovablePoint(
  [hintRadius, 0],
  {
    color: Theme.blue,
    // Constrain this point to only move in a circle
    constrain: (position) => vec.scale(vec.normalize(position), hintRadius),
  }
);
const angle = computed(() =>
  Math.atan2(rotatePoint.value[1], rotatePoint.value[0])
);

const { x: widthX, element: WidthElement } = useMovablePoint([-2, 0], {
  constrain: "horizontal",
});
const { y: heightY, element: HeightElement } = useMovablePoint([0, 1], {
  constrain: "vertical",
});
///////

const { point: pointOnCircle, element: PointOnCircleElement } = useMovablePoint(
  [Math.sqrt(2) / 2, Math.sqrt(2) / 2]
);
const r = computed(() => vec.mag(pointOnCircle.value));

const {
  x: textPointX,
  y: textPointY,
  element: TextPointElement,
} = useMovablePoint([1, 1]);

const {
  point: tipPoint,
  x: tipX,
  y: tipY,
  element: TipElement,
} = useMovablePoint([0.4, 0.6]);
const vec1 = computed(() => tipPoint.value);
const tipAngle = computed(() => Math.atan2(tipY.value, tipX.value));
const vec2 = computed(() =>
  vec.add(vec1.value, vec.rotate(vec1.value, tipAngle.value))
);
const vec3 = computed(() =>
  vec.add(vec1.value, vec.rotate(vec2.value, -2 * tipAngle.value))
);

const {
  x: vectorPointX,
  y: vectorPointY,
  element: VectorPointElement,
} = useMovablePoint([0.6, 0.6]);

const { point: tPoint, element: TElement } = useMovablePoint([-4, -2]);
const { point: sPoint, element: SElement } = useMovablePoint([8, 4], {
  color: Theme.blue,
});
const { point: rPoint, element: RElement } = useMovablePoint([1, 0], {
  color: Theme.green,
  constrain: (p) => vec.normalize(p),
});
const transformAngle = computed(() =>
  Math.atan2(rPoint.value[1], rPoint.value[0])
);
</script>

<template>
  <Mafs :viewBox="{ x: [-8, 8], y: [-3, 3] }">
    <CartesianCoordinates />

    <Transform :translate="tPoint">
      <Transform :rotate="transformAngle">
        <Transform :scale="sPoint">
          <Polygon
            :points="[
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
            ]"
          />
          <Circle :center="[0.5, 0.5]" :radius="0.5" />
          <Text :x="0.5" :y="0.5"> Hello world! </Text>
        </Transform>

        <SElement />
      </Transform>

      <RElement />
    </Transform>

    <TElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs>
    <CartesianCoordinates :subdivisions="2" />
    <VectorField
      :xy="
        (x, y) => [
          y - vectorPointY - (x - vectorPointX),
          -(x - vectorPointX) - (y - vectorPointY),
        ]
      "
      :step="0.5"
      :xyOpacity="(x, y) => (Math.abs(x) + Math.abs(y)) / 10"
    />
    <VectorPointElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs>
    <CartesianCoordinates />
    <Vector :tip="vec1" lineStyle="dashed" />
    <Vector :tail="vec1" :tip="vec2" />
    <Vector :tail="vec2" :tip="vec3" />

    <TipElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ y: [0, 2], x: [-3, 5] }">
    <CartesianCoordinates />
    <Text :x="textPointX" :y="textPointY" attach="w" :attachDistance="15">
      ({{ textPointX.toFixed(3) }}, {{ textPointY.toFixed(3) }})
    </Text>
    <Text :x="textPointX" :y="textPointY" attach="e" :attachDistance="15">
      ({{ textPointX.toFixed(3) }}, {{ textPointY.toFixed(3) }})
    </Text>
    <TextPointElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ y: [-2, 2] }">
    <CartesianCoordinates />
    <Circle :center="[0, 0]" :radius="r" />
    <PointOnCircleElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ x: [-3, 3], y: [-3, 3] }">
    <CartesianCoordinates />

    <Transform :translate="translatePoint">
      <Transform :rotate="angle">
        <!-- 
          Display a little hint that the
          point is meant to move radially 
        -->
        <Circle
          :center="[0, 0]"
          :radius="hintRadius"
          strokeStyle="dashed"
          :strokeOpacity="0.3"
          :fillOpacity="0"
        />

        <Ellipse
          :center="[0, 0]"
          :radius="[Math.abs(widthX), Math.abs(heightY)]"
        />

        <WidthElement /> <HeightElement />
      </Transform>

      <RotateElement />
    </Transform>

    <TranslatePoint />
  </Mafs>

  <div className="divider"></div>

  <Mafs>
    <CartesianCoordinates />
    <Polygon :points="[[polygonX, -polygonY], a, b]" strokeStyle="dashed" />
    <Polygon :points="[polygonPoint, a, b]" :color="Theme.blue" />
    <PolygonPointElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LinePointAngle :point="point6" :angle="Math.PI / 6" />
    <Point6Element />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LinePointSlope :point="point5" :slope="y" />
    <Point5Element />
    <SlopeElement />
  </Mafs>

  <div class="divider"></div>

  <Mafs :viewBox="{ y: [-1, 1] }">
    <CartesianCoordinates />
    <LineSegment :point1="point3" :point2="point4" />
    <Point3Element />
    <Point4Element />
  </Mafs>

  <div class="divider"></div>

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
