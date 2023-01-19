import { defineComponent, type PropType } from "vue";
import { type Filled, Theme } from "./Theme";
import { Ellipse } from "./Ellipse";
import type { vec } from "../vec";

export interface CircleProps extends Filled {
  center: vec.Vector2;
  radius: number;
}

export const Circle = defineComponent({
  props: {
    center: {
      type: Object as PropType<vec.Vector2>,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    angle: {
      type: Number,
      default: 0,
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
    strokeOpacity: {
      type: Number,
      default: 1.0,
      required: false,
    },
    weight: {
      type: Number,
      default: 2,
      required: false,
    },
    color: {
      type: String,
      default: Theme.foreground,
      required: false,
    },
    fillOpacity: {
      type: Number,
      default: 0.15,
      required: false,
    },
  },
  setup(props) {
    return () => <Ellipse {...props} radius={[props.radius, props.radius]} />;
  },
});
