import { computed, defineComponent, type PropType } from "vue";
import { type Filled, Theme } from "./Theme";
import { useScaleContext } from "../view/ScaleContext";
import type { Vector2 } from "../vec";
import { useTransformContext } from "./Transform";
import * as vec from "../vec";

export interface EllipseProps extends Filled {
  center: Vector2;
  radius: Vector2;
  angle?: number;
}

export const Ellipse = defineComponent({
  props: {
    center: {
      type: Object as PropType<Vector2>,
      required: true,
    },
    radius: {
      type: Object as PropType<Vector2>,
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
    const { pixelMatrix } = useScaleContext();
    const contextTransform = useTransformContext();

    const transform = computed(() =>
      vec
        .matrixBuilder()
        .translate(...props.center)
        .mult(contextTransform.value)
        .scale(1, -1)
        .mult(pixelMatrix.value)
        .scale(1, -1)
        .get()
    );

    const cssTransform = computed(() => {
      // const [a, c, tx, b, d, ty] = transform;
      const a = transform.value[0];
      const b = transform.value[3];
      const c = transform.value[1];
      const d = transform.value[4];
      const tx = transform.value[2];
      const ty = transform.value[5];

      return `
        matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})
        rotate(${props.angle * (180 / Math.PI)})
    `;
    });

    return () => (
      <ellipse
        cx={0}
        cy={0}
        rx={props.radius[0]}
        ry={props.radius[1]}
        stroke-width={props.weight}
        stroke-dasharray={props.strokeStyle === "dashed" ? "4,3" : undefined}
        transform={cssTransform.value}
        style={{
          stroke: props.color,
          fill: props.color,
          fillOpacity: props.fillOpacity,
          strokeOpacity: props.strokeOpacity,
          vectorEffect: "non-scaling-stroke",
        }}
      />
    );
  },
});
