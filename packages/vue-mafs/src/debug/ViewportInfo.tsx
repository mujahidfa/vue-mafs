import { computed, defineComponent } from "vue";
import { useCoordinateContext } from "../context/CoordinateContext";
import { usePaneContext } from "../context/PaneContext";
import { useTransformContext } from "../context/TransformContext";
import { vec } from "../vec";

export interface PaneVisualizerProps {
  /** The number of decimal places to which to round the displayed values. */
  precision?: number;
}

export const ViewportInfo = defineComponent({
  name: "DebugViewportInfo",
  props: {
    precision: {
      type: Number,
      default: 3,
      required: false,
    },
  },
  setup(props) {
    const { xMin, xMax, yMin, yMax } = useCoordinateContext();
    const { viewTransform } = useTransformContext();
    const { xPanes, yPanes } = usePaneContext();

    const coor = computed(() =>
      vec.transform([xMin.value, yMin.value], viewTransform.value)
    );

    const x = computed(() => coor.value[0]);
    const y = computed(() => coor.value[1]);

    const xPanesString = computed(() =>
      xPanes.value.map((pane) => `(${pane.join(", ")})`).join("   ")
    );
    const yPanesString = computed(() =>
      yPanes.value.map((pane) => `(${pane.join(", ")})`).join("   ")
    );

    return () => (
      <g class="mafs-shadow" font-family="monospace">
        <text x={x.value + 10} y={y.value - 70}>
          x: ({xMin.value.toFixed(props.precision)},{" "}
          {xMax.value.toFixed(props.precision)})
        </text>
        <text x={x.value + 10} y={y.value - 50}>
          y: ({yMin.value.toFixed(props.precision)},{" "}
          {yMax.value.toFixed(props.precision)})
        </text>
        <text x={x.value + 10} y={y.value - 30}>
          xPanes: {xPanesString.value}
        </text>
        <text x={x.value + 10} y={y.value - 10}>
          yPanes: {yPanesString.value}
        </text>
      </g>
    );
  },
});
