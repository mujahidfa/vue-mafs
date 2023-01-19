import { defineComponent, type PropType } from "vue";
import { Theme, type Stroked } from "../../display/Theme";
import type { vec } from "../../vec";
import { PointAngle } from "./PointAngle";

export interface PointSlopeProps extends Stroked {
  point: vec.Vector2;
  slope: number;
}

export const PointSlope = defineComponent({
  name: "LinePointAngle",
  props: {
    point: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    slope: {
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
    return () => (
      <PointAngle
        {...props}
        point={props.point}
        angle={Math.atan(props.slope)}
      />
    );
  },
});
