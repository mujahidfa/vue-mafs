import { computed, defineComponent, type PropType } from "vue";
import * as vec from "../../vec";
import type { Stroked } from "../Theme";
import { useScaleContext } from "../../view/ScaleContext";

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
    const { cssScale, scaleX, scaleY } = useScaleContext();

    const tMin = computed(() => props.t[0]);
    const tMax = computed(() => props.t[1]);
    const errorThreshold = computed(
      () => 0.1 / (scaleX.value(1) * scaleY.value(-1))
    );

    const svgPath = computed(() => {
      let pathDescriptor = "M ";

      function smartSmooth(
        min: number,
        max: number,
        pushLeft: boolean,
        pushRight: boolean,
        depth = 0
      ) {
        const t = 0.5;
        const mid = min + (max - min) * t;

        if (depth < props.minSamplingDepth) {
          smartSmooth(min, mid, true, false, depth + 1);
          smartSmooth(mid, max, false, true, depth + 1);
          return;
        }

        const [xyMinX, xyMinY] = props.xy(min);
        const [xyMidX, xyMidY] = props.xy(mid);
        const [xyMaxX, xyMaxY] = props.xy(max);

        if (depth < props.maxSamplingDepth) {
          const xyLerpMid = vec.lerp([xyMinX, xyMinY], [xyMaxX, xyMaxY], t);
          const error = vec.squareDist([xyMidX, xyMidY], xyLerpMid);
          if (error > errorThreshold.value) {
            smartSmooth(min, mid, true, false, depth + 1);
            smartSmooth(mid, max, false, true, depth + 1);
            return;
          }
        }

        if (pushLeft && Number.isFinite(xyMinX) && Number.isFinite(xyMinY)) {
          pathDescriptor += `${xyMinX} ${xyMinY} L `;
        }
        if (Number.isFinite(xyMidX) && Number.isFinite(xyMidY))
          pathDescriptor += `${xyMidX} ${xyMidY} L `;
        if (pushRight && Number.isFinite(xyMaxX) && Number.isFinite(xyMaxY))
          pathDescriptor += `${xyMaxX} ${xyMaxY} L `;
      }

      smartSmooth(tMin.value, tMax.value, true, true);

      return pathDescriptor.substring(0, pathDescriptor.length - 3);
    });

    return () => (
      <path
        d={svgPath.value}
        stroke-width={props.weight}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray={props.lineStyle === "dashed" ? "1,10" : undefined}
        transform={cssScale.value}
        style={{
          stroke: props.color || "var(--mafs-fg)",
          strokeOpacity: props.opacity,
          vectorEffect: "non-scaling-stroke",
        }}
      />
    );
  },
});
