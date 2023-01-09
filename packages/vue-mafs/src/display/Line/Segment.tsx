import { computed, defineComponent, type PropType } from "vue";
import { type Stroked, Theme } from "../../display/Theme";
import { useScaleContext } from "../../view/ScaleContext";
import { round } from "../../math";
import * as vec from "../../vec";
import { useTransformContext } from "../Transform";

export interface SegmentProps extends Stroked {
  point1: vec.Vector2;
  point2: vec.Vector2;
}

export const Segment = defineComponent({
  name: "LineSegment",
  props: {
    point1: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    point2: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    color: {
      type: String,
      default: Theme.foreground,
      required: false,
    },
    lineStyle: {
      type: String as PropType<"solid" | "dashed">,
      default: "solid",
      required: false,
      validator(prop: string) {
        return ["solid", "dashed"].includes(prop);
      },
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
  },
  setup(props) {
    const { pixelMatrix } = useScaleContext();
    const transformContext = useTransformContext();
    const transform = computed(() =>
      vec.matrixMult(pixelMatrix.value, transformContext.value)
    );

    const scaledPoint1 = computed(() =>
      vec.transform(props.point1, transform.value)
    );
    const scaledPoint2 = computed(() =>
      vec.transform(props.point2, transform.value)
    );

    return () => (
      <line
        x1={round(scaledPoint1.value[0], 2)}
        y1={round(scaledPoint1.value[1], 2)}
        x2={round(scaledPoint2.value[0], 2)}
        y2={round(scaledPoint2.value[1], 2)}
        style={{ stroke: props.color }}
        stroke-width={props.weight}
        opacity={props.opacity}
        stroke-dasharray={props.lineStyle === "dashed" ? "1,10" : undefined}
      />
    );
  },
});
