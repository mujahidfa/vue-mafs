import { computed, defineComponent, type PropType } from "vue";
import { type Stroked, Theme } from "../../display/Theme";
import { useTransformContext } from "../../context/TransformContext";
import { round } from "../../math";
import { vec } from "../../vec";

export interface ThroughPointsProps extends Stroked {
  point1: vec.Vector2;
  point2: vec.Vector2;
}

export const ThroughPoints = defineComponent({
  name: "LineThroughPoints",
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
    const { viewTransform, userTransform } = useTransformContext();
    const transform = computed(() =>
      vec.matrixMult(viewTransform.value, userTransform.value)
    );
    const segment = computed(() =>
      vec.scale(vec.normalize(vec.sub(props.point2, props.point1)), 100000)
    );

    const scaledPoint1 = computed(() =>
      vec.transform(vec.sub(props.point1, segment.value), transform.value)
    );
    const scaledPoint2 = computed(() =>
      vec.transform(vec.add(props.point2, segment.value), transform.value)
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
        stroke-dasharray={props.lineStyle === "dashed" ? "4,3" : undefined}
      />
    );
  },
});
