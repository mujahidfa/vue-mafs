import { computed, defineComponent, type PropType } from "vue";
import type { Stroked } from "../display/Theme";
import { Theme } from "./Theme";
import { vec } from "../vec";
import { useTransformContext } from "../context/TransformContext";

// This is sort of a hack—every SVG pattern on a page needs a unique ID, otherwise they conflict.
let incrementer = 0;

export interface VectorProps extends Stroked {
  tail?: vec.Vector2;
  tip: vec.Vector2;
}

export const Vector = defineComponent({
  props: {
    tail: {
      type: Object as PropType<vec.Vector2>,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: () => [0, 0],
      required: false,
    },
    tip: {
      type: Object as PropType<vec.Vector2>,
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
    lineStyle: {
      type: String as PropType<"solid" | "dashed">,
      default: "solid",
      required: false,
    },
    opacity: {
      type: Number,
      default: 1.0,
      required: false,
    },
  },
  setup(props) {
    const { userTransform, viewTransform } = useTransformContext();
    const combinedTransform = computed(() =>
      vec.matrixMult(viewTransform.value, userTransform.value)
    );

    const pixelTail = computed(() =>
      vec.transform(props.tail, combinedTransform.value)
    );
    const pixelTip = computed(() =>
      vec.transform(props.tip, combinedTransform.value)
    );

    const id = `mafs-triangle-${incrementer++}`;

    return () => (
      <>
        <defs>
          <marker
            id={id}
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="4"
            orient="auto"
          >
            <path
              d="M 0 0 L 8 4 L 0 8 z"
              fill={props.color || "var(--mafs-fg)"}
            />
          </marker>
        </defs>
        <line
          x1={pixelTail.value[0]}
          y1={pixelTail.value[1]}
          x2={pixelTip.value[0]}
          y2={pixelTip.value[1]}
          stroke-width={props.weight}
          marker-end={`url(#${id})`}
          stroke-dasharray={props.lineStyle === "dashed" ? "4,3" : undefined}
          style={{
            stroke: props.color || "var(--mafs-fg)",
            strokeOpacity: props.opacity,
            vectorEffect: "non-scaling-stroke",
          }}
        />
      </>
    );
  },
});
