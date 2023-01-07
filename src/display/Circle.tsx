import { defineComponent, type PropType } from "vue";
import type { Filled } from "./Theme";
import { Ellipse } from "./Ellipse";
import type { Vector2 } from "../vec";

export interface CircleProps extends Filled {
  center: Vector2;
  radius: number;
}

export const Circle = defineComponent({
  props: {
    center: {
      type: Object as PropType<Vector2>,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return () => <Ellipse {...props} radius={[props.radius, props.radius]} />;
  },
});
