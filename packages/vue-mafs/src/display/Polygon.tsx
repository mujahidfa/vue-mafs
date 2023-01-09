import { computed, defineComponent, type PropType } from "vue";
import { Theme, type Filled } from "./Theme";
import { useScaleContext } from "../view/ScaleContext";
import type { Vector2 } from "../vec";
import { useTransformContext } from "./Transform";
import * as vec from "../vec";

export interface PolygonProps extends Filled {
  points: Vector2[];
}

export const Polygon = defineComponent({
  props: {
    points: {
      type: Array as PropType<Vector2[]>,
      required: true,
    },
    color: {
      type: String,
      default: Theme.foreground,
      required: false,
    },
    weight: {
      type: Number,
      default: 2,
      required: false,
    },
    fillOpacity: {
      type: Number,
      default: 0.15,
      required: false,
    },
    strokeOpacity: {
      type: Number,
      default: 1.0,
      required: false,
    },
    strokeStyle: {
      type: String as PropType<"solid" | "dashed">,
      default: "solid",
      required: false,
      validator(prop: string) {
        return ["solid", "dashed"].includes(prop);
      },
    },
  },
  setup(props) {
    const { cssScale } = useScaleContext();
    const transform = useTransformContext();

    const scaledPoints = computed(() =>
      props.points
        .map((point) => vec.transform(point, transform.value).join(" "))
        .join(" ")
    );

    return () => (
      <polygon
        points={scaledPoints.value}
        stroke-width={props.weight}
        fill-opacity={props.fillOpacity}
        stroke-dasharray={props.strokeStyle === "dashed" ? "4,3" : undefined}
        stroke-linejoin="round"
        transform={cssScale.value}
        style={{
          fill: props.color,
          fillOpacity: props.fillOpacity,
          stroke: props.color,
          strokeOpacity: props.strokeOpacity,
          vectorEffect: "non-scaling-stroke",
        }}
      ></polygon>
    );
  },
});