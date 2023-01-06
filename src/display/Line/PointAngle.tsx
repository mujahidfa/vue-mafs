import { computed, defineComponent, type PropType } from "vue";
import { Theme, type Stroked } from "../../display/Theme";
import * as vec from "../../vec";
import { ThroughPoints } from "./ThroughPoints";

export interface PointAngleProps extends Stroked {
  point: vec.Vector2;
  angle: number;
}

export const PointAngle = defineComponent({
  name: "LinePointAngle",
  props: {
    point: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    angle: {
      type: Number,
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
    const point2 = computed(() =>
      vec.add(props.point, vec.rotate([1, 0], props.angle))
    );
    return () => (
      <ThroughPoints {...props} point1={props.point} point2={point2.value} />
    );
  },
});
