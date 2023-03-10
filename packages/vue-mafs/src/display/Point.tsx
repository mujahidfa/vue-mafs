import { computed, defineComponent } from "vue";
import { useTransformContext } from "../context/TransformContext";
import { Theme } from "./Theme";
import { vec } from "../vec";

export interface PointProps {
  x: number;
  y: number;
  color?: string;
  opacity?: number;
}

export const Point = defineComponent({
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, default: Theme.foreground, required: false },
    opacity: { type: Number, default: 1, required: false },
  },
  setup(props) {
    const { viewTransform: pixelMatrix, userTransform: transform } =
      useTransformContext();

    const coor = computed(() =>
      vec.transform(
        [props.x, props.y],
        vec.matrixMult(pixelMatrix.value, transform.value)
      )
    );

    return () => (
      <circle
        cx={coor.value[0]}
        cy={coor.value[1]}
        r={6}
        style={{ fill: props.color, opacity: props.opacity }}
      />
    );
  },
});
