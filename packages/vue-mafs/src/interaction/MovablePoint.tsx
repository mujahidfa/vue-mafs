import {
  computed,
  defineComponent,
  ref,
  watch,
  watchEffect,
  type PropType,
} from "vue";
import { normalizeProps, useDrag } from "vuse-gesture";
import invariant from "tiny-invariant";
import { Theme } from "../display/Theme";
import { range } from "../math";
import * as vec from "../vec";
import { useTransformContext } from "../context/TransformContext";
import { useSpanContext } from "../context/SpanContext";

export type ConstraintFunction = (position: vec.Vector2) => vec.Vector2;

export interface MovablePointProps {
  /** The current position `[x, y]` of the point. */
  point: vec.Vector2;
  /** A callback that is called as the user moves the point. */
  onMove: (point: vec.Vector2) => void;
  /**
   * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
   *
   * In mapped movement mode, you must provide a function that maps the user's mouse position
   * `[x, y]` to the position the point should "snap" to.
   */
  constrain?: ConstraintFunction;
  color?: string;
}

export const MovablePoint = defineComponent({
  props: {
    /** The current position `[x, y]` of the point. */
    point: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    /** A callback that is called as the user moves the point. */
    onMove: {
      type: Function as PropType<(point: vec.Vector2) => void>,
      required: true,
    },
    /**
     * Constrain the point to only horizontal movement, vertical movement, or mapped movement.
     *
     * In mapped movement mode, you must provide a function that maps the user's mouse position
     * `[x, y]` to the position the point should "snap" to.
     */
    constrain: {
      type: Function as PropType<ConstraintFunction>,
      default: (point: vec.Vector2) => point,
      required: false,
    },
    color: {
      type: String,
      default: Theme.pink,
      required: false,
    },
  },
  setup(props) {
    const { viewTransform, userTransform } = useTransformContext();
    const { xSpan, ySpan } = useSpanContext();
    const inverseViewTransform = computed(() =>
      vec.matrixInvert(viewTransform.value)
    );

    const inverseTransform = computed(() =>
      getInverseTransform(userTransform.value)
    );

    const combinedTransform = computed(() =>
      vec.matrixMult(viewTransform.value, userTransform.value)
    );

    const dragging = ref(false);
    const display = computed(() =>
      vec.transform(props.point, combinedTransform.value)
    );
    const displayX = computed(() => display.value[0]);
    const displayY = computed(() => display.value[1]);

    const pickup = ref<vec.Vector2>([0, 0]);

    const bind: any = useDrag((state) => {
      const { type, event } = state;
      event?.stopPropagation();

      const isKeyboard = type.includes("key");
      if (isKeyboard) {
        event?.preventDefault();
        const { direction: yDownDirection, altKey, metaKey, shiftKey } = state;

        const direction = [
          yDownDirection[0],
          -yDownDirection[1],
        ] as vec.Vector2;
        const span = Math.abs(direction[0]) ? xSpan.value : ySpan.value;

        let divisions = 50;
        if (altKey || metaKey) divisions = 200;
        if (shiftKey) divisions = 10;

        const min = span / (divisions * 2);
        const tests = range(span / divisions, span / 2, span / divisions);

        for (const dx of tests) {
          // Transform the test back into the point's coordinate system
          const testMovement = vec.scale(direction, dx);
          const testPoint = props.constrain(
            vec.transform(
              vec.add(
                vec.transform(props.point, userTransform.value),
                testMovement
              ),
              inverseTransform.value
            )
          );

          if (vec.dist(testPoint, props.point) > min) {
            props.onMove(testPoint);
            break;
          }
        }
      } else {
        const { last, movement: pixelMovement, first } = state;

        dragging.value = !last;

        if (first)
          pickup.value = vec.transform(props.point, userTransform.value);
        if (vec.mag(pixelMovement) === 0) return;

        invariant(
          inverseViewTransform.value,
          "The view transform must be invertible."
        );

        const movement = vec.transform(
          pixelMovement,
          inverseViewTransform.value
        );
        props.onMove(
          props.constrain(
            vec.transform(
              vec.add(pickup.value, movement),
              inverseTransform.value
            )
          )
        );
      }
    });

    const ringSize = 15;

    return () => (
      <g
        {...normalizeProps(bind())}
        style={{
          "--movable-point-color": props.color,
          "--movable-point-ring-size": `${ringSize}px`,
        }}
        class={`mafs-movable-point ${
          dragging.value ? "mafs-movable-point-dragging" : ""
        }`}
        tabindex={0}
      >
        <circle
          class="mafs-movable-point-hitbox"
          r={30}
          cx={displayX.value}
          cy={displayY.value}
        ></circle>
        <circle
          class="mafs-movable-point-focus"
          r={ringSize + 1}
          cx={displayX.value}
          cy={displayY.value}
        ></circle>
        <circle
          class="mafs-movable-point-ring"
          r={ringSize}
          cx={displayX.value}
          cy={displayY.value}
        ></circle>
        <circle
          class="mafs-movable-point-point"
          r={6}
          cx={displayX.value}
          cy={displayY.value}
        ></circle>
      </g>
    );
  },
});

function getInverseTransform(transform: vec.Matrix) {
  const invert = vec.matrixInvert(transform);
  invariant(
    invert !== null,
    "Could not invert transform matrix. Your movable point's transformation matrix might be degenerative (mapping 2D space to a line)."
  );
  return invert;
}
