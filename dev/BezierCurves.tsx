import {
  CartesianCoordinates,
  FunctionGraphParametric,
  LineSegment,
  Mafs,
  Point,
  Theme,
  useMovablePoint,
  useStopwatch,
  type Vector2,
  vec,
} from "../src/index";
import { easeInOutCubic } from "js-easing-functions";
import { computed, defineComponent, ref, watchEffect } from "vue";

/**
 * Given the four control points, calculate
 * the xy position of the bezier curve at value t.
 * See https://youtu.be/aVwxzDHniEw?t=265
 */
function xyFromBernsteinPolynomial(
  p1: Vector2,
  c1: Vector2,
  c2: Vector2,
  p2: Vector2,
  t: number
) {
  return [
    vec.scale(p1, -(t ** 3) + 3 * t ** 2 - 3 * t + 1),
    vec.scale(c1, 3 * t ** 3 - 6 * t ** 2 + 3 * t),
    vec.scale(c2, -3 * t ** 3 + 3 * t ** 2),
    vec.scale(p2, t ** 3),
  ].reduce(vec.add, [0, 0]);
}

function inPairs<T>(arr: T[]) {
  const pairs: [T, T][] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    pairs.push([arr[i], arr[i + 1]]);
  }

  return pairs;
}

const BezierCurves = defineComponent({
  setup() {
    const t = ref(0.5);
    const opacity = computed(() => 1 - (2 * t.value - 1) ** 6);

    const p1 = useMovablePoint([-5, 2]);
    const p2 = useMovablePoint([5, -2]);

    const c1 = useMovablePoint([-2, -3]);
    const c2 = useMovablePoint([2, 3]);

    const lerp1 = computed(() =>
      vec.lerp(p1.point.value, c1.point.value, t.value)
    );
    const lerp2 = computed(() =>
      vec.lerp(c1.point.value, c2.point.value, t.value)
    );
    const lerp3 = computed(() =>
      vec.lerp(c2.point.value, p2.point.value, t.value)
    );

    const lerp12 = computed(() => vec.lerp(lerp1.value, lerp2.value, t.value));
    const lerp23 = computed(() => vec.lerp(lerp2.value, lerp3.value, t.value));

    const lerpBezier = computed(() =>
      vec.lerp(lerp12.value, lerp23.value, t.value)
    );

    const duration = 2;
    const { time, start } = useStopwatch({
      endTime: duration,
    });

    watchEffect(() => {
      setTimeout(() => start(), 500);
    });
    watchEffect(() => {
      t.value = easeInOutCubic(time.value, 0, 0.75, duration);
    });

    function drawLineSegments(
      pointPath: Vector2[],
      color: string,
      customOpacity = opacity.value * 0.5
    ) {
      return inPairs(pointPath).map(([p1, p2], index) => (
        <LineSegment
          key={index}
          point1={p1}
          point2={p2}
          opacity={customOpacity}
          color={color}
        />
      ));
    }

    function drawPoints(points: Vector2[], color: string) {
      return points.map((point, index) => (
        <Point
          key={index}
          x={point[0]}
          y={point[1]}
          color={color}
          opacity={opacity.value}
        />
      ));
    }

    return () => (
      <>
        <Mafs viewBox={{ x: [-5, 5], y: [-4, 4] }}>
          <CartesianCoordinates
            xAxis={{ labels: false, axis: false }}
            yAxis={{ labels: false, axis: false }}
          />

          {/* Control lines */}
          {drawLineSegments(
            [p1.point.value, c1.point.value, c2.point.value, p2.point.value],
            Theme.pink,
            0.5
          )}

          {/* First-order lerps */}
          {drawLineSegments([lerp1.value, lerp2.value, lerp3.value], Theme.red)}
          {drawPoints([lerp1.value, lerp2.value, lerp3.value], Theme.red)}

          {/* Second-order lerps */}
          {drawLineSegments([lerp12.value, lerp23.value], Theme.yellow)}
          {drawPoints([lerp12.value, lerp23.value], Theme.yellow)}

          {/* Quadratic bezier lerp  */}
          <FunctionGraphParametric
            t={[0, t.value]}
            weight={3}
            xy={(t) =>
              xyFromBernsteinPolynomial(
                p1.point.value,
                c1.point.value,
                c2.point.value,
                p2.point.value,
                t
              )
            }
          />
          {/* Show remaining bezier with dashed line  */}
          <FunctionGraphParametric
            // Iterate backwards so that dashes don't move
            t={[1, t.value]}
            weight={3}
            opacity={0.5}
            style="dashed"
            xy={(t) =>
              xyFromBernsteinPolynomial(
                p1.point.value,
                c1.point.value,
                c2.point.value,
                p2.point.value,
                t
              )
            }
          />

          {drawPoints([lerpBezier.value], Theme.foreground)}

          <p1.element.value />
          <p2.element.value />
          <c1.element.value />
          <c2.element.value />
        </Mafs>

        {/* These classnames are part of the Mafs docs website—they won't work for you. */}
        <div class="p-4 border-gray-700 border-t bg-black text-white">
          <span class="font-display">t =</span>{" "}
          <input
            type="range"
            min={0}
            max={1}
            step={0.005}
            value={t.value}
            onInput={(event) => {
              t.value = +event.target.value;
            }}
          />
        </div>
      </>
    );
  },
});

export default BezierCurves;
