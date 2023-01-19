import { computed, defineComponent, type PropType } from "vue";
import { usePaneContext } from "../../context/PaneContext";
import { Parametric, type ParametricProps } from "./Parametric";
import type * as vec from "../../vec";

export interface OfXProps extends Omit<ParametricProps, "xy" | "t"> {
  y: (x: number) => number;
}

export const OfX = defineComponent({
  name: "PlotOfX",
  props: {
    y: {
      type: Function as PropType<(x: number) => number>,
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
    const { xPaneRange } = usePaneContext();

    const xMin = computed(() => xPaneRange.value[0]);
    const xMax = computed(() => xPaneRange.value[1]);

    const xy = computed<ParametricProps["xy"]>(() => (x) => [x, props.y(x)]);
    const t = computed<vec.Vector2>(() => [xMin.value, xMax.value]);

    return () => <Parametric xy={xy.value} t={t.value} {...props} />;
  },
});

export interface OfYProps extends Omit<ParametricProps, "xy" | "t"> {
  x: (y: number) => number;
}

export const OfY = defineComponent({
  name: "PlotOfY",
  props: {
    x: {
      type: Function as PropType<(y: number) => number>,
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
    const { yPaneRange } = usePaneContext();

    const yMin = computed(() => yPaneRange.value[0]);
    const yMax = computed(() => yPaneRange.value[1]);

    const xy = computed<ParametricProps["xy"]>(() => (y) => [props.x(y), y]);
    const t = computed<vec.Vector2>(() => [yMin.value, yMax.value]);

    return () => <Parametric xy={xy.value} t={t.value} {...props} />;
  },
});
