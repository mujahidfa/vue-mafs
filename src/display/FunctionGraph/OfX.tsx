import { computed, defineComponent, type PropType } from "vue";
import { round } from "../../math";
import { usePaneContext } from "../../view/PaneManager";
import type { Stroked } from "../../display/Theme";
import { useScaleContext } from "../../view/ScaleContext";

export interface OfXProps extends Stroked {
  y: (x: number) => number;
  quality?: "low" | "medium" | "high";
}

export const OfX = defineComponent({
  name: "FunctionGraphOfX",
  props: {
    y: {
      type: Function as PropType<(x: number) => number>,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    quality: {
      type: String as PropType<"low" | "medium" | "high">,
      default: "low",
      validator(prop: string) {
        return ["low", "medium", "high"].includes(prop);
      },
      required: false,
    },
    weight: {
      type: Number,
      default: 3,
      required: false,
    },
    opacity: {
      type: Number,
      default: 1,
      required: false,
    },
    style: {
      type: String as PropType<"solid" | "dashed">,
      required: false,
      validator(prop: string) {
        return ["solid", "dashed"].includes(prop);
      },
    },
  },
  setup(props) {
    const { cssScale } = useScaleContext();
    const { xPanes: panes, yPaneRange } = usePaneContext();

    const d = computed(() => {
      // Ignore points that are very high or low
      const yUpperBound = yPaneRange.value[1];
      const yLowerBound = yPaneRange.value[0];

      let subsampling: number;
      switch (props.quality) {
        case "low":
          subsampling = 0.5;
          break;
        case "medium":
          subsampling = 1;
          break;
        case "high":
          subsampling = 2;
          break;
      }

      const getSegment = (min: number, max: number) => {
        const dx = (max - min) / (500 * subsampling);

        let points = "";

        for (let x = min; x <= max; x += dx) {
          const yx = props.y(x);
          if (yx <= yUpperBound && yx >= yLowerBound) {
            points += ` ${round(x, 3)} ${round(yx, 3)} `;
          }
        }

        return points;
      };

      return `M ${panes.value
        .map(([min, max]) => getSegment(min, max))
        .join(" ")}`;
    });

    return () => (
      <path
        d={d.value}
        stroke-width={props.weight}
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        strokeDasharray={props.style === "dashed" ? "3,8" : undefined}
        transform={cssScale.value}
        style={{
          stroke: props.color || "var(--mafs-fg)",
          opacity: props.opacity,
          vectorEffect: "non-scaling-stroke",
        }}
      />
    );
  },
});
