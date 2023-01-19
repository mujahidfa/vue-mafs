import { computed, defineComponent, type PropType } from "vue";
import * as vec from "../../vec";
import type { Stroked } from "../Theme";
import { useTransformContext } from "../../context/TransformContext";
import { adaptiveSampling } from "./PlotUtils";

export interface ParametricProps extends Stroked {
  /** A function that takes a `t` value and returns a point. */
  xy: (t: number) => vec.Vector2;
  /** The domain `t` between which to evaluate `xy`. */
  t: vec.Vector2;
  /** The minimum recursive depth of the sampling algorithm. */
  minSamplingDepth?: number;
  /** The maximum recursive depth of the sampling algorithm. */
  maxSamplingDepth?: number;
}

export const Parametric = defineComponent({
  name: "PlotParametric",
  props: {
    /** A function that takes a `t` value and returns a point. */
    xy: {
      type: Function as PropType<(t: number) => vec.Vector2>,
      required: true,
    },
    /** The domain `t` between which to evaluate `xy`. */
    t: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    lineStyle: {
      type: String as PropType<"solid" | "dashed">,
      default: "solid",
      required: false,
    },
    weight: {
      type: Number,
      default: 2,
      required: false,
    },
    opacity: {
      type: Number,
      default: 1.0,
      required: false,
    },
    /** The minimum recursive depth of the sampling algorithm. */
    minSamplingDepth: {
      type: Number,
      default: 8,
      required: false,
    },
    /** The maximum recursive depth of the sampling algorithm. */
    maxSamplingDepth: {
      type: Number,
      default: 14,
      required: false,
    },
  },
  setup(props) {
    const { viewTransform } = useTransformContext();

    // Negative because the y-axis is flipped in the SVG coordinate system.
    const pixelsPerSquare = computed(() => -vec.det(viewTransform.value));

    const tMin = computed(() => props.t[0]);
    const tMax = computed(() => props.t[1]);
    const errorThreshold = computed(() => 0.1 / pixelsPerSquare.value);

    const svgPath = computed(() =>
      adaptiveSampling(
        props.xy,
        [tMin.value, tMax.value],
        props.minSamplingDepth,
        props.maxSamplingDepth,
        errorThreshold.value
      )
    );

    return () => (
      <path
        d={svgPath.value}
        stroke-width={props.weight}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray={props.lineStyle === "dashed" ? "1,10" : undefined}
        style={{
          stroke: props.color || "var(--mafs-fg)",
          strokeOpacity: props.opacity,
          vectorEffect: "non-scaling-stroke",
          transform: "var(--mafs-view-transform)",
        }}
      />
    );
  },
});
