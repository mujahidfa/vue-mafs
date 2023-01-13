import { computed, defineComponent, type PropType } from "vue";
import { useScaleContext } from "../view/ScaleContext";
import * as vec from "../vec";
import { useTransformContext } from "./Transform";

export type CardinalDirection =
  | "n"
  | "ne"
  | "e"
  | "se"
  | "s"
  | "sw"
  | "w"
  | "nw";

export interface TextProps {
  x: number;
  y: number;
  attach?: CardinalDirection;
  attachDistance?: number;
  size?: number;
  color?: string;
}

export const Text = defineComponent({
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    size: {
      type: Number,
      default: 30,
      required: false,
    },
    attach: {
      type: String as PropType<CardinalDirection>,
      required: false,
    },
    attachDistance: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  setup(props, { slots }) {
    const { pixelMatrix } = useScaleContext();
    const transformContext = useTransformContext();

    const derived = computed(() => {
      let xOffset = 0;
      let textAnchor = "middle";
      if (props.attach?.includes("w")) {
        textAnchor = "end";
        xOffset = -1;
      } else if (props.attach?.includes("e")) {
        textAnchor = "start";
        xOffset = 1;
      }

      let yOffset = 0;
      let dominantBaseline = "middle";
      if (props.attach?.includes("n")) {
        dominantBaseline = "baseline";
        yOffset = 1;
      } else if (props.attach?.includes("s")) {
        dominantBaseline = "hanging";
        yOffset = -1;
      }

      let [pixelX, pixelY] = [0, 0];
      if (xOffset !== 0 || yOffset !== 0) {
        [pixelX, pixelY] = vec.withMag(
          [xOffset, yOffset],
          props.attachDistance
        );
      }

      return {
        textAnchor,
        dominantBaseline,
        yOffset,
        pixel: [pixelX, pixelY],
      };
    });

    const pixelX = computed(() => derived.value.pixel[0]);
    const pixelY = computed(() => derived.value.pixel[1]);

    const center = computed(() =>
      vec.transform(
        [props.x, props.y],
        vec.matrixMult(pixelMatrix.value, transformContext.value)
      )
    );

    return () => (
      <text
        x={center.value[0] + pixelX.value}
        y={center.value[1] + pixelY.value}
        font-size={props.size}
        dominant-baseline={derived.value.dominantBaseline}
        text-anchor={derived.value.textAnchor}
        style={{
          fill: props.color || "var(--mafs-fg)",
          vectorEffect: "non-scaling-stroke",
        }}
        class="mafs-shadow"
      >
        {slots?.default?.()}
      </text>
    );
  },
});
